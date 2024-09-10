import {createContext} from "react";

export const PartyContext = createContext()

const PartyProvider = ({ children }) => {
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }
    
    
    return (
        <PartyContext.Provider value={getCookie}>
            {children}
        </PartyContext.Provider>
    )
}

export default PartyProvider