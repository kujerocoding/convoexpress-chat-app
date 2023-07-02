import React, { useState } from 'react'
import LoginForm from './LoginForm'
import LoginRegisterSide from './LoginRegisterSide'
import RegisterForm from './RegisterForm'


const HomePage = () => {
    
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('login')
  return (
    <main className='w-10/12 md:w-8/12 flex flex-col md:flex-row justify-center mx-auto gap-5'>
        <section className='w-full md:w-4/6 h-[500px] bg-primary-fade'>
       { isLoginOrRegister === 'login' ? <LoginForm /> : <RegisterForm  />}
        </section>
        <section className='w-full md:w-2/6 h-[500px] bg-primary'>
        <LoginRegisterSide isLoginOrRegister={isLoginOrRegister} setIsLoginOrRegister={setIsLoginOrRegister}/>
        </section>
    </main>
  )
}

export default HomePage