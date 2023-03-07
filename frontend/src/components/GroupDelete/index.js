import React, {useState, Fragment} from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Modal } from "../../context/Modal";
import { deleteGroup } from "../../store/groups";
import "./GroupDelete.css"

const GroupDeleteModal = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const groupId = Number(useParams().groupId);
    const [showModal, setShowModal] = useState(false);

    const deleteClick = async () => {
        const data = await dispatch(deleteGroup(groupId));
        setShowModal(false);
        history.push("/groups");
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
            <h4>Are you sure you want to remove this group</h4>
            <div className="delete-buttons">
                <button
                    className="confirm delete"
                    onClick={deleteClick}
                >
                    Yes (Delete Group)
                </button>
                <button
                    className="abort"
                    onClick={() => setShowModal(false)}
                >
                    No (Keep Group)
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

export default GroupDeleteModal;
