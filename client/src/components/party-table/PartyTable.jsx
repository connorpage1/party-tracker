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

const PartyTable = () => {
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
                        <TableHeaderCell>Status</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                        {parties.map((party) => {
                            const date = party.date_and_start_time
                            const end_time = party.end_time
                            return(
                                <TableRow key={party.id}>
                                    <TableCell>{dateFormat(date, 'dddd')}</TableCell>
                                    <TableCell>{dateFormat(date, 'paddedShortDate')}</TableCell>
                                    <TableCell>{dateFormat(date, 'h:MM tt')}</TableCell>
                                    <TableCell>{dateFormat(end_time, 'h:MM tt')}</TableCell>
                                    <TableCell>{party.location}</TableCell>
                                    <TableCell>{party.guest_number}</TableCell>
                                    <TableCell>{party.status}</TableCell>
                                </TableRow>
                        )})}
                </TableBody>
            </Table>
        </div>

    )
}

export default PartyTable