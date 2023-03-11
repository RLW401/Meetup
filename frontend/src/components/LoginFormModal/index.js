import React, { useState, Fragment } from "react";
import LoginForm from "./LoginForm";
import { Modal } from "../../context/Modal";

const LoginFormModal = () => {
    const [showModal, setShowModal] = useState(false);

    const loginButton = (<button
        onClick={() =>{
        setShowModal(true);
    }}>Log In</button>);

    const modalDisplay = (
        <Fragment>
            {loginButton}
            {showModal && (
                <Modal onClose={() => {
                    setShowModal(false);
                }}>
                    <LoginForm />
                </Modal>
            )}
        </Fragment>
    );

    return modalDisplay;
};

export default LoginFormModal;
