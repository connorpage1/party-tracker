import { useContext } from "react"
import { GlobalContext } from "../context/GlobalProvider"

const Dashboard = () => {
    const { user } = useContext(GlobalContext)
    return (
        <div className="dashboard">
            <h3>Dashboard</h3>
            <h4>Your role: {user.role}</h4>

        </div>
    )
}

export default Dashboard