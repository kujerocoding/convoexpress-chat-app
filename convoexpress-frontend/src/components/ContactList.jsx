import React from 'react'
import { useGlobalContext } from '../context/global'
import Avatar from './Avatar'

const ContactList = () => {

    const {id, onlineUser,offlineUser, setSelectedContact, selectedContactId,setSelectedContactId, messages} = useGlobalContext()

    const excludeLoggedInUser = {...onlineUser};
    delete excludeLoggedInUser[id];

    const offlinePeople = {...offlineUser};

    const selectContact = (userId, username) => {
        setSelectedContactId(userId);
        setSelectedContact(username);
    }


  return (
    <div className='flex-grow mt-5 overflow-y-auto'>
        <div className='w-full h-full overflow-y-auto'>
        <div className=''>
            {Object.keys(excludeLoggedInUser)?.map(userId => 
                <div 
                key={userId} 
                className={`${selectedContactId === userId ? 'bg-contactBG': '' } flex py-2 items-center gap-4 cursor-pointer border-t border-gray-700`}
                onClick={() => selectContact(userId, onlineUser[userId])}
                >
                    <div className='flex items-center justify-between w-full'>
                        <Avatar username={onlineUser[userId]}/>
                        <div className='mr-4 w-3 h-3 rounded-full bg-green-500'></div>
                    </div>
                </div>
            )}
        </div>
        <div>
            {Object.keys(offlinePeople)?.map(userId => 
                <div 
                key={userId} 
                className={`${selectedContactId === userId ? 'bg-contactBG': '' } flex py-2 items-center gap-4 cursor-pointer border-t border-gray-700`}
                onClick={() => selectContact(userId, offlinePeople[userId].username)}
                >
                    <div className='flex items-center justify-between w-full'>
                        <Avatar username={offlinePeople[userId].username}/>
                        <div className='mr-4 w-3 h-3 rounded-full bg-gray-500'></div>
                    </div>
                </div>
            )}
        </div>
        </div>
</div>
  )
}

export default ContactList