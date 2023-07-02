import React, {useState} from 'react'
import axios from 'axios'
import { useGlobalContext } from '../context/global'

const LoginForm = () => {

  const {username, setUsername, setId} = useGlobalContext();
  const [error, setError] = useState(null)

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
      const {data} = await axios.post('/api/login', {...inputState})
      setUsername(data.username)
      setId(data.id)
      console.log(username)
      setError(data)
    }catch(err){
      console.log('Error: ',err)
    }
  }

  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-10'>
        <h1 className='text-3xl text-white font-bold'>Login to ConvoExpress</h1>
        <form 
        onSubmit={handleSubmit}
        className='w-1/2 flex flex-col gap-5'>
            <input 
            className='text-white caret-inherit p-2 bg-secondary' 
            type="text" 
            placeholder='Username' 
            name='username'
            onChange={handleChange}
            />
            <input 
            className='text-white caret-inherit p-2 bg-secondary' 
            type="password" 
            placeholder='Password' 
            name='password'
            onChange={handleChange}
            />
            {error && <p className='text-red-400 text-center'>{error}</p>}
            <button 
            className='p-2 w-2/3 mx-auto bg-accent text-white'>Sign in</button>
        </form>
    </div>
  )
}

export default LoginForm