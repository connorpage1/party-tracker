import { useContext } from "react"
import Header from "../Header"
import { GlobalContext } from "../../context/GlobalProvider"
import { Button } from "semantic-ui-react"
import { useNavigate } from "react-router-dom"

const NotFound = () => {
    const { user } = useContext(GlobalContext)
    const navigate = useNavigate()

    return (
        <div className="not-found">
            <Header />
            <h1>404: Not Found</h1>
            <p>We're sorry, but the page you're looking for could not 
                be found. If you typed in the address yourself, check
                to make sure everything is typed correctly. If you
                were served this page after clicking an internal link, please
                contact your system administrator. </p>
            {user ? <></> : 
            <div className="404-no-user">
                <p>Additionally, it looks like you're not logged in. Please log in to use this site.</p>
                <Button onClick={() => navigate('/login')}>Login</Button>
            </div> }
        </div>
    )
}

export default NotFound