import React, { useEffect, useRef, useState } from 'react'
import { useGlobalContext } from '../context/global'
import Avatar from './Avatar'
import {uniqBy} from 'lodash'
import axios from 'axios'
import UpdateForm from './UpdateForm'
import ContactList from './ContactList'
import ContactHeader from './ContactHeader'
import AccountSettings from './AccountSettings'

const ChatPage = () => {
    
    const {username, 
        id, 
        setUsername, 
        setId, 
        selectedContactId, 
        onlineUser, 
        selectedContact,
        setOnlineUser,
        ws,
        setWs,
        showUpdateForm
     } = useGlobalContext()
    //const [ws, setWs] = useState(null)
    //const [onlineUser, setOnlineUser] = useState([])
    const [offlineUser, setOfflineUser] = useState([])
    //const [selectedContactId, setSelectedContactId] = useState(null)
    const [inputMessage, setInputMessage] = useState('')
    const [messages, setMessages] = useState([])
    const divBelowMessages = useRef()
    //const [selectedContact, setSelectedContact] = useState(null)
    //const [showUpdateForm, setShowUpdateForm] = useState(false)
    
    
    

    useEffect(() => {
        connectToWebSocket()
    }, [selectedContactId])

    const connectToWebSocket = async () => {
        const ws = new WebSocket('ws://127.0.0.1:4000')
        setWs(ws)
        ws.addEventListener('message', handleMessage)
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('Reconnecting...');
                connectToWebSocket();
            }, 1000)
        })
    }

    const showOnline = (peopleArray) => {
        const people = {};
        peopleArray.forEach(({userId, username}) => {
            people[userId] = username
        })
        setOnlineUser(people)
    }


    const handleMessage = (e) => {
        const messageData = JSON.parse(e.data)
        if('online' in messageData){
            showOnline(messageData.online)
        }else if(messageData.sender === selectedContactId){
            setMessages(prevMessages => ([...prevMessages, {...messageData}]));
        }
    };

    const excludeLoggedInUser = {...onlineUser}
    delete excludeLoggedInUser[id]

    const messagesWithoutDuplicate = uniqBy(messages, '_id')

    const sendMessage = (e) => {
        e.preventDefault()
        ws.send(JSON.stringify({
           
                recipient: selectedContactId,
                text: inputMessage
            
        }))
        setInputMessage('')
        setMessages(prevMessages => ([...prevMessages, {
            text: inputMessage, 
            sender:id, 
            recipient: selectedContactId,
            _id: Date.now()
        }]))

    }

    useEffect(() => {
        const div = divBelowMessages.current;
        div?.scrollIntoView({behavior: 'smooth', block: 'end'})
    },[messages])

    useEffect(() => {
        const fetchMessageData = async () => {
            if(selectedContactId){
                const messages = await axios.get(`/api/messages/${selectedContactId}`);
                setMessages(messages.data)
            }
        };
        fetchMessageData();
    },[selectedContactId]);

    useEffect(() => {
        const fetchPeople = async () => {
            const people = await axios.get('/api/people');
            const offLinePeopleArray = people.data.filter(person => person._id !== id).filter(person => !Object.keys(onlineUser).includes(person._id));
            const offLine = {};
            offLinePeopleArray.forEach(person => {
                offLine[person._id] = person
            });
            setOfflineUser(offLine);
            console.log('offlinearray', offLinePeopleArray)
            console.log('offlineobject',offLine)
        };
        fetchPeople();
    },[onlineUser]);

    /* const handleClick = (userId, username) => {
        setSelectedContactId(userId)
        setSelectedContact(username)
    } */

/*     const logout = async () => {
        try {
            await axios.post('/api/logout');
            setWs(null);
            setId(null);
            setUsername(null);
        }catch(err){
            console.log('Error logging out', err);
        }
    }; */

/*     const deleteThisAccount = async (userId) => {
        try{
            await axios.delete(`/api/delete/${userId}`);
            setWs(null)
            setId(null);
            setUsername(null);
        }catch(err){
            console.log('error',err);
        }
    } */
    
const conditionalRender = selectedContactId ? 
        <div className='flex flex-col justify-end gap-4 text-sm'>
            {messagesWithoutDuplicate.map((message) => (
                <div key={message._id}
                className={`${message.sender === id ? 
                    'text-right bg-secondary text-white self-end' : 
                    ' text-white bg-gray-700 self-start'} 
                    p-2 mr-2 w-2/3 rounded-md`}
                    >
                    <p className='break-words text-left'>{message.text}</p>
                </div>
                
            ))}
        </div> : 
        <div className='flex-grow flex flex-col justify-center items-center'>
            <p>No chat selected</p>
        </div>

  return (
    <main className='w-10/12 md:w-8/12 flex flex-col md:flex-row justify-center mx-auto gap-5'>
        <section className='w-full md:w-2/6 h-[500px] bg-primary text-white flex flex-col'>
            <ContactHeader />
            <ContactList />
            <AccountSettings />
        </section>
        <section className='relative p-5 w-full md:w-4/6 h-[500px] flex flex-col bg-primary-fade rounded-md'>
            <div className='w-full absolute top-0 left-0 right-0'>
                <p className='capitalize text-white'>{selectedContact}</p>
            </div>
            <div className='flex-grow overflow-y-scroll overflow-x-hidden mt-6 my-4'>
            {conditionalRender}
            <div ref={divBelowMessages}></div>
            </div>
            <form className='relative' onSubmit={sendMessage}>
                <input
                disabled={!!selectedContactId ? false: true }
                className='p-2 w-11/12 bg-secondary rounded-md text-white text-sm' 
                type="text" placeholder='Type a message...' 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                />
                <div className='absolute top-2 right-0 text-accent font-bold'>
                <button>Send</button>
                </div>
            </form>
            {showUpdateForm && <UpdateForm />}
        </section>
    </main>
  )
}

export default ChatPage