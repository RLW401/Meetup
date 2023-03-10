import React, {useState, Fragment, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Modal } from "../../context/Modal";

import { deleteEvent } from "../../store/events";
import "./EventDelete.css"

const EventDeleteModal = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const eventId = Number(useParams().eventId);
    const [showModal, setShowModal] = useState(false);
    const [groupId, setGroupId] = useState(null);
    const event = useSelector((state) => state.eventDetails);

    useEffect(() => {
        setGroupId(event.groupId);
    }, [event]);

    const deleteClick = async () => {
        const data = await dispatch(deleteEvent(eventId));
        setShowModal(false);
        history.push(`/groups/${groupId}`);
    };

    const deleteButton = (
        <button
            className="delete"
            onClick={() => {
                setShowModal(true);
            }}>Delete</button>);

    const deleteOptions = (
        <div className="delete-options">
            <h2>Confirm Delete</h2>
            <h4>Are you sure you want to remove this event?</h4>
            <div className="delete-buttons">
                <button
                    className="confirm delete"
                    onClick={deleteClick}
                >
                    Yes (Delete Event)
                </button>
                <button
                    className="abort"
                    onClick={() => setShowModal(false)}
                >
                    No (Keep Event)
                </button>
            </div>

        </div>
    );

    const modalDisplay = (
        <Fragment>
            {deleteButton}
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    {deleteOptions}
                </Modal>
            )
            }
        </Fragment>
    );

    return modalDisplay;
}

export default EventDeleteModal;
