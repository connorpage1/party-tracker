import {
    TableRow,
    TableHeaderCell,
    TableHeader,
    TableCell,
    TableBody,
    Icon,
    Table,
  } from 'semantic-ui-react'
import { useEffect, useState } from "react"
import dateFormat from 'dateformat'
import { Navigate, useNavigate } from 'react-router-dom'
import { DateTime } from "luxon";


const PartyTable = () => {
    const navigate = useNavigate()
    const [parties, setParties] = useState([])
    // const [futureDisplay, setFutureDisplay] = useState(true)
    // const [dateDisplay, setDateDisplay] = useState({
    //     year: null,
    //     month: null, 
    //     day: null
    // })

    // let payload = ''
    // if (futureDisplay) {
    //     payload = '?future=True'
    // }
    // else if (dateDisplay.year && dateDisplay.month && dateDisplay.day){
    //     payload = `?year=${dateDisplay.year}&month=${dateDisplay.month}&day=${dateDisplay.day}`
    // }

    const url = `/api/v1/parties`
    
    useEffect(()=> {
        fetch(url)
        .then(res => {
            const data = res.json()
            if (res.ok) {
                data.then(setParties)
            } else {
                const error = data.error || data.msg 
                throw(error)
            }})
            .catch(console.log)

    }, [])
    return (
        <div className='table'> 
            <h2>Parties</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Day</TableHeaderCell>
                        <TableHeaderCell>Date</TableHeaderCell>
                        <TableHeaderCell>Start Time</TableHeaderCell>
                        <TableHeaderCell>End Time</TableHeaderCell>
                        <TableHeaderCell>Location</TableHeaderCell>
                        <TableHeaderCell>Guest Number</TableHeaderCell>
                        <TableHeaderCell>Last Name/Organization</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                        {parties.map((party) => {
                            const date = DateTime.fromSQL(party.date_and_start_time)
                            const end_time = DateTime.fromSQL(party.end_time)
                            return(
                                <TableRow className='party-table-row' key={party.id} onClick={() => navigate(`/parties/${party.id}`)}>
                                    <TableCell>{date.toFormat('cccc')}</TableCell>
                                    <TableCell>{date.toLocaleString(DateTime.DATE_SHORT)}</TableCell>
                                    <TableCell>{date.toLocaleString(DateTime.TIME_SIMPLE)}</TableCell>
                                    <TableCell>{end_time.toLocaleString(DateTime.TIME_SIMPLE)}</TableCell>
                                    <TableCell>{party.location}</TableCell>
                                    <TableCell>{party.guest_number}</TableCell>
                                    <TableCell>{party.organization ? party.organization : party.customer.last_name}</TableCell>
                                    <TableCell>{party.status}</TableCell>
                                </TableRow>
                        )})}
                </TableBody>
            </Table>
        </div>

    )
}

export default PartyTable