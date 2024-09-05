import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Segment } from "semantic-ui-react";

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
        return(
            <div className="party-details">
                <h3 className="party-detail-header">Organization:</h3>
                <h3 className="party-detail-header">Theme:</h3>
                <Segment>
                    <h3 className="party-detail-header">Day:</h3>
                    <h3 className="party-detail-header">Date:</h3>
                    <h3 className="party-detail-header">Start Time:</h3>
                    <h3 className="party-detail-header">End Time:</h3>
                </Segment>
                {party_packages.length !== 0 ? party_packages.map((party_package) => {
                    return (
                        <Segment className='package-segment' key={party_package.id}>
                            <h3 className="party-detail-header">Packages:</h3>
                            <p>{party_package.package.name}</p>
                            <h3 className="party-detail-header">Per Head?:</h3>
                            <p>{party_package.package.per_head ? 'Yes' : 'No'}</p>
                            <h3 className="party-detail-header">Price:</h3>
                            <p>{party_package.package.per_head ? 
                                `$${party_package.price_at_purchase * guest_number}` :
                                `$${party_package.price_at_purchase}`}</p>
                            <h3 className="party-detail-header">Description:</h3>
                            <p>{party_package.description}</p>
                        </Segment>)}) : <p>No packages to display'</p>}

                    
                <h3 className="party-detail-header">Guest Number:</h3>
                <h3 className="party-detail-header">Status:</h3>
                <h3 className="party-detail-header">Location:</h3>
                <h3 className="party-detail-header">Customer Name:</h3>
                <h3 className="party-detail-header">Contact Email:</h3>
                <h3 className="party-detail-header">Contact Phone Number:</h3>
                <h3 className="party-detail-header">Total Price:</h3>
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

