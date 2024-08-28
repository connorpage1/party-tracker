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
    return(
        <div className="login">
            
        </div>
    )
}

export default LoginForm