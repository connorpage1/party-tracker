import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../context/GlobalProvider"
import { useNavigate, useParams} from "react-router-dom"
import responseParser from "../error-handling/response_parser"


const UserDetail = () => {
    const { user, JWTHeader } = useContext(GlobalContext)
    const [displayUser, setDisplayUser] = useState(null)
    const navigate = useNavigate()
    const { id }= useParams()
    
    useEffect(() => {
        fetch(`/api/v1/users/${id}`, {
            headers: {
                ...JWTHeader
            }
        }).then(res => {
            if (res.ok) {
                res.json()
                .then(setDisplayUser)
            } 
            else if (res.status === 404) {
                navigate('/users')
            }
            else {
                debugger
                throw responseParser(res)
            }
        }).catch(error => toast.error(error.error))
    }, [id, JWTHeader])
    
    if (!displayUser) {
        return (
            <h3>Loading...</h3>
        )
    }
    else if (user.role === 'admin' && displayUser) {
        return (
            <div>
                <h3>User: {displayUser.first_name} {displayUser.last_name}</h3>
                <p><b>Email: </b>{displayUser.email}</p>
                <p><b>Username: </b>{displayUser.username}</p>
                <p><b>Role: </b>{displayUser.role}</p>
                
                {/* <Button>Update User Profile</Button> */}
                <p><b>Last updated: </b>{displayUser.updated_at || displayUser.created_at}</p>

            </div>
        )
    }
    else if (user) {
        navigate('/unauthorized')
    }
    else {
        navigate('/login')
    }
}


export default UserDetail