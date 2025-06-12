import React from 'react'
import styles from '../EditProfile/EditProfile.module.css'

const EditProfile = () => {
    return (
        <div className={styles.card}>
            <div className={styles.profilePic}>
                <img src="Images/editProfile.png" alt="Profile" />
                <span className={styles.editIcon}><img src='Svg/edit-icon.svg' /></span>
            </div>

            <div className={styles.infoSection}>
                <div className={styles.header}>
                    <h3>Personal Info</h3>
                    <span className={styles.editText}>✎ Edit</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Name</label>
                    <p>John Vick</p>
                </div>

                <div className={styles.infoItem}>
                    <label>Email</label>
                    <p>Johnvick@gmail.com</p>
                </div>

                <div className={styles.infoItem}>
                    <label>Phone Number</label>
                    <p>+91 88XX 55X XXX</p>
                </div>

                <div className={styles.infoItem}>
                    <label>Home address</label>
                    <p>House Number 575-C, Sector 82 near JLPL Office Mohali, (Punjab).</p>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
