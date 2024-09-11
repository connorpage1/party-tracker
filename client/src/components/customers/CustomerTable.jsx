import { useContext, useState, useEffect } from "react"
import { GlobalContext } from "../../context/GlobalProvider"
import { useNavigate } from "react-router-dom"
import { Table, TableCell, TableBody, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react"
import toast from "react-hot-toast"

const CustomerTable = () => {
    const { user, JWTHeader } = useContext(GlobalContext)
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate()
    

    useEffect(()=> {
        fetch('/api/v1/customers', {
            method: 'GET',
            headers: {
                ...JWTHeader
            }
        })
        .then(res => {
            const data = res.json()
            if (res.ok) {
                data.then(custObj => setCustomers(custObj.customers))
            } else {
                const error = data.error || data.msg 
                throw(error)
            }})
            .catch(error => toast.error(error))

    }, [])

    if(!user) {
        navigate('/login')
    }
    else {
        return (
            <div>
                <Table>
                    <TableHeader>
                        <TableHeaderCell>First Name</TableHeaderCell>
                        <TableHeaderCell>Last Name</TableHeaderCell>
                        <TableHeaderCell>Email</TableHeaderCell>
                        <TableHeaderCell>Number of Parties</TableHeaderCell>
                    </TableHeader>
                    <TableBody>
                    {customers.map((customer) => {
                            return(
                                <TableRow className='customer-table-row' key={customer.id} onClick={() => navigate(`/customers/${customer.id}`)}>
                                    <TableCell>{customer.first_name}</TableCell>
                                    <TableCell>{customer.last_name}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.parties.length}</TableCell>
                                </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </div>
        )
    }

}

export default CustomerTable