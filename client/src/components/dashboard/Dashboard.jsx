import { useContext, useState, useEffect } from "react"
import { GlobalContext } from "../../context/GlobalProvider"
import { DateTime } from "luxon"
import { useNavigate } from "react-router-dom"
import { Segment, 
        Grid, 
        GridColumn, 
        GridRow, 
        Table, 
        TableBody, 
        TableCell, 
        TableHeaderCell, 
        TableHeader, 
        TableRow } from "semantic-ui-react"
import Calendar from "./Calendar"
import RevenueChart from "./RevenueChart"

const Dashboard = () => {
    const { user, JWTHeader } = useContext(GlobalContext)
    const [parties, setParties] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`/api/v1/parties?future=True`, {
            method: 'GET',
            headers: {
                ...JWTHeader
            }
        })
            .then(res => {
                const data = res.json()
                if (res.ok) {
                    data.then(setParties)
                } else {
                    const error = data.error || data.msg
                    throw (error)
                }
            })
            .catch(error => toast.error(error))

    }, [])


    const fiveParties = parties.slice(0, 5)

    return (
        <div className="dashboard">
            <h3>Dashboard</h3>
            <Grid columns={2} >
                <Segment className="calendar">
                    <Calendar parties={parties} />
                </Segment>
                <Segment className="upcoming-parties" raised>
                    <h3>Next 5 Upcoming Parties</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell>Day</TableHeaderCell>
                                <TableHeaderCell>Date</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                                {fiveParties.map((party) => {
                                    const date = DateTime.fromSQL(party.date_and_start_time)
                                    return(
                                        <TableRow className='party-table-row' key={party.id} onClick={() => navigate(`/parties/${party.id}`)}>
                                            <TableCell>{date.toFormat('cccc')}</TableCell>
                                            <TableCell>{date.toLocaleString(DateTime.DATE_SHORT)}</TableCell>
                                            <TableCell>{party.status}</TableCell>
                                        </TableRow>
                                )})}
                        </TableBody>
                    </Table>
                </Segment>
            </Grid>

            <RevenueChart />

        </div>
    )
}

export default Dashboard