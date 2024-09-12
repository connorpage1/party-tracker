import { useContext } from "react";
import { GlobalContext } from "../context/GlobalProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "semantic-ui-react";
import Dashboard from "./dashboard/Dashboard";

const Landing = () => {
    const { user } = useContext(GlobalContext)
    const navigate = useNavigate()

    if (!user) {
        return (
            <div className="landing-no-user">
                <h1>Welcome, please login to continue</h1>
                <p>Welcome to the Tchoup Yard Party tracker, an internal system for tracking parties at the 
                    Tchoup Yard.
                </p>
                <Button onClick={() => navigate('/login')}>Login</Button>
            </div>
        );
    } else {
        return(
            <div className="landing-with-user">
                <h1>Welcome, {user.first_name}</h1>
                <Dashboard />

            </div>
            
        )
    }
}

export default Landing