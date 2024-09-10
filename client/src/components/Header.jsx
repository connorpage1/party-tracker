import { useContext } from "react";
import { Image, Button} from "semantic-ui-react";
import { GlobalContext } from "../context/GlobalProvider";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Header = () => {
    const { user, JWTHeader, updateUser} = useContext(GlobalContext)
    const navigate = useNavigate()

    const logout = () => {
        fetch('api/v1/logout', {
            method: 'DELETE',
            headers: {
                ...JWTHeader
            }
        }).then(res => {
            if (res.ok) {
                updateUser(null)
                navigate('/')
            }
        })
    }

    if(!user) {
        return(
            <div className="header">
                <Image src='/tchoup-black.png' size='tiny' />
                <h2>Party Tracker</h2>
                <p>Please login to continue</p>
            </div>
        )
    }
    return (
        <div className="header">
            <Image src='/tchoup-black.png' size='tiny' />
            <h2>Party Tracker</h2>
            <div className="header-logout">
                <p>Hello, {user.name}</p>
                <Button size='mini' onClick={logout}>Logout</Button>
            </div>
            <Navbar />
        </div>
    );
}

export default Header