import React from 'react'

const Avatar = ({username}) => {

  return (
    <div className='flex gap-4 items-center'>
      <div className='w-10 h-10 rounded-full bg-white text-secondary text-center uppercase font-bold ml-4'>
          <p className='mt-2'>{username?.charAt(0)}</p>
      </div>
      <p className='capitalize text-white'>{username}</p>
    </div>

  )
}

export default Avatar