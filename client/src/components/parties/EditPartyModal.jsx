import * as yup from "yup";
import { DateTime } from "luxon";
import { ErrorMessage, Field, Form as FormikForm, Formik } from "formik";
import { useContext, useState } from "react"
import { Button, Message, Modal, Form as SemanticForm, Label, Dropdown } from "semantic-ui-react";
import { GlobalContext } from "../../context/GlobalProvider";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

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
    status: yup.number().required("Please select a status"),
    organization: yup.string(),
    guest_number: yup.number().min(1, "Guest number must be at least 1").required("Estimated guest number is required"),
    location: yup.string().required("Please enter a location"),
    discount: yup.number("Value must be a number")

});



const EditPartyModal = ({ party, updateParty }) => {
    const { JWTHeader } = useContext(GlobalContext)
    const { id } = useParams()

    const [open, setOpen] = useState(false)
    const date_and_start = DateTime.fromSQL(party.date_and_start_time)
    const date = date_and_start.toISODate()
    const time = date_and_start.toLocaleString(DateTime.TIME_24_SIMPLE)
    const initialValues = {
        date: `${date}`,
        start_time: `${time}`,
        duration: Number(party.duration),
        theme: `${party.theme}`,
        status_id: `${party.status_id}`,
        organization: `${party.organization}`,
        guest_number: `${party.guest_number}`,
        location_id: `${party.location_id}`,
        discount: Number(party.discount)
    }
    const handleFormSubmit = (values, setSubmitting) => {
        console.log("Form is submitting", values)
        fetch(`/api/v1/parties/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                ...JWTHeader
            },
            body: JSON.stringify({
                'date_and_start_time': `${values.date} ${values.start_time}`,
                'duration': values.duration,
                'theme': values.theme,
                'status_id': values.status_id,
                'organization': values.organization,
                'guest_number': values.guest_number,
                'location_id': values.location_id,
                'discount': values.discount
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                        .then((data) => 
                            updateParty(data), setOpen(false)
                            )
                } else if (res.status === 401) {
                    // Login message error handling here
                    console.log("Please log in")
                    setSubmitting(false)
                } else {
                    return res.json().then(error => {
                        setSubmitting(false)
                        throw error
                    })
                }
            }).catch(err => {
                toast.error(err.error)
                setSubmitting(false)
            })
    }

    return (
        <div>
            <Button onClick={() => setOpen(true)} primary>
                Edit Party
            </Button>
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                dimmer='blurring'
                size='large'
                className="edit-modal"
            >
                <Modal.Header>Edit Party</Modal.Header>
                <Modal.Content>
                    <Formik
                        initialValues={initialValues}
                        // validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            console.log("Formik is submitting", values)
                            handleFormSubmit(values, setSubmitting)}}
                    >
                        {({ isSubmitting }) => (
                            <FormikForm>
                                <SemanticForm.Field>
                                    <label htmlFor="date">Date</label>
                                    <Field name='date' type='date' as={SemanticForm.Input} fluid />
                                    <ErrorMessage name="date" component={Message} negative />
                                </SemanticForm.Field>

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
                                                value={form.values.status_id}
                                                onChange={(e, { value }) => form.setFieldValue(field.name, value)}
                                                onBlur={() => form.setFieldTouched('status_id', true)}
                                                name={field.name}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="status" component={Message} negative />
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
                                    <label htmlFor="location_id">Location</label>
                                    <Field name="location_id">
                                        {({ field, form }) => (
                                            <Dropdown
                                                placeholder="Select a party location"
                                                fluid
                                                selection
                                                options={locationOptions}
                                                value={form.values.location_id}
                                                onChange={(e, { value }) => form.setFieldValue(field.name, value)}
                                                onBlur={() => form.setFieldTouched('location_id', true)}
                                                name={field.name}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="location_id" component={Message} negative />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                    <label htmlFor="discount">Discount</label>
                                    <Field name='discount' type='number' as={SemanticForm.Input} fluid />
                                    <ErrorMessage name="discount" component={Message} negative />
                                </SemanticForm.Field>
                                <Button type='submit' fluid primary loading={isSubmitting} disabled={isSubmitting}>
                                    Save Changes
                                </Button>
                            </FormikForm>

                        )
                        }
                    </Formik>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    )
}

export default EditPartyModal