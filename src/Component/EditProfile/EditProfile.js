import React,{useRef} from 'react'
import styles from '../EditProfile/EditProfile.module.css'

const EditProfile = () => {
      const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      // Add image preview/update logic here if needed
    }
  };
    return (
        <div className={styles.card}>
           <div className={styles.profilePic} onClick={handleImageClick}>
        <img src="Images/editProfile.png" alt="Profile" />
        <span className={styles.editIcon}>
          <img src="Svg/edit-icon.svg" alt="edit" />
        </span>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

            <div className={styles.infoSection}>
                <div className={styles.header}>
                    <h3>Personal Info</h3>
                    <span className={styles.editText}><img src='Svg/edit-icon2.svg' className={styles.PurpolIcon} />Edit</span>
                </div>

                <div className={styles.Part}>
                    <img src='Svg/line-Profile.svg' />
                    <div className={styles.infoItem}>
                        <label>Name</label>
                        <p>John Vick</p>
                    </div>
                </div>
                <div className={styles.Part}>
                    <img src='Svg/line-email.svg' />
                    <div className={styles.infoItem}>
                        <label>Email</label>
                        <p>Johnvick@gmail.com</p>
                    </div>
                </div>

                <div className={styles.Part}>
                    <img src='Svg/line-Call.svg' />
                    <div className={styles.infoItem}>
                        <label>Phone Number</label>
                        <p>+91 88XX 55X XXX</p>
                    </div>
                </div>
                <div className={styles.Part}>
                    <img src='Svg/line-address.svg' />
                    <div className={styles.infoItem}>
                        <label>Home address</label>
                        <p>House Number 575-C, Sector 82 near JLPL Office Mohali, (Punjab).</p>
                    </div>
                </div>



            </div>
             <div type="submit">
              <div className={styles.btnTheme}>
                <img src="svg/svg-theme.svg" alt="" />
                <p>Save</p>
              </div>
            </div>
        </div>
    )
}

export default EditProfile
