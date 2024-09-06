import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Segment, Header, Message, Form as SemanticForm, Dropdown, Checkbox } from 'semantic-ui-react';
import * as yup from 'yup';

// Package type options based on your model's types
const packageTypeOptions = [
    { key: 1, text: 'Food', value: 1 },
    { key: 2, text: 'Bar Package', value: 2 },
    { key: 3, text: 'Minimum Spend', value: 3 },
    { key: 4, text: 'Room Fee', value: 4 },
    { key: 5, text: 'Cleaning Fee', value: 5 },
];
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const PackageCreationForm = () => {
    // Validation schema using Yup
    const validationSchema = yup.object().shape({
        name: yup.string().required('Package name is required'),
        type_id: yup.number().required('Please select a package type'),
        per_head: yup.boolean().required("Please select a value"),
        price: yup.number().required('Price is required').min(0, 'Price must be greater than or equal to 0'),
        ph_rate_time_hours: yup.number().min(0, 'Must be greater than or equal to 0'),
    });

    const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
        await fetch('/api/v1/packages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRF-TOKEN": getCookie("csrf_access_token")
            },
            body: JSON.stringify(values),
        });

        resetForm();
        setSubmitting(false);
        alert('Package created successfully!');
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
                {({ isSubmitting, setFieldValue, values }) => (
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
                                        onChange={(e, data) => setFieldValue('per_head', data.checked)}
                                    />
                                )}
                            />
                        </SemanticForm.Field>

                        {/* Package Price */}
                        <SemanticForm.Field>
                            <label htmlFor="price">Price</label>
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
                        <SemanticForm.Field>
                            <label htmlFor="ph_rate_time_hours">Rate Time (in hours)</label>
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
