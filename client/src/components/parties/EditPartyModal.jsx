import { useState } from "react"
import { Button } from "semantic-ui-react";

const locationOptions = [
    { key: '1', text: 'Little House and Grass', value: '1' },
    { key: '2', text: 'Little House ONLY (no grass)', value: '2' },
    { key: '3', text: 'Full Warehouse', value: '3' },
    { key: '4', text: 'Partial Warehouse', value: '4' },
    { key: '5', text: 'Full Buyout', value: '5' },
    { key: '6', text: 'Terrace', value: '6' },
    { key: '7', text: 'Oak Tree', value: '7' },
    { key: '8', text: 'Oak Tree and Terrace', value: '8' },
    { key: '9', text: 'Grass ONLY', value: '9' },
];

const statusOptions = [
    { key: '1', text: 'Tentative (Hold Date)', value: '1' },
    { key: '2', text: 'Date Confirmed, Pending Party Details', value: '2' },
    { key: '3', text: 'Awaiting Contract/Payment', value: '3' },
    { key: '4', text: 'Cancelled', value: '4' },
    { key: '5', text: 'Confirmed, Paid', value: '5' },
    { key: '6', text: 'Finalized', value: '6' },
    { key: '7', text: 'Needs Follow-Up', value: '7' },
    { key: '8', text: 'Completed', value: '8' }
];

const validationSchema = yup.object().shape({
    date: yup.date("Please enter the date in the proper format").required("Please enter a date"),
    start_time: yup.string().required("Please enter a time"),
    duration: yup.number("Please enter a valid number").required("Please enter a duration"),
    theme: yup.string(),
    status: yup.number().required(),
    organization: yup.string(),
    guest_number: yup.number().min(1, "Guest number must be at least 1").required("Estimated guest number is required"),
    location: yup.string().required("Please enter a location"),
    customer_email: yup.string().email("Invalid email format").required("Please enter an email"),
    customer_first_name: yup.string(),
    customer_last_name: yup.string(),
    customer_phone_number: yup.string()
});



const EditPartyModal = ({ party, partyId }) => {
    const [open, setOpen] = useState(false)
    const initialValues = {
        date: `${party.date}`,
        start_time: `${party.start_time}`,
        duration: `${party.duration}`,
        theme: `${party.theme}`,
        status: `${party.status}`,
        organiztion: `${party.organiztion}`,
        guest_number: `${party.guest_number}`,
        location: `${party.location}`
    }
    return (
        <div>
            <Button onClick={()=> setOpen(true)} primary>
                Edit Party
            </Button>
            
        </div>
    )
}

export default EditPartyModal