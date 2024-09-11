import { useContext } from "react";
import { Image, Button} from "semantic-ui-react";
import { GlobalContext } from "../context/GlobalProvider";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Header = () => {
    const { user, JWTHeader, updateUser} = useContext(GlobalContext)

    if(!user) {
        return(
            <div className="header">
                <Image src='/tchoup-black.png' size='tiny' />
                <h2>Party Tracker</h2>
            </div>
        )
    }
    return (
        <div className="header">
            <Image src='/tchoup-black.png' size='tiny' />
            <h2>Party Tracker</h2>
            <Navbar />
        </div>
    );
}

export default Header