import React from 'react'
import { useGlobalContext } from '../context/global'
import Avatar from './Avatar'

const ContactList = () => {

    const {id, onlineUser, setSelectedContactId, setSelectedContact, selectedContactId } = useGlobalContext()


    const excludeLoggedInUser = {...onlineUser};
    delete excludeLoggedInUser[id];

    const handleClick = (userId, username) => {
        setSelectedContactId(userId)
        setSelectedContact(username)
    }

  return (
    <div className='flex-grow mt-5'>
        <div className='w-full h-full overflow-y-auto'>
        <div className=''>
            {Object.keys(excludeLoggedInUser)?.map(userId => 
                <div 
                key={userId} 
                className={`${selectedContactId === userId ? 'bg-contactBG': '' } flex py-2 items-center gap-4 cursor-pointer border-t border-gray-700`}
                onClick={() => handleClick(userId, onlineUser[userId])}
                >
                    <Avatar username={onlineUser[userId]} userId={userId}/>
                    <p className='capitalize'>{onlineUser[userId]}</p>
                </div>
            )}
        </div>
        </div>
</div>
  )
}

export default ContactList