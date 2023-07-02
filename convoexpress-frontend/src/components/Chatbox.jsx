import React, { useEffect } from 'react'
import { useGlobalContext } from '../context/global'

const Chatbox = ({messagesWithoutDuplicate, sendMessage}) => {

    const {id, selectedContactId} = useGlobalContext();

    const getManilaTime = (createdAt) => {
        const timestamp = new Date(createdAt);
        const inManilaTime = timestamp.toLocaleString('en-US', {
            timeZone: 'Asia/Manila',
            hour: 'numeric',
            minute: 'numeric',
        });
        return inManilaTime;
    };

  return (
    <>
    { selectedContactId ? 
        <div className='flex flex-col justify-end gap-4 text-sm'>
            {messagesWithoutDuplicate.map((message) => (
                <div key={message._id}
                className={`${message.sender === id ? 
                    'text-right bg-secondary text-white self-end' : 
                    ' text-white bg-gray-700 self-start'} 
                    p-2 mr-2 w-2/3 rounded-md`}
                    >
                    <p className='break-words text-left'>{message.text}</p>
                    <p>{getManilaTime(message.createdAt)}</p>
                </div>
                
            ))}
        </div> : 
        <div className='w-full h-full flex-grow flex flex-col justify-center items-center text-white'>
            <p>No chat selected</p>
        </div>
    }
    </>
  )
}

export default Chatbox