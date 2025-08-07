// components/PopupModal.js
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({
    show,
    onClose,
    title,
    message,
    type = "info", // 'success' | 'failed' | 'info'
    onConfirm,
    confirmText = "OK",
    cancelText = "Cancel",
    showCancel = false,
    isLoading = false
}) => {
    if (!show) return null;

    return (
        <div className={styles.modalBackdrop} >
            <div
                className={styles.modalContainer}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className={styles[type]}>{title}</h2>
                <p>{message}</p>

                <div className={styles.modalButtons}>
                    {showCancel && (
                        <button
                            className={`${styles.modalButton} ${styles.cancel}`}
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        className={`${styles.modalButton} ${styles.submit}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
