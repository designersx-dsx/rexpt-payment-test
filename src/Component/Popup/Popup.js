import React, { useState, useEffect } from 'react'
import styles from './Popup.module.css'
const PopUp = ({ type, message, renderHTML = false, onClose = () => { }, onConfirm = () => { },
    extraButton // { label: string, onClick: function }
}) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);
            document.body.style.overflow = 'hidden';
        }

        // Cleanup: Restore scroll
        return () => {
            document.body.style.overflow = '';
        };
    }, [message]);
    // ESC key to close popup
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(() => onClose(), 200);
    };

    const getIconPath = () => {
        switch (type) {
            case "success":
                return "/svg/sucess-icon.svg";
            case "failed":
                return "/svg/failed-icon.svg";
            case "confirm":
                return "/svg/confirmation-icon.svg";
            default:
                return "";
        }
    };

    return (
        message && (
            <div className={`${styles.overlay} ${show ? styles.fadeIn : styles.fadeOut}`}>
                <div className={`${styles.popup} ${styles[type]} ${show ? styles.scaleIn : styles.scaleOut}`}>
                    <img src={getIconPath()} alt={type} className={`${styles.icon} ${styles.animateIcon}`} onClick={handleClose} />
                    {renderHTML ? (
                        <p
                            className={styles.message}
                            dangerouslySetInnerHTML={{ __html: message }}
                        />
                    ) : (
                        <p className={styles.message}>{message}</p>
                    )}



                    {type === "confirm" ? (
                        <div className={styles.buttons}>
                            <button className={styles.cancel} onClick={handleClose}>Cancel</button>
                            <button
                                className={styles.confirmBtn}
                                onClick={() => {
                                    onConfirm();
                                    handleClose();
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    ) : (
                        <>
                            <button className={styles.close} onClick={handleClose}>Close</button>
                            {extraButton && (
                                <button
                                    className={styles.extra}
                                    onClick={() => {
                                        extraButton.onClick?.();
                                    }}
                                >
                                    {extraButton.label}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        )
    );
};


export default PopUp
