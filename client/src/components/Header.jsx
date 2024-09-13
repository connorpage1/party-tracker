import { useContext } from "react";
import { Image } from "semantic-ui-react";
import { GlobalContext } from "../context/GlobalProvider";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Header = () => {
    const { user, JWTHeader, updateUser} = useContext(GlobalContext)

    if(!user) {
        return(
            <header className="header">

                    <Image src='/tchoup-gray.png' size='tiny' />
                    <h2>Party Tracker</h2>
            </header>
        )
    }
    return (
        <header className="header">
                <Image src='/tchoup-gray.png' size='tiny' />
                <h2>Party Tracker</h2>
            <Navbar />
        </header>
    );
}

export default Header