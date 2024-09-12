import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { DateTime } from 'luxon'
import { date } from 'yup'

const Calendar = ({ parties })  => {
    
    const events = parties.map(party => {

        const { date_and_start_time, id, location, end_time, customer, organization, theme} = party
        const start = DateTime.fromSQL(date_and_start_time).toISO()
        const end = DateTime.fromSQL(end_time).toISO()
        return (
            {
                id: id,
                start:  start,
                end: end,
                title: location,
                url: `/parties/${id}`
            }
        )
    })
    
    return (
        <FullCalendar
            plugins={[ dayGridPlugin ]}
            initialView="dayGridMonth"
            timeZone='local'
            events={events}
            />
        )
}

export default Calendar