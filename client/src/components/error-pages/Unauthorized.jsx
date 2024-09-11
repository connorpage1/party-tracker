import { Icon, Image} from "semantic-ui-react";


const Unauthorized = () => {
    return (
        <div className="no-permission">
            <Icon name="lock" />
            <h1>403: Insufficient Permissions</h1>
            
            <p>It looks like you don't have permission to 
                view this page. Please log in to an account with 
                sufficient permissions or contact your system 
                administrator.</p>

        </div>
    )
}


export default Unauthorized