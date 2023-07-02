import React, {useState} from 'react'
import { useGlobalContext } from '../context/global'
import axios from 'axios';

const UpdateForm = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {id, setUsername:setLoggedinUsername} = useGlobalContext();
  const [result, setResult] = useState(null)

  const updateUser = async () => {
    try {
      const response = await axios.put(`/api/update/${id}`, { username, password });
      setResult(response.data);
      console.log(result);
      setUsername('');
      setPassword('');
      setLoggedinUsername(username);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  return (
    <div className='absolute top-0 left-0 bg-primary w-full h-full flex flex-col justify-center items-center'>
      <h1>Update User</h1>
      
        <input
        className='text-white caret-inherit p-2 bg-secondary'
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder='New username'
        />
      
      <br />
      
        
        <input 
        className='text-white caret-inherit p-2 bg-secondary'
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder='New password'
        />
      
      <br />
      {result && <p>{result}</p>}
      <button 
      className='p-2 w-2/3 mx-auto bg-accent text-white'
      onClick={updateUser}>Update User</button>
    </div>
  )
}

export default UpdateForm