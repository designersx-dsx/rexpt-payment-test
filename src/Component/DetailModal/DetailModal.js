import React, { useEffect } from 'react'
import styles from '../DetailModal/DetailModal.module.css'

const DetailModal = ({ isOpen, onClose, height = 'auto', children }) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => (document.body.style.overflow = 'auto');
    }, [isOpen]);

    if (!isOpen) return null;
    return (
        <div>
            <div className={styles.overlay}>
                <div className={styles.modal} style={{ height }}>
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailModal
