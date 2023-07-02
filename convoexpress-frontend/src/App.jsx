import React from 'react'
import HomePage from './components/HomePage'
import axios from 'axios'
import { useGlobalContext } from './context/global';
import ChatPage from './components/ChatPage';

const App = () => {

  axios.defaults.baseURL = 'http://127.0.0.1:4000';
  axios.defaults.withCredentials = true;

  const {username} = useGlobalContext()
  
  return (
      <>
        {!username ? <HomePage /> : <ChatPage />}
      </>
  )
}

export default App