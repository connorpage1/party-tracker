import React, { useContext, useState} from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Segment, Header, Message, Form as SemanticForm, Dropdown, Checkbox, Popup, Icon } from 'semantic-ui-react';
import * as yup from 'yup';
import { GlobalContext } from '../../context/GlobalProvider';
import toast from 'react-hot-toast';

// Package type options based on your model's types
const packageTypeOptions = [
    { key: 1, text: 'Food', value: 1 },
    { key: 2, text: 'Bar Package', value: 2 },
    { key: 3, text: 'Minimum Spend', value: 3 },
    { key: 4, text: 'Room Fee', value: 4 },
    { key: 5, text: 'Cleaning Fee', value: 5 },
];

const PackageCreationForm = () => {
    const { JWTHeader } = useContext(GlobalContext)
    const [perHeadSelected, setPerHeadSelected] = useState(false)

    // Validation schema using Yup
    const validationSchema = yup.object().shape({
        name: yup.string().required('Package name is required'),
        type_id: yup.number().required('Please select a package type'),
        per_head: yup.boolean().required("Please select a value"),
        price: yup.number().required('Price is required').min(0, 'Price must be greater than or equal to 0'),
        ph_rate_time_hours: yup.number().min(0, 'Must be greater than or equal to 0'),
    });

    const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch('/api/v1/packages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...JWTHeader
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                resetForm();
                setSubmitting(false);
                toast.success('Package created successfully!');
            } else {
                const errorData = await response.json()
                toast.error(errorData.error)
            
            }

        }catch (error) {
            toast.error(error.message || 'An error occurred')        }
    };

    return (
        <Segment>
            <Header as="h2" textAlign="center">Create a New Package</Header>
            <Formik
                initialValues={{
                    name: '',
                    type_id: '',
                    per_head: false,
                    price: '',
                    ph_rate_time_hours: 2,
                }}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
            >
                {({ isSubmitting, setFieldValue, values, setFieldTouched}) => (
                    <Form className="ui form">
                        {/* Package Name */}
                        <SemanticForm.Field>
                            <label htmlFor="name">Package Name</label>
                            <Field
                                name="name"
                                type="text"
                                placeholder="Enter package name"
                                as={SemanticForm.Input}
                                fluid
                            />
                            <ErrorMessage name="name" component={Message} negative />
                        </SemanticForm.Field>

                        {/* Package Type */}
                        <SemanticForm.Field>
                            <label htmlFor="type_id">Package Type</label>
                            <Dropdown
                                placeholder="Select package type"
                                fluid
                                selection
                                options={packageTypeOptions}
                                value={values.type_id || ''}
                                onChange={(e, { value }) => setFieldValue('type_id', value)}
                                onBlur={() => setFieldTouched('type_id', true)}  // Mark the field as touched for validation

                            />
                            <ErrorMessage name="type_id" component={Message} negative />
                        </SemanticForm.Field>

                        {/* Per Head Pricing */}
                        <SemanticForm.Field>
                            <label htmlFor="per_head">Per Head Pricing?</label>
                            <Field
                                name="per_head"
                                type="checkbox"
                                render={({ field }) => (
                                    <Checkbox
                                        toggle
                                        label="Charge per head?"
                                        checked={field.value}
                                        onChange={(e, data) => {
                                            setFieldValue('per_head', data.checked)
                                            setPerHeadSelected((current) => !current)
                                        }}
                                    />
                                )}
                            />
                        </SemanticForm.Field>

                        {/* Package Price */}
                        <SemanticForm.Field>
                            <label htmlFor="price">Price</label>
                            <Popup 
                                    content='If using a per head rate, simply put the 
                                    price per head for the standard package. Final price 
                                    will be computed by the system and discounts can be 
                                    applied to individual parties.'
                                    trigger={<Icon name='question circle' />}
                                    />
                            <Field
                                name="price"
                                type="number"
                                placeholder="Enter package price"
                                as={SemanticForm.Input}
                                fluid
                            />
                            <ErrorMessage name="price" component={Message} negative />
                        </SemanticForm.Field>

                        {/* Rate Time in Hours */}
                        {perHeadSelected ? 
                        <div className='rate-time'>
                            <SemanticForm.Field>
                                <label htmlFor="ph_rate_time_hours">Rate Time (in hours)</label>
                                <Popup 
                                    content='If using a per head rate, rate 
                                    time is the default amount of time for 
                                    that standard package. The default is 2 hours,
                                    and overage time will be computed automatically 
                                    when you apply a standard package to a party.'
                                    trigger={<Icon name='question circle' />}
                                    />
                                <Field
                                    name="ph_rate_time_hours"
                                    type="number"
                                    placeholder="Enter per head rate time in hours (default is 2)"
                                    as={SemanticForm.Input}
                                    fluid
                                    min="0"
                                />
                                <ErrorMessage name="ph_rate_time_hours" component={Message} negative />
                            </SemanticForm.Field>
                        </div> : <></>}

                        {/* Submit Button */}
                        <Button type="submit" primary fluid loading={isSubmitting} disabled={isSubmitting}>
                            Create Package
                        </Button>
                    </Form>
                )}
            </Formik>
        </Segment>
    );
};

export default PackageCreationForm;
