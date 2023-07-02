import React, {useState} from 'react'
import axios from 'axios'
import { useGlobalContext } from '../context/global'


const RegisterForm = () => {

const {username, setUsername, id, setId} = useGlobalContext()


  const [inputState, setInputState] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e) => {
    setInputState({...inputState, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const {data} = await axios.post('/api/register', {...inputState})
      setUsername(data.username)
      setId(data.id)
    }catch(err){
      console.log('Error: ',err)
    }
  }

  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-10'>
    <h1 className='text-3xl text-white font-bold'>Signup to ConvoExpress</h1>
    <form 
    className='w-1/2 flex flex-col gap-5'
    onSubmit={handleSubmit}
    >
        <input 
        className='text-white caret-inherit p-2 bg-secondary' 
        type="text" 
        name='username' 
        placeholder='Username'
        onChange={handleChange}
         />
        <input 
        className='text-white caret-inherit p-2 bg-secondary' 
        type="password" 
        name='password' 
        placeholder='Password' 
        onChange={handleChange}
        />
        
        <button className='p-2 w-2/3 mx-auto bg-accent text-white'>Sign up</button>
    </form>
</div>
  )
}

export default RegisterForm