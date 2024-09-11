import { useContext, useState, useEffect } from "react"
import { GlobalContext } from "../../context/GlobalProvider"
import { Button } from "semantic-ui-react"


const UserProfile = () => {
    const { JWTHeader } = useContext(GlobalContext)
    const [profile, setProfile] = useState({})


    useEffect(() => {
        fetch('/api/v1/profile', {
            headers: {
                ...JWTHeader
            }
        }).then(res => {
            if (res.ok) {
                res.json()
                .then(setProfile)
            } else if (res.status == 401){
                console.log('Unauthorized') //Change this to a global error function
            }
            else {
                const error = res.json()
                throw error
            }
        }).catch(console.log)
    }, [])
    if (!profile) {
        return (<h4>Loading...</h4>)
    }
    else { 
        return (
            <div className="user-profile">
                <h3>User: {profile.first_name} {profile.last_name}</h3>
                <p><b>Email: </b>{profile.email}</p>
                <p><b>Username: </b>{profile.username}</p>
                <p><b>Role: </b>{profile.role}</p>
                <p>Username and password are user configurable.
                    To change your role or to deactivate your 
                    account please contact your system administrator.</p>
                    <Button>Change Username or Email</Button><Button>Change Password</Button>
                <p><b>Last updated: </b>{profile.updated_at || profile.created_at}</p>

            </div>


    )
}
}

export default UserProfile