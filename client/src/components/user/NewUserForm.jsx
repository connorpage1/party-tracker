import * as yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useContext, useState } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import {
    Button,
    Form as SemanticForm,
    Segment,
    Header,
    Message,
    Dropdown,
    Container,
    Image,
    Icon,
} from "semantic-ui-react";
import { GlobalContext } from "../../context/GlobalProvider";

const validationSchema = yup.object().shape({
    first_name: yup.string(),
    last_name: yup.string(),
    username: yup.string().required('Please enter a username'),
    email: yup.string().email().required("Please enter an email")
})

const initialValues = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    role_id: 2
}

const userTypeOptions = [
    {key: 1, text: 'admin', value: 1},
    {key: 2, text: 'manager', value: 2},
    {key: 3, text: 'bartender', value: 3},

]

const NewUserForm = () => {
    const { JWTHeader, user } = useContext(GlobalContext)
    const navigate = useNavigate()

    const handleFormSubmit = (values, { isSubmitting, setSubmitting }) => {
        fetch('/api/v1/users', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                ...JWTHeader
            },
            body: JSON.stringify(values)
            
        }).then(res => {
            if(res.ok){
                res.json().then(console.log)
            } else {
                error = res.json()
                throw error
            }
        }).catch(console.log)
        .finally(setSubmitting(false))
    }
    if (user) {
        if (user.role_id === 1) {
            return (
                <div>
                    <Formik 
                        initialValues={initialValues}
                        onSubmit={handleFormSubmit}
                        validationSchema={validationSchema}
                    >
                        {({ isSubmitting, setFieldValue, values, setSubmitting }) => (
                            <Form>
                                <SemanticForm.Field>
                                    <label htmlFor="first_name">First Name</label>
                                    < Field
                                        name='first_name'
                                        type='text'
                                        as={SemanticForm.Input}
                                        fluid
                                        />
                                        <ErrorMessage name="first_name" component={Message} negative />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                    <label htmlFor="last_name">Last Name</label>
                                    < Field
                                        name='last_name'
                                        type='text'
                                        as={SemanticForm.Input}
                                        fluid
                                        />
                                        <ErrorMessage name="last_name" component={Message} negative />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                    <label htmlFor="username">Username</label>
                                    < Field
                                        name='username'
                                        type='text'
                                        as={SemanticForm.Input}
                                        fluid
                                        />
                                        <ErrorMessage name="username" component={Message} negative />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                    <label htmlFor="email">Email</label>
                                    < Field
                                        name='email'
                                        type='text'
                                        as={SemanticForm.Input}
                                        fluid
                                        />
                                        <ErrorMessage name="email" component={Message} negative />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                <label htmlFor="role_id">User Role</label>
                                <Dropdown
                                    placeholder="Select user role"
                                    fluid
                                    selection
                                    options={userTypeOptions}
                                    value={values.role_id || ''}
                                    onChange={(e, { value }) => setFieldValue('role_id', value)}
                                    onBlur={() => setFieldTouched('role_id', true)}  // Mark the field as touched for validation

                                />
                                <ErrorMessage name="role_id" component={Message} negative />
                            </SemanticForm.Field>
                            <Button
                                className="create-user"
                                type="submit"
                                fluid
                                primary
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                Create User
                            </Button>
                            </Form>
                        )}

                    </Formik>
                </div>
            )
        } else {
            navigate('/unauthorized')
        }
    } else {
        navigate('/login')
    }
    }

export default NewUserForm