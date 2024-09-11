import {createContext, useEffect, useState} from "react";
import responseParser from "../components/error-handling/response_parser";
import toast from "react-hot-toast";

export const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }
    
    const JWTHeader = {
        "X-CSRF-TOKEN": getCookie("csrf_access_token")}
    
    useEffect(() => {
        fetch('/api/v1/me', {
            headers: {
                ...JWTHeader
            }
        }).then(res => {
            if (res.ok) {
                res.json()
                .then(setUser)
            } else {
                throw responseParser(res)
            }
        }).catch(error => toast.error(error.error))
    }, [])

    const updateUser = (value) => {
        setUser(value)
    }
    return (
        <GlobalContext.Provider value={{JWTHeader, user, updateUser}}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider