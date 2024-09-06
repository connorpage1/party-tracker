import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Segment } from "semantic-ui-react";
import { DateTime } from "luxon";

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const PartyDetail = () => {
    const [party, setParty] = useState({})
    const { id } = useParams()

    useEffect(() => {
        fetch(`/api/v1/parties/${id}`, {
            method: 'GET',
            headers: {
                "X-CSRF-TOKEN": getCookie("csrf_access_token")
            }
        })
        .then(res => {
            if (res.ok) {
                res.json()
                .then(setParty)
            }
            else {
                error = res.json()
                throw new Error(error)
            }
        }).catch(console.log)
    }, [])

    if (Object.keys(party).length !== 0){
        const { party_packages, organization, theme, date_and_start_time, end_time, guest_number, status, location, customer, contract } = party
        const date = DateTime.fromSQL(date_and_start_time)
        const end = DateTime.fromSQL(end_time)
        let total = 0
        return(
            <div className="party-details">
                {
                organization ? 
                    <div className="organization-section">
                        <h3 className="party-detail-header">Organization:</h3>
                        <p className="party-detail-body">{organization}</p> 
                    </div>: 
                    <></> 
                    }
                    
                    {
                    theme ? 
                        <div className="theme-section">
                            <h3 className="party-detail-header">Theme:</h3>
                            <p className="party-detail-body">{theme}</p> 
                        </div>:
                        <></> 
                    }
                <Segment>
                    <h3 className="party-detail-header">Day:</h3>
                    <p className="party-detail-body">{date.toFormat('cccc')}</p>
                    <h3 className="party-detail-header">Date:</h3>
                    <p className="party-detail-body">{date.toLocaleString(DateTime.DATE_SHORT)}</p>
                    <h3 className="party-detail-header">Start Time:</h3>
                    <p className="party-detail-body">{date.toLocaleString(DateTime.TIME_SIMPLE)}</p>
                    <h3 className="party-detail-header">End Time:</h3>
                    <p className="party-detail-body">{end.toLocaleString(DateTime.TIME_SIMPLE)}</p>
                </Segment>
                {party_packages.length !== 0 ? party_packages.map((party_package) => {

                    total += party_package.total_price
                    const over = party_package.over_package_time
                    const pricePerHead = party_package.price_per_head
                    return (
                        <Segment className='package-segment' key={party_package.id}>
                            <h3 className="party-detail-header">Package:</h3>
                            <p>{party_package.package.name}</p>
                            <h3 className="party-detail-header">Per Head Price:</h3>
                            <p>{party_package.package.per_head ? `$${pricePerHead}/head`: 'N/A'}</p>
                            
                            <h3 className="party-detail-header">Package Price:</h3>
                            <p>${party_package.total_price}</p>
                            
                            <h3 className="party-detail-header">Description:</h3>
                            <p>{party_package.description}</p>
                        </Segment>)}) : <p>No packages to display'</p>}

                    
                <h3 className="party-detail-header">Guest Number:</h3>
                <p className="party-detail-body">{guest_number}</p>
                <h3 className="party-detail-header">Status:</h3>
                <p className="party-detail-body">{status}</p>
                <h3 className="party-detail-header">Location:</h3>
                <p className="party-detail-body">{location}</p>
                <Segment className="customer-info">
                    <h3 className="party-detail-header">Customer Name:</h3>
                <p className="party-detail-body">{guest_number}</p>
                    <h3 className="party-detail-header">Contact Email:</h3>
                <p className="party-detail-body">{guest_number}</p>
                    <h3 className="party-detail-header">Contact Phone Number:</h3>
                <p className="party-detail-body">{guest_number}</p>
                </Segment>
                <h3 className="party-detail-header">Total Price:</h3>
                <p className="party-detail-body">${total}</p>
            </div>
        )
    }
    else {
        return(
            <h1>Loading...</h1>
        )
    }
}

export default PartyDetail

