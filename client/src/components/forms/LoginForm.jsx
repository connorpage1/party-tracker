import * as yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import {
    Button,
    Form as SemanticForm,
    Segment,
    Header,
    Message,
    Container,
    Image,
} from "semantic-ui-react";
import toast from "react-hot-toast";

const schema = yup.object().shape({
    username_or_email: yup.string().required("Please enter your username or email"),
    password_hash: yup.string().required("Please enter a password")
})

const LoginForm = () => {
    const handleFormSubmit = (formData, { setSubmitting, setErrors }) => {
        fetch("/api/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (res.ok) {
                    res
                        .json()
                        .then((userObj) => {
                            //updateUser(userObj);
                            console.log(userObj) ;
                        })
                } else {
                    res.json().then((error) => {
                        if (error.error === "Incorrect email or password") {
                            setErrors({
                                password_hash: "Incorrect email or password",
                            });
                        } else {
                            toast.error(error.error || "An unexpected error occured");
                        }
                    });
                }
            })
            .catch(console.log)
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="login">
            <Container text>
                <Segment raised>
                    {/* Logo Section */}
                    <Image
                        src="/tchoup-black.png"
                        size="small"
                        centered
                        style={{ marginBottom: "20px" }}
                    />

                    <Header as="h2" textAlign="center">
                        Login to Your Account
                    </Header>

                    <Formik
                        initialValues={{ username_or_email: "", password_hash: "" }}
                        validationSchema={schema}
                        onSubmit={handleFormSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <SemanticForm.Field>
                                    <label htmlFor="username_or_email">Username or Email</label>
                                    <Field name="username_or_email" type="text" as={SemanticForm.Input} fluid />
                                    <ErrorMessage name="username_or_email" component={Message} negative />
                                </SemanticForm.Field>

                                <SemanticForm.Field>
                                    <label htmlFor="password_hash">Password</label>
                                    <Field
                                        name="password_hash"
                                        type="password"
                                        as={SemanticForm.Input}
                                        fluid
                                    />
                                    <ErrorMessage
                                        name="password_hash"
                                        component={Message}
                                        negative
                                    />
                                </SemanticForm.Field>

                                <Button
                                    className="login-signup"
                                    type="submit"
                                    fluid
                                    primary
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    Login
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Segment>
            </Container>
        </div>
    )
}

export default LoginForm