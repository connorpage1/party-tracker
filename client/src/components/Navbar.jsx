import { Menu, MenuItem, Button} from "semantic-ui-react"
import { NavLink, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { GlobalContext } from "../context/GlobalProvider"

const Navbar =  () => {
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
            } else {
                error = res.json()
                throw error
            }
        }).catch(console.log)
    }
    return(
        <div>
            <Menu fixed='top' inverted>
                <Menu.Item as={NavLink} to='/' header>
                    Home
                </Menu.Item>
                <Menu.Item as={NavLink} to='/parties' header>
                    Parties
                </Menu.Item>
                <Menu.Item as={NavLink} to='/parties/new' header>
                    New Party
                </Menu.Item>
                <Menu.Item as={NavLink} to='/packages/new' header>
                    New Package
                </Menu.Item>
                <Menu.Item as={NavLink} to='/profile' header>
                    Profile
                </Menu.Item>
                {user.role === 'admin' ? 
                    <MenuItem as={NavLink} to='/users' header>
                        Users
                    </MenuItem>: <></>}
                {user.role === 'admin' ? 
                    <MenuItem as={NavLink} to='/users/new' header>
                        New User
                    </MenuItem>: <></>}
                <div className="header-logout">
                    <p>Hello, {user.first_name}</p>
                    <Button size='mini' onClick={() => logout()}>Logout</Button>
                </div>
            </Menu>
        </div>
    )
}

export default Navbar