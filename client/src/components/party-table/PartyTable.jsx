import { useEffect, useState } from "react"

const PartyTable = () => {
    const [parties, setParties] = useState([])
    // const [futureDisplay, setFutureDisplay] = useState(true)
    // const [dateDisplay, setDateDisplay] = useState({
    //     year: null,
    //     month: null, 
    //     day: null
    // })

    let payload = ''
    if (futureDisplay) {
        payload = '?future=True'
    }
    else if (dateDisplay.year && dateDisplay.month && dateDisplay.day){
        payload = `?year=${dateDisplay.year}&month=${dateDisplay.month}&day=${dateDisplay.day}`
    }

    const url = `/api/v1/parties${payload}`
    
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

    }, [dateDisplay, futureDisplay])
    return (
        <div className='table'> 
            <h2>Parties</h2>
            <table className="content-table">
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Guest Count</th>
                    <th>Location</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <ol>
                    {parties.map(party => <li>{party.date_and_start_time}</li>)}
                </ol>
            </tbody>
        </table>
        </div>

    )
}

export default PartyTable