import React, { useEffect } from 'react'
import styles from '../ModalHelp/ModalHelp.module.css'

const ModalHelp = ({ isOpen, onClose, children }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;
    return (
        <div className={styles.overlay} >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose}><img src='/svg/x-stroke.svg' alt='x-stroke'/></button>
                {children}
            </div>
        </div>
    )
}

export default ModalHelp
