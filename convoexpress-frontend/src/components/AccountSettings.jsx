import React from 'react'
import { useGlobalContext } from '../context/global'
import axios from 'axios'

const AccountSettings = () => {

    const {setId,setUsername, setWs, setShowUpdateForm} = useGlobalContext();

    const deleteAccount = async (userId) => {
        try{
            await axios.delete(`/api/delete/${userId}`);
            setWs(null)
            setId(null);
            setUsername(null);
        }catch(err){
            console.log('error',err);
        }
    };

    const logoutUser = async () => {
        try {
            await axios.post('/api/logout');
            setWs(null);
            setId(null);
            setUsername(null);
        }catch(err){
            console.log('Error logging out', err);
        }
    };

  return (
    <div className='p-4 text-sm flex flex-col items-center gap-4'>
        <p className='text-text-fade'>Account Settings</p>
        <div className='w-full flex justify-between underline text-accent'>
            <button className='hover:text-white' onClick={() => deleteAccount(id)}>Delete</button>
            <button className='hover:text-white' onClick={() => setShowUpdateForm(prev => !prev)}>Update</button>
            <button className='hover:text-white' onClick={logoutUser}>Logout</button>
        </div>
    </div>
  )
}

export default AccountSettings