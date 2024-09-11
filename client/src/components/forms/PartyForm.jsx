import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useContext, useEffect, useState } from "react";
import { Header, Segment, Form as SemanticForm, Label, Message, Dropdown, Button} from "semantic-ui-react";
import _ from 'lodash';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from '../../context/GlobalProvider';
import responseParser from '../error-handling/response_parser';

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
    status_id: yup.number().required('Please select a status'),
    organization: yup.string(),
    guest_number: yup.number().min(1, "Guest number must be at least 1").required("Estimated guest number is required"),
    location_id: yup.string().required("Please enter a location"),
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
    status_id: '',
    organization: '',
    guest_number:'',
    location_id: '',
    customer_email: '',
    customer_first_name: '',
    customer_last_name: '',
    customer_phone_number: '',
    selectedPackages: [],
    discount: 0,
    packageDescriptions: {}
}

const PartyForm = () => {
    const { JWTHeader } = useContext(GlobalContext)

    const [searchResults, setSearchResults] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [isCustomerSelected, setIsCustomerSelected] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [packages, setPackages] = useState([])
    const [selectedPackages, setSelectedPackages] = useState([])
    const navigate = useNavigate()


    useEffect(()=> {
        fetch('/api/v1/packages', {
            method: 'GET',
            headers: {...JWTHeader}
        })
        .then(res => {
            if (res.ok) {
                res.json()
                .then(setPackages)
            } else {
                throw responseParser(res)
            }
        }).catch(error => toast.error(error.error))
    }, [])

    const packageOptions = packages.map(newPackage => ({
        key: newPackage.id,
        value: newPackage.id,
        text: newPackage.name,
        price: newPackage.price
    }));

    const handleFormSubmit = async (values, { resetForm }) => {
        try {
            if (customerId) {
                const party = await postParty(values, customerId); // Customer already exists, directly create the party
                await postPartyPackages(makePartyPackagesForPost(values, party.id))
                }
            else {
                const customer = await postCustomer(values); // Wait for customer creation
                if (customer && customer.id) {
                    const party = await postParty(values, customer.id); // Use the newly created customer ID for the party
                    await postPartyPackages(makePartyPackagesForPost(values, party.id))
                }
            }
            resetForm();
            navigate('/parties');
        } catch (error) {
            toast.error(error.error)
        }
    };
    
    const postParty = async (data, custId,) => {
        try {
            const response = await fetch('/api/v1/parties', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...JWTHeader
                },
                body: JSON.stringify({
                    date_and_start_time: `${data.date} ${data.start_time}`,
                    duration: data.duration,
                    theme: data.theme,
                    status_id: Number(data.status_id),
                    organization: data.organization,
                    guest_number: data.guest_number,
                    location_id: Number(data.location_id),
                    customer_id: custId,
                    user_id: 1,
                    discount: data.discount
                    
                }),
            });
            const party = response.json()
            if (!response.ok) {
                throw response.json();
            }
            else {
                console.log("Party created successfully");
                return party
            }
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
                    ...JWTHeader
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
    


    const makePartyPackagesForPost = (formValues, partyId) => {
        return formValues.selectedPackages.map((selectPackage) => {
            const pkg = packageOptions.find(option => option.value === selectPackage)
            return ({
                package_id: pkg.value,
                party_id: partyId,
                price_at_purchase: pkg.price,
                description: formValues.packageDescriptions[pkg.value],
                })
            })
        }
            
        

    const postSinglePartyPackage = async(partyPackage) => {
        try {
            const response = await fetch('/api/v1/party-packages', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    ...JWTHeader
                },
                body: JSON.stringify(partyPackage)
            })
            const data = await response.json();
            if (response.ok) {
                console.log("Package posted successfully", data)
            } else {
                throw (data.error || data.msg || "Error posting package")
            }

        } catch(error) {
            console.error(error)
            throw error
        }
    }

    const postPartyPackages = async (packagesWithDescriptions) => {
        for (const partyPackage of packagesWithDescriptions) {
            await postSinglePartyPackage(partyPackage)
        }
    }

    const debouncedSearch = _.debounce((email) => {
        if (email.length > 0) {
            searchCustomers(email, setSearchResults, setDropdownOpen);
        }
        else {
            setSearchResults([]);
            setDropdownOpen(false)
        }
    }, 400);

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

    const handlePackageChange = (e, { value }) => {
        setSelectedPackages(value);  // Update the selected packages
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
                {({ isSubmitting, setFieldValue }) => (
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
                        <label htmlFor="status_id">Status</label>
                        <Field name="status_id">
                            {({ field, form }) => (
                                <Dropdown
                                    placeholder="Select Status"
                                    fluid
                                    selection
                                    options={statusOptions}
                                    value={form.values.status_id || ''}
                                    onChange={(e, { value }) => form.setFieldValue(field.name, value)}
                                    onBlur={() => form.setFieldTouched('status_id', true)}
                                    name={field.name}
                                />
                            )}
                        </Field>
                        <ErrorMessage name="status" component={Label} color="red" pointing />
                    </SemanticForm.Field>

                    {/* Organization Field */}
                    <SemanticForm.Field>
                        <label  htmlFor="organization">Organization</label>
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
                        <label htmlFor="location_id">Location</label>
                        <Field name="location_id">
                            {({ field, form }) => (
                                <Dropdown
                                    placeholder="Select a party location"
                                    fluid
                                    selection
                                    options={locationOptions}
                                    value={form.values.location_id || ''}
                                    onChange={(e, { value }) => form.setFieldValue(field.name, value)} 
                                    onBlur={() => form.setFieldTouched('location_id', true)}
                                    name={field.name}
                                />
                            )}
                        </Field>
                        <ErrorMessage name="location_id" component={Message} negative />
                    </SemanticForm.Field>

                    <SemanticForm.Field>
                    <label htmlFor='selectedPackages'>Select Packages</label>
                        <Dropdown
                            className="ui fluid search dropdown"
                            placeholder="Select Packages"
                            fluid
                            search
                            multiple
                            selection
                            options={packageOptions}
                            onChange={(e, { value }) => {
                                console.log(value)
                                handlePackageChange(e, { value })
                                setFieldValue('selectedPackages', value)}}
                        />
                    </SemanticForm.Field>
                    {selectedPackages.map((pkg) => (
                        <div key={pkg} className='field'>
                            <label htmlFor='description'>
                                Additional notes for package: {packageOptions.find(option => option.value === pkg)?.text}
                            </label>
                            <Field 
                                name={`packageDescriptions.${pkg}`}
                                placeholder="Enter additional notes"
                                as='textarea'
                                />
                        </div>
                    ))}
                    <SemanticForm.Field>
                        <label htmlFor='discount'>Discount</label>
                        <Field name='discount' type='number' as={SemanticForm.Input} fluid />
                    </SemanticForm.Field>


                    {/* Submit Button */}
                    <Button type="submit" fluid primary loading={isSubmitting} disabled={isSubmitting}>
                        Submit Party
                    </Button>
                </Form>
                
                )}
            </Formik>
        </div>
    );
};

export default PartyForm;