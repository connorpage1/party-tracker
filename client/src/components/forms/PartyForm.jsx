import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { Header, Segment, Form as SemanticForm, Label, Message, Dropdown } from "semantic-ui-react";
import _ from 'lodash';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const locationOptions = [
    { key: '1', text: 'Little House ONLY (no grass)', value: '1' },
    { key: '2', text: 'Little House and Grass', value: '2' },
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
    status: yup.string(),
    organization: yup.string(),
    guest_number: yup.number().min(1, "Guest number must be at least 1").required("Estimated guest number is required"),
    location: yup.string().required("Please enter a location"),
    customer_email: yup.string().email("Invalid email format").required("Please enter an email"),
    customer_first_name: yup.string(),
    customer_last_name: yup.string(),
    customer_phone_number: yup.string()
});

const initialValues = {
    date: '',
    start_time: '',
    duration: '',
    theme: '',
    status: '',
    organization: '',
    guest_number:'',
    location: '',
    customer_email: '',
    customer_first_name: '',
    customer_last_name: '',
    customer_phone_number: ''


}

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

    const handleFormSubmit = async (values, { resetForm }) => {
        try {
            if (customerId) {
                await postParty(values, customerId); // Customer already exists, directly create the party
            } else {
                const customer = await postCustomer(values); // Wait for customer creation
                if (customer && customer.id) {
                    await postParty(values, customer.id); // Use the newly created customer ID for the party
                }
            }
            resetForm();
            navigate('/parties');
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
                throw response.json();
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
    
    const debouncedSearch = _.debounce((email) => {
        if (email.length > 0) {
            searchCustomers(email, setSearchResults, setDropdownOpen);
        }
        else {
            setSearchResults([]);
            setDropdownOpen(false)
        }
    }, 500);

    const searchCustomers = async (email, setSearchResults, setDropdownOpen) => {
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


    return (
        <div className="party-form">
            <Header as="h2" textAlign="center">
                Create a Party
            </Header>
            <Formik 
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}>
                {({ isSubmitting, values, setFieldValue, handleChange, handleBlur }) => (
                    <Form className="ui form">

                    <Segment className="customer-segment">
                        <Header as="h3">Customer Information</Header>
                        <SemanticForm.Field>
                            <label htmlFor="customer_email">Email</label>
                            <Field name="customer_email">
                                {({ field, form }) => (
                                    <>
                                        <SemanticForm.Input
                                            {...field}
                                            type="email"
                                            placeholder="Search for customer by email or enter new email"
                                            autoComplete="off"
                                            onChange={(e) => {
                                                const email = e.target.value;
                                                form.setFieldValue('customer_email', email);
                                                debouncedSearch(email);  // Trigger the debounced search
                                                setIsCustomerSelected(false);  // Reset customer selection
                                            }}
                                            onBlur={form.handleBlur}
                                        />
                                        {/* Custom autocomplete suggestion list */}
                                        {dropdownOpen && searchResults.length > 0 && (
                                            <div className="autocomplete-dropdown">
                                                {searchResults.map((customer) => (
                                                    <div
                                                        key={customer.id}
                                                        className="autocomplete-item"
                                                        onClick={() => {
                                                            form.setFieldValue('customer_email', customer.email);
                                                            form.setFieldValue('customer_first_name', customer.first_name);
                                                            form.setFieldValue('customer_last_name', customer.last_name);
                                                            form.setFieldValue('customer_phone_number', customer.phone);
                                                            setIsCustomerSelected(true);
                                                            setDropdownOpen(false);  // Close dropdown after selection
                                                            setCustomerId(customer.id);
                                                        }}
                                                    >
                                                        {`${customer.email} - ${customer.first_name} ${customer.last_name}`}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </Field>
                        </SemanticForm.Field>


                        {/* Customer First Name Field */}
                        <SemanticForm.Field>
                            <label htmlFor="customer_first_name">First Name</label>
                            <Field
                                name="customer_first_name"
                                type="text"
                                placeholder="Enter first name"
                                as={SemanticForm.Input}
                                fluid
                                autoComplete="off"
                                disabled={isCustomerSelected} 
                            />
                            <ErrorMessage name="customer_first_name" component={Message} negative />
                        </SemanticForm.Field>
                        {/* Customer Last Name Field */}
                        <SemanticForm.Field>
                            <label htmlFor="customer_last_name">Last Name</label>
                            <Field
                                name="customer_last_name"
                                type="text"
                                placeholder="Enter last name"
                                as={SemanticForm.Input}
                                fluid
                                autoComplete="off"
                                disabled={isCustomerSelected}  // Disable if customer is selected
                            />
                            <ErrorMessage name="customer_last_name" component={Message} negative />
                        </SemanticForm.Field>

                        {/* Customer Phone Number Field */}
                        <SemanticForm.Field>
                            <label htmlFor="customer_phone_number">Phone Number</label>
                            <Field name="customer_phone_number">
                                {({ field, form }) => (
                                    <PhoneInput
                                        {...field}
                                        international={false} // U.S.-only format
                                        defaultCountry="US"
                                        placeholder="Enter phone number"
                                        onChange={(value) => form.setFieldValue(field.name, value)}
                                        value={field.value}
                                        disabled={isCustomerSelected}
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="customer_phone_number" component={Message} negative />
                        </SemanticForm.Field>
                    </Segment>
                    
                    {/* Date Field */}
                    <SemanticForm.Field>
                        <label htmlFor="date">Date</label>
                        <Field name="date" type="date" as={SemanticForm.Input} fluid />
                        <ErrorMessage name="date" component={Message} negative />
                    </SemanticForm.Field>

                    {/* Start Time Field */}
                    <SemanticForm.Field>
                        <label htmlFor="start_time">Start Time</label>
                        <Field 
                            name="start_time" 
                            type="time" 
                            as={SemanticForm.Input} 
                            fluid 
                            step="900"
                        />
                        <ErrorMessage name="start_time" component={Message} negative />
                    </SemanticForm.Field>

                    {/* Duration Field */}
                    <SemanticForm.Field>
                        <label htmlFor="duration">Duration (hours)</label>
                        <Field name="duration" type="number" step='0.25' as={SemanticForm.Input} fluid />
                        <ErrorMessage name="duration" component={Message} negative />
                    </SemanticForm.Field>

                    {/* Theme Field */}
                    <SemanticForm.Field>
                        <label htmlFor="theme">Theme</label>
                        <Field name="theme" type="text" as={SemanticForm.Input} fluid />
                        <ErrorMessage name="theme" component={Message} negative />
                    </SemanticForm.Field>

                    {/* Status Field */}
                    <SemanticForm.Field>
                        <label htmlFor="status">Status</label>
                        <Field name="status">
                            {({ field, form }) => (
                                <Dropdown
                                    placeholder="Select Status"
                                    fluid
                                    selection
                                    options={statusOptions}
                                    value={field.value}
                                    onChange={(e, { value }) => form.setFieldValue(field.name, value)}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                />
                            )}
                        </Field>
                        <ErrorMessage name="status" component={Label} color="red" pointing />
                    </SemanticForm.Field>

                    {/* Organization Field */}
                    <SemanticForm.Field>
                        <label htmlFor="organization">Organization</label>
                        <Field name="organization" type="text" as={SemanticForm.Input} fluid />
                        <ErrorMessage name="organization" component={Message} negative />
                    </SemanticForm.Field>

                    {/* Guest Number Field */}
                    <SemanticForm.Field>
                        <label htmlFor="guest_number">Guest Number</label>
                        <Field name="guest_number" type="number" as={SemanticForm.Input} fluid />
                        <ErrorMessage name="guest_number" component={Message} negative />
                    </SemanticForm.Field>
                    {/* Location Field */}
                    
                    <SemanticForm.Field>
                        <label htmlFor="location">Location</label>
                        <Field name="location">
                            {({ field, form }) => (
                                <Dropdown
                                    placeholder="Select a party location"
                                    fluid
                                    selection
                                    options={locationOptions}
                                    value={field.value}
                                    onChange={(e, { value }) => form.setFieldValue(field.name, value)} 
                                    onBlur={field.onBlur} 
                                    name={field.name}
                                />
                            )}
                        </Field>
                        <ErrorMessage name="location" component={Message} negative />
                    </SemanticForm.Field>

                    {/* Submit Button */}
                    <button type="submit">Submit</button>
                </Form>
                
                )}
            </Formik>
        </div>
    );
};

export default PartyForm;