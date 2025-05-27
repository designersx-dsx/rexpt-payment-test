import { React, useEffect } from 'react'
import styles from '../Modal/Modal.module.css'

const Modal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const escHandler = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", escHandler);
        return () => document.removeEventListener("keydown", escHandler);
    }, [onClose]);

    if (!isOpen) return null;
    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modal}>
                    {children}
                </div>
                <div className={styles.notch}></div>
            </div>
        </div>
    )
}

export default Modal
