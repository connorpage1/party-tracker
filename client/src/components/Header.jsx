import { useContext } from "react";
import { Image, Button} from "semantic-ui-react";
import { GlobalContext } from "../context/GlobalProvider";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { user, JWTHeader } = useContext(GlobalContext)
    const navigate = useNavigate()

    const logout = () => {
        fetch('api/v1/logout', {
            method: 'DELETE',
            headers: {
                ...JWTHeader
            }
        }).then(res => {
            if (res.ok) {
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
            <p>Hello, {user.name}</p>
            <Button onClick={logout}>Logout</Button>
        </div>
    );
}

export default Header