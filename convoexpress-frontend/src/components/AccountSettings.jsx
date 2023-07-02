import React from 'react'
import { useGlobalContext } from '../context/global';

const AccountSettings = () => {

    const {setId,setUsername, setWs, setShowUpdateForm} = useGlobalContext()


    const deleteThisAccount = async (userId) => {
        try{
            await axios.delete(`/api/delete/${userId}`);
            setWs(null)
            setId(null);
            setUsername(null);
        }catch(err){
            console.log('error',err);
        }
    };

    const logout = async () => {
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
            <button className='hover:text-white' onClick={() => deleteThisAccount(id)}>Delete</button>
            <button className='hover:text-white' onClick={() => setShowUpdateForm(prev => !prev)}>Update</button>
            <button className='hover:text-white' onClick={logout}>Logout</button>
        </div>
    </div>
  )
}

export default AccountSettings