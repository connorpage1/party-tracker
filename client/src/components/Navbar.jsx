import { Menu } from "semantic-ui-react"
import { NavLink } from "react-router-dom"
// import "semantic-ui-css"

const Navbar =  () => {
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
            </Menu>
        </div>
    )
}

export default Navbar