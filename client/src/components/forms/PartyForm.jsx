import * as yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import { Header, Segment, Form as SemanticForm } from "semantic-ui-react";
import _ from 'lodash';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
    date: yup.date("Please enter the date in the proper format").required("Please enter a date"),
    start_time: yup.string().required("Please enter a time"),
    duration: yup.string().required("Please enter a duration"),
    theme: yup.string(),
    status: yup.string(),
    organization: yup.string(),
    guest_number: yup.number().min(1, "Guest number must be at least 1").required("Estimated guest number is required"),
    location: yup.string().required("Please enter a location"),
    customer_email: yup.string().email("Invalid email format").required("Please enter an email"),
    customer_first_name: yup.string(),
    customer_last_name: yup.string(),
    customer_phone_number: yup.string()
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
const PartyForm = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [isCustomerSelected, setIsCustomerSelected] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const navigate = useNavigate()

    const handleFormSubmit = async (formikData) => {
        try {
            if (customerId) {
                await postParty(formikData, customerId); // Customer already exists, directly create the party
            } else {
                const customer = await postCustomer(formikData); // Wait for customer creation
                if (customer && customer.id) {
                    await postParty(formikData, customer.id); // Use the newly created customer ID for the party
                }
            }
            navigate('/parties')
        } catch (error) {
            console.error("Error handling form submission:", error);
        }
    };
    
    const postParty = async (data, custId,) => {
        try {
            const response = await fetch('/api/v1/parties', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": getCookie("csrf_access_token")
                },
                body: JSON.stringify({
                    date_and_start_time: `${data.date} ${data.start_time}`,
                    duration: data.duration,
                    theme: data.theme,
                    status: data.status,
                    organization: data.organization,
                    guest_number: data.guest_number,
                    location: data.location,
                    customer_id: custId,
                    user_id: 1
                    
                }),
            });
            
            if (!response.ok) {
                throw new Error("Failed to submit form");
            }
            
            console.log("Form submitted successfully");
        } catch (error) {
            console.error("Error submitting form:", error);
            throw error;
        }
    };
    
    // Post customer and ensure it returns customer data
    const postCustomer = async (data) => {
        try {
            const response = await fetch('/api/v1/customers', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": getCookie("csrf_access_token")
                },
                body: JSON.stringify({
                    first_name: data.customer_first_name,
                    last_name: data.customer_last_name,
                    email: data.customer_email,
                    phone: data.customer_phone_number
                })
            });
            const customer = await response.json();

            if (!response.ok) {
                throw new Error("Failed to create customer");
            }

            return customer; // Return the customer object to use it in postParty
        } catch (error) {
            console.error("Error creating customer:", error);
            throw error; // Rethrow to be handled in handleFormSubmit
        }
    };
    
    const formik = useFormik({
        initialValues: {
            customer_first_name: '',
            customer_last_name: '',
            customer_phone_number: '',
            customer_email: ''
        },
        validationSchema: schema,
        onSubmit: handleFormSubmit
    });
    
    const searchCustomers = async (email) => {
        try {
            const response = await fetch(`/api/v1/customers?email=${email}`);
            const data = await response.json();
            if (data.customers) {
                setSearchResults(data.customers);
                setDropdownOpen(true)
                
            } else {
                setSearchResults([]);
                setDropdownOpen(false)
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const debouncedSearch = _.debounce((email) => {
        if (email.length > 0) {
            searchCustomers(email);
        }
        else {
            setSearchResults([]);
            setDropdownOpen(false)
        }
    }, 500);

    return (
        <div className="party-form">
            <SemanticForm onSubmit={formik.handleSubmit}>
                <Segment>
                    <Header as="h3">Customer Information</Header>

                    <SemanticForm.Field>
                        <label htmlFor="customer_email">Email</label>
                        <input
                            name="customer_email"
                            type="email"
                            placeholder="Search for customer by email or enter new email"
                            value={formik.values.customer_email}
                            autoComplete="off"
                            onChange={(e) => {
                                const email = e.target.value;
                                formik.setFieldValue('customer_email', email);
                                debouncedSearch(email);
                                setIsCustomerSelected(false);
                            }}
                        />
                    {/* Custom autocomplete suggestion list */}
                    {dropdownOpen && searchResults.length > 0 && (
                            <div className="autocomplete-dropdown">
                                {searchResults.map((customer) => (
                                    <div
                                        key={customer.id}
                                        className="autocomplete-item"
                                        onClick={() => {
                                            formik.setFieldValue('customer_email', customer.email);
                                            formik.setFieldValue('customer_first_name', customer.first_name);
                                            formik.setFieldValue('customer_last_name', customer.last_name);
                                            formik.setFieldValue('customer_phone_number', customer.phone);
                                            setIsCustomerSelected(true);
                                            setDropdownOpen(false);  // Close dropdown after selection
                                            setCustomerId(customer.id)
                                        }}
                                    >
                                        {`${customer.email} - ${customer.first_name} ${customer.last_name}`}
                                    </div>
                                ))}
                            </div>
                        )}
                    </SemanticForm.Field>

                    {/* Customer First Name Field */}
                    <SemanticForm.Field>
                        <label htmlFor="customer_first_name">First Name</label>
                        <input
                            name="customer_first_name"
                            type="text"
                            placeholder="Enter first name"
                            value={formik.values.customer_first_name}
                            autoComplete="off"
                            onChange={formik.handleChange}
                            disabled={isCustomerSelected}  // Disable if customer is selected
                        />
                    </SemanticForm.Field>
                    {/* Customer Last Name Field */}
                    <SemanticForm.Field>
                        <label htmlFor="customer_last_name">Last Name</label>
                        <input
                            name="customer_last_name"
                            type="text"
                            placeholder="Enter last name"
                            value={formik.values.customer_last_name}
                            autoComplete="off"
                            onChange={formik.handleChange}
                            disabled={isCustomerSelected}  // Disable if customer is selected
                        />
                    </SemanticForm.Field>

                    {/* Customer Phone Number Field */}
                    <SemanticForm.Field>
                        <label htmlFor="customer_phone_number">Phone Number</label>
                        <input
                            name="customer_phone_number"
                            type="text"
                            placeholder="Enter phone number"
                            value={formik.values.customer_phone_number}
                            autoComplete="off"
                            onChange={formik.handleChange}
                            disabled={isCustomerSelected}  // Disable if customer is selected
                        />
                    </SemanticForm.Field>
                </Segment>
                
                {/* Date Field */}
                <SemanticForm.Field>
                    <label htmlFor="date">Date</label>
                    <input
                        name="date"
                        type="date"
                        placeholder="Enter party date"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                    />
                </SemanticForm.Field>

                {/* Start Time Field */}
                <SemanticForm.Field>
                    <label htmlFor="start_time">Start Time</label>
                    <input
                        name="start_time"
                        type="time"
                        placeholder="Enter start time"
                        value={formik.values.start_time}
                        onChange={formik.handleChange}
                        step='900'
                    />
            
                </SemanticForm.Field>

                {/* End Time Field */}
                <SemanticForm.Field>
                    <label htmlFor="duration">Duration (hours)</label>
                    <input
                        name="duration"
                        type="number"
                        placeholder="Enter duration"
                        value={formik.values.duration}
                        onChange={formik.handleChange}
                        step='0.25'
                    />
                </SemanticForm.Field>

                {/* Theme Field */}
                <SemanticForm.Field>
                    <label htmlFor="theme">Theme</label>
                    <input
                        name="theme"
                        type="text"
                        placeholder="Enter party theme (optional)"
                        value={formik.values.theme}
                        onChange={formik.handleChange}
                    />
                    
                </SemanticForm.Field>

                {/* Status Field */}
                <SemanticForm.Field>
                    <label htmlFor="status">Status</label>
                    <input
                        name="status"
                        type="text"
                        placeholder="Enter party status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                    />
                    
                </SemanticForm.Field>

                {/* Organization Field */}
                <SemanticForm.Field>
                    <label htmlFor="organization">Organization</label>
                    <input
                        name="organization"
                        type="text"
                        placeholder="Enter organization (optional)"
                        value={formik.values.organization}
                        onChange={formik.handleChange}
                    />
                </SemanticForm.Field>

                {/* Guest Number Field */}
                <SemanticForm.Field>
                    <label htmlFor="guest_number">Guest Number</label>
                    <input
                        name="guest_number"
                        type="number"
                        placeholder="Enter number of guests"
                        value={formik.values.guest_number}
                        onChange={formik.handleChange}
                    />
                </SemanticForm.Field>

                {/* Location Field */}
                <SemanticForm.Field>
                    <label htmlFor="location">Location</label>
                    <input
                        name="location"
                        type="text"
                        placeholder="Enter party location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                    />
                </SemanticForm.Field>

                {/* Submit Button */}
                <button type="submit">Submit</button>
            </SemanticForm>
        </div>
    );
};

export default PartyForm;