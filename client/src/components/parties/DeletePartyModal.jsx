import { useContext, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Modal,
    Icon,
    Header,
    Button,
    ModalActions,
    ModalContent,
} from "semantic-ui-react";
import { GlobalContext } from "../../context/GlobalProvider";


const DeletePartyModal = ({ id }) => {
    const { JWTHeader } = useContext(GlobalContext)


    const navigate = useNavigate();
    const [open, setOpen] = useState(false)

    const handleDelete = () => {
        fetch(`/api/v1/parties/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...JWTHeader
            }
        }).then(res => {
            if (res.ok) {
                navigate('/parties')
            } else {
                error = res.json()
                throw error
            }
        }).catch(error => toast.error(error.error))
    }


    return (
        <Modal
            basic
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size="small"
            trigger={<Button>Delete party</Button>}
        >
            <Header icon>
            <Icon name="trash" />
            Delete Party
            </Header>
            <ModalContent>
            <p>Are you sure you'd like to delete this party?</p>
            </ModalContent>
            <ModalActions>
            <Button
                basic
                color="grey"
                inverted
                onClick={() => {
                    setOpen(false);
                    }}
            >
            No, go back
            </Button>
            <Button
                basic
                color="red"
                onClick={() => {
                    handleDelete();
                    }}
            >
            Delete party
            </Button>
            </ModalActions>
        </Modal>
    );
}

export default DeletePartyModal