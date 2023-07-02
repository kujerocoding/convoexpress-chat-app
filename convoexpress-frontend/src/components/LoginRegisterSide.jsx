import React from 'react'

const LoginRegisterSide = ({isLoginOrRegister, setIsLoginOrRegister}) => {

  const conditionalButton = isLoginOrRegister === 'login' ? 
      <button className='p-2 w-2/3 mx-auto bg-white text-accent'
      onClick={() => setIsLoginOrRegister('register')}>Sign up</button> : 
      <button className='p-2 w-2/3 mx-auto bg-white text-accent'
      onClick={() => setIsLoginOrRegister('login')}>Sign in</button>

  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-5 text-center'>
        <h1 className='text-3xl text-white'>{isLoginOrRegister === 'login' ? 'Discover new Connections' : 'Already have an account?'}</h1>
        <p className='text-text-fade'>Connect, Chat, and Create!</p>
        {conditionalButton}
    </div>
  )
}

export default LoginRegisterSide