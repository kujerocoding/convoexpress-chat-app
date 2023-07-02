import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'

export const GlobalContext = createContext({});

export const GlobalContextProvider = ({children}) => {

    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [offlineUser, setOfflineUser] = useState([]);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [ws, setWs] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchProfile = async () =>{
            try {
                const {data} = await axios.get('/api/profile')
                setId(data?.userId)
                setUsername(data?.username)
            }catch(err){
                console.log('Error: ',err)
            }
        }
        fetchProfile();

    },[username]);
    
    return (
        <GlobalContext.Provider value={{
            username,
            setUsername,
            id,
            setId,
            onlineUser,
            setOnlineUser,
            selectedContactId,
            setSelectedContactId,
            selectedContact,
            setSelectedContact,
            ws,
            setWs,
            inputMessage,
            messages,
            setMessages,
            setInputMessage,
            offlineUser,
            setOfflineUser
        
        }}>{children}</GlobalContext.Provider>
    )
};

export const useGlobalContext = () => useContext(GlobalContext);


















/* import React, {createContext, useContext, useState} from "react";


const Context = createContext();

export const StateContext = ({ children }) => {
   

    

    return (
        <Context.Provider
        value={{
            
          
        }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context) */