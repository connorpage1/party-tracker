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
    Icon,
} from "semantic-ui-react";
import toast from "react-hot-toast";
import { useFormik } from "formik";

const PartyForm = () => {
    formik = useFormik()
    
    handleFormSubmit = () => {
        fetch('ap1/v1/parties', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": getCookie("csrf_access_token")
            },
            body: JSON.stringify(formData),
        })
    }
    return(
        <div className="party-form">

        </div>
    )
}

export default PartyForm