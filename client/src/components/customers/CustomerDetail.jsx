import { useContext, useState, useEffect} from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { GlobalContext } from "../../context/GlobalProvider";
import { Segment } from "semantic-ui-react";
import { DateTime } from "luxon";

const CustomerDetail = () => {
    const { id } = useParams();
    const { JWTHeader, user } = useContext(GlobalContext)
    const [customer, setCustomer] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`/api/v1/customers/${id}`, {
            method: 'GET',
            headers: {
                ...JWTHeader
            }
        })
        .then(res => {
            if (res.ok) {
                res.json()
                .then(setCustomer)
            }
            else {
                throw responseParser(res)
            }
        }).catch(error => toast.error(error.error))
    }, [])

    if (!user) {
        navigate('/')
    } else if (customer) {
            const { first_name, last_name, email, phone, parties } = customer
            return(
                <div>
                    <h3>Customer: {first_name} {last_name}</h3>
                    <h4>Contact: </h4>
                    <p><b>Email: </b>{email}</p>
                    <p><b>Phone: </b>{phone}</p>
                    <div className="party-container">
                        <h4>Parties</h4>
                        {parties ? parties.map(party => {
                            const { date_and_start_time, end_time, guest_number, totals} = party 
                            const date = DateTime.fromSQL(date_and_start_time)
                            const end = DateTime.fromSQL(end_time)
                            return(
                                <Segment key={party.id} onClick={()=> navigate(`/parties/${party.id}`)}>
                                    <p><b>Date: </b>{date.toLocaleString(DateTime.DATE_SHORT)}</p>
                                    <p><b>Start Time: </b>{date.toLocaleString(DateTime.TIME_SIMPLE)}</p>
                                    <p><b>End Time: </b>{end.toLocaleString(DateTime.TIME_SIMPLE)}</p>
                                    <p><b>Guest Number: </b>{guest_number}</p>
                                    <p><b>Total: </b>{totals.total}</p>

                                </Segment>
                            )
                        }):<p>Loading</p>}
                    </div>
                </div>
        )
        } else {
            return(
                <h4>Loading...</h4>
            )
        }
}
    

export default CustomerDetail