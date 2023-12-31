import React, { useEffect, useRef} from 'react'
import { useGlobalContext } from '../context/global'
import Avatar from './Avatar'

import axios from 'axios'
import ContactList from './ContactList'
import ContactHeader from './ContactHeader'
import AccountSettings from './AccountSettings'
import Chatbox from './Chatbox'

const ChatPage = () => {

    const { 
        id, 
        selectedContactId, 
        onlineUser, 
        selectedContact,
        setOnlineUser,
        ws,
        setWs,
        inputMessage,
        messages,
        setMessages,
        setInputMessage,
        setOfflineUser
     } = useGlobalContext()

    const divBelowMessages = useRef();
    

    useEffect(() => {
        connectToWebSocket();
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
    };

    const showOnline = (peopleArray) => {
        const people = {};
        peopleArray.forEach(({userId, username}) => {
            people[userId] = username
        })
        setOnlineUser(people);
    };


    const handleMessage = (e) => {
        const messageData = JSON.parse(e.data)
        if('online' in messageData){
            showOnline(messageData.online)
        }else if(messageData.sender === selectedContactId){
            setMessages(prevMessages => ([...prevMessages, {...messageData}]));
        }
    };
    
    const sendMessage = (e) => {
        e.preventDefault();
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
        
    };

    useEffect(() => {
        const div = divBelowMessages.current;
        div?.scrollIntoView({behavior: 'smooth', block: 'end'})
    },[messages]);

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
        };
        fetchPeople();
    },[onlineUser]);

  return (
    <main className='w-10/12 md:w-8/12 flex flex-col md:flex-row justify-center mx-auto gap-5'>
        <section className='w-full md:w-2/6 h-[500px] bg-primary text-white flex flex-col'>
            <ContactHeader />
            <ContactList />
            <AccountSettings />
        </section>
        <section className='relative p-5 w-full md:w-4/6 h-[500px] flex flex-col bg-primary-fade rounded-md'>
            <div className='w-full absolute top-0 left-0 right-0 border-b border-gray-700 p-4'>
                {selectedContact && <Avatar username={selectedContact}/>}
            </div>
            <div className='flex-grow overflow-y-scroll overflow-x-hidden mt-16 my-4'>
                <Chatbox />
                <div ref={divBelowMessages}></div>
            </div>
            <form className='flex gap-2 items-center' onSubmit={sendMessage}>
                <input
                disabled={!!selectedContactId ? false: true }
                className='p-2 w-full bg-secondary rounded-md text-white text-sm' 
                type="text" placeholder='Type your message here...' 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                />
                <div className='text-accent font-bold'>
                    <button>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    </button>
                </div>
            </form>
        </section>
    </main>
  )
}

export default ChatPage