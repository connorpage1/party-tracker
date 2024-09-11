import { useContext, useState, useEffect} from "react"
import { 
    Table,
    TableBody,
    TableCell,
    TableHeader, 
    TableHeaderCell,
    TableRow
} from "semantic-ui-react"
import { GlobalContext } from "../../context/GlobalProvider"
import { useNavigate } from "react-router-dom"

const UserTable = () => {
    const { JWTHeader, user } = useContext(GlobalContext)
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    
    
    useEffect(()=> {
        fetch('/api/v1/users', {
            method: 'GET',
            headers: {
                ...JWTHeader
            }
        })
        .then(res => {
            const data = res.json()
            if (res.ok) {
                data.then(setUsers)
            } else {
                const error = data.error || data.msg 
                throw(error)
            }})
            .catch(toast.error(error))

    }, [])
    
    if(!user) {
        navigate('/login')
    }
    else if (user.role === 'admin') {
        return (
            <div>
                <Table>
                    <TableHeader>
                        <TableHeaderCell>First Name</TableHeaderCell>
                        <TableHeaderCell>Last Name</TableHeaderCell>
                        <TableHeaderCell>Username</TableHeaderCell>
                        <TableHeaderCell>Role</TableHeaderCell>
                    </TableHeader>
                    <TableBody>
                    {users.map((user) => {
                            return(
                                <TableRow className='user-table-row' key={user.id} onClick={() => navigate(`/users/${user.id}`)}>
                                    <TableCell>{user.first_name}</TableCell>
                                    <TableCell>{user.last_name}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </div>
        )
    }
    else {
        navigate('/unauthorized')
    }
}

export default UserTable