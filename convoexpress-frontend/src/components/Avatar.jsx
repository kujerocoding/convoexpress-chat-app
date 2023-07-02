import React from 'react'

const Avatar = ({userId, username}) => {
  return (
    <div className='w-10 h-10 rounded-full bg-white text-secondary text-center uppercase font-bold ml-4'>
        <p className='mt-2'>{username[0]}</p>
    </div>
  )
}

export default Avatar