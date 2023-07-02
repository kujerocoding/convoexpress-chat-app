import React from 'react';
import { useGlobalContext } from '../context/global';
import {uniqBy} from 'lodash';

const Chatbox = () => {

    const {id, selectedContactId, messages} = useGlobalContext();
    const messagesWithoutDuplicate = uniqBy(messages, '_id')

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
                    <p className='text-xs text-text-fade'>{getManilaTime(message.createdAt) === 'Invalid Date' ? 'Now' : getManilaTime(message.createdAt)}</p>
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