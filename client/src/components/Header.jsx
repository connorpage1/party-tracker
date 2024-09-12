import { useContext } from "react";
import { Image, Button, Grid} from "semantic-ui-react";
import { GlobalContext } from "../context/GlobalProvider";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Header = () => {
    const { user, JWTHeader, updateUser} = useContext(GlobalContext)

    if(!user) {
        return(
            <header>
                <Grid>

                    <Image src='/tchoup-black.png' size='tiny' />
                    <h2>Party Tracker</h2>
                </Grid>
            </header>
        )
    }
    return (
        <header className="header">
            <Grid>
                <Image src='/tchoup-black.png' size='tiny' />
                <h2>Party Tracker</h2>
            </Grid>
            <Navbar />
        </header>
    );
}

export default Header