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
import toast from "react-hot-toast";
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
                .then(navigate('/users'))
            } else {
                error = res.json()
                throw error
            }
        }).catch(toast.error(error.error || error.msg || "An unexpected error has occurred"))
        .finally(() => {
            setSubmitting(false)
        })
    }

    const checkUserExists = async (field, value) => {
        try {
            const response = await fetch(`/api/v1/users?${field}=${value}`, {
                headers: { ...JWTHeader }
            });
    
            if (!response.ok) {
                const errorData = await response.json();  // Safely parse JSON error
                return errorData.error || 'Unknown error';
            }
    
            return null;  // No error
        } catch (error) {
            console.error("Network or parsing error:", error);
            return 'Network error or invalid response';
        }
    };

    if (user) {
        if (user.role_id === 1) {
            return (
                <div>
                    <Formik 
                        initialValues={initialValues}
                        onSubmit={(values, { setSubmitting }) => {
                                handleFormSubmit(values, { setSubmitting })
                            }}
                        validationSchema={validationSchema}
                    >
                        {({ isSubmitting, setFieldValue, values, setSubmitting, setFieldError, errors, touched, setFieldTouched, onBlur}) => (
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
                                        onBlur={async (e) => {
                                            console.log("onBlur triggered for username")
                                            const error = await checkUserExists('username', e.target.value);
                                            if (error) {
                                                console.log("Username error", error)
                                                setFieldError('username', error)
                                            }
                                            else {
                                                setFieldError('username', '')
                                            }
                                        }}
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
                                        onBlur={async (e) => {
                                            const error = await checkUserExists('email', e.target.value);
                                            if (error) {
                                                console.log("Email error", error)
                                                setFieldError('email', error)
                                            }
                                            else {
                                                setFieldError('email', '')
                                            }
                                        }}
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
                                disabled={isSubmitting || !!errors.email || !!errors.username}
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