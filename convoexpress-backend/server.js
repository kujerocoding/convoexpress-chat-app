const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const websocket = require('ws')
const Message = require('./models/Message')

dotenv.config()
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(cookieParser())
const port = process.env.PORT
const jwtKey = process.env.JWT_KEY
const salt = bcrypt.genSaltSync(15)

mongoose.connect(process.env.MONGODB_URL)

const getUserDataFromRequest = (req) => {
    return new Promise ((resolve,reject) => {
        const token = req.cookies?.token;
        if(token){
            jwt.verify(token, jwtKey, {}, (err, userData) => {
            if(err) throw err;
            resolve(userData)
        })
        }else{
        reject('No token')
    }
    })
}

app.get('/api/profile', async(req,res) => {
    
    const token = req.cookies?.token;
    if(token){
        jwt.verify(token, jwtKey, {}, (err, userData) => {
            if(err) throw err;
            res.json(userData)
        })
    }else{
        res.status(401).json({error: 'No token'})
    }
})
//3:35 TS
app.get('/api/messages/:userId', async (req,res) => {
    const {userId} = req.params
    const userData = await getUserDataFromRequest(req)
    console.log(userId,userData)
    const myUserId = userData.userId
    const messages = await Message.find({
        sender: {$in:[userId,myUserId]},
        recipient:{$in:[userId,myUserId]}
    }).sort({createdAt: 1});
    res.json(messages)

});

app.get('/api/people', async(req,res) => {
    const people = await User.find({}, {'_id':1, username: 1});
    res.json(people);
});

app.post('/api/login', async (req,res) => {
    const {username, password } = req.body;
    const foundUser = await User.findOne({username})
    if(foundUser){
      const passMatch = bcrypt.compareSync(password, foundUser.password)
      if(passMatch){
        
        jwt.sign({userId:foundUser._id, username}, jwtKey, {}, (err,token) => {
            res.cookie('token', token, {sameSite: 'none', secure: true}).json({
                id: foundUser._id,
                username: foundUser.username
            });
        });
        
      }else{
        res.send('Invalid password');
      }
    }else{
        res.send('User not found');
    }
});

app.post('/api/logout', (req,res) => {
    res.cookie('token', '', {sameSite: 'none', secure:true}).json('ok');
});

app.post('/api/register', async (req, res) => {
    const {username, password} = req.body
    try{
        const hashedPassword = bcrypt.hashSync(password, salt)
        const createdUser = await User.create({
            username: username, 
            password:hashedPassword})
        jwt.sign({userId:createdUser._id, username}, jwtKey, {}, (err,token) => {
        if(err) throw err;
        res.cookie('token', token, {sameSite: 'none', secure: true}).status(201).json({id: createdUser._id, username: createdUser.username})
    })
    }catch(err){
        if(err) throw err;
        res.status(500).json({error: 'An error occured'})
    }
    
});

app.put('/api/update/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const { username, password } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(userId, { username, password }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }else{
        return res.send('User updated successfully')
      }
  
     
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.delete('/api/delete/:userId', async (req,res) => {
    try{
        const userId = req.params.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        if(!deletedUser){
            return res.json({message: 'User not found'});
        }else{
            res.cookie('token', '', {sameSite: 'none', secure:true});
            return res.json({message: 'User deleted successfully'});
        }
    }catch(err){
        console.log(err)
    }
});


const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

const wss = new websocket.WebSocketServer({server})

wss.on('connection', (connection, req) => {

    const notifyAboutOnlineUser = () => {
        [...wss.clients].forEach(client => {
            client.send(JSON.stringify({
                online: [...wss.clients].map(connection => ({
                    userId: connection.userId, 
                    username: connection.username
                }))
            }))
        })
    }

    //4:32 TS
   /*  connection.isAlive = true;

    connection.timer = setInterval(() => {
        connection.ping();
        connection.deathTimer = setTimeout(() => {
            connection.isAlive = false;
            clearInterval(connection.timer);
            connection.terminate();
            notifyAboutOnlineUser();
            console.log('dead');
        },1000);
    },5000); */

    // Function to handle the death of the connection
    const handleConnectionDeath = () => {
        connection.isAlive = false;
        clearInterval(connection.timer);
        connection.terminate();
        notifyAboutOnlineUser();
        console.log('dead');
    };
    // Set up the periodic connection check
    connection.timer = setInterval(() => {
        connection.ping();
        clearTimeout(connection.deathTimer); // Clear the previous death timer
        connection.deathTimer = setTimeout(() => {
            handleConnectionDeath
        }, 1000);
    },5000);

    connection.on('pong', () => {
        clearTimeout(connection.deathTimer)
    });

    const cookies = req.headers.cookie
    if(cookies) {
        const cookieString = cookies.split(';').find(str => str.startsWith('token='))
        if(cookieString){
            const token = cookieString.split('=')[1]
            if(token){
                jwt.verify(token, jwtKey, {}, (err, userData) => {
                    if(err) throw err;
                    const {userId, username} = userData
                    connection.userId = userId
                    connection.username = username
                })
            }
        }
    }

    connection.on('message', async (message) => {
        const messageData = JSON.parse(message.toString())
        const {recipient, text} = messageData
        if(recipient && text) {

            const messageDocument = await Message.create({
                sender: connection.userId,
                recipient,
                text
            });

           

            [...wss.clients].filter(client => client.userId === recipient).map(c => c.send(JSON.stringify({
                text,
                sender: connection.userId,
                recipient,
                _id: messageDocument._id
            })))
        }
        
    });

    notifyAboutOnlineUser();
})

wss.on('close', data => {
    console.log('disconnect', data);
});