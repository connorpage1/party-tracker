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
    Container,
    Image,
    Icon,
} from "semantic-ui-react";
import toast from "react-hot-toast";
import { GlobalContext } from "../../context/GlobalProvider";

const schema = yup.object().shape({
    username_or_email: yup.string().required("Please enter your username or email"),
    password_hash: yup.string().required("Please enter a password")
})

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { updateUser } = useContext(GlobalContext)
    const navigate = useNavigate()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                            updateUser(userObj);
                            navigate('/')
                        })
                } else {
                    res.json().then((error) => {
                        if (error.error === "Incorrect email or password") {
                            setErrors({
                                password_hash: "Incorrect email or password",
                            });
                        } else {
                            toast.error(error.error || "An unexpected error occurred");
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
                                        type={showPassword ? "text" : "password"}
                                        as={SemanticForm.Input}
                                        icon={
                                            <Icon
                                                name={showPassword ? 'eye slash outline' : 'eye'}
                                                link
                                                onClick={togglePasswordVisibility}
                                            />}
                                        fluid
                                    />
                                    <ErrorMessage
                                        name="password_hash"
                                        component={Message}
                                        negative
                                    />
                                </SemanticForm.Field>

                                <Button
                                    className="login"
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