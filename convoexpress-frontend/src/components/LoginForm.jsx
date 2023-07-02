import React, {useState} from 'react'
import axios from 'axios'
import { useGlobalContext } from '../context/global'

const LoginForm = () => {

  const {setUsername, setId} = useGlobalContext();
  const [error, setError] = useState(null);
  const [logging,setLogging] = useState('')

  const [inputState, setInputState] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e) => {
    setInputState({...inputState, [e.target.name]: e.target.value})
  }

  const loginUser = async (e) => {
    e.preventDefault();
    setLogging('Logging in...');
    try{
      const {data} = await axios.post('/api/login', {...inputState})
      setUsername(data.username)
      setId(data.id)
      setError(data)
      
    }catch(err){
      console.log('Error: ',err)
    }
  }

  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-10'>
        <h1 className='text-3xl text-white font-bold'>Login to <span className='font-lobster text-accent'>ConvoExpress</span></h1>
        <form 
        onSubmit={loginUser}
        className='w-1/2 flex flex-col gap-5'>
            <input 
            className='text-white caret-inherit p-2 bg-secondary rounded-md' 
            type="text" 
            placeholder='Username' 
            name='username'
            required
            onChange={handleChange}
            />
            <input 
            className='text-white caret-inherit p-2 bg-secondary rounded-md' 
            type="password" 
            placeholder='Password' 
            name='password'
            required
            onChange={handleChange}
            />
            {error ? <p className='text-red-400 text-center'>{error}</p> : <p className='text-text-fade text-center'>{logging}</p>}
            <button 
            className='p-2 w-2/3 mx-auto opacity-80 bg-accent text-white rounded-full hover:opacity-100'>Sign in</button>
        </form>
    </div>
  )
}

export default LoginForm