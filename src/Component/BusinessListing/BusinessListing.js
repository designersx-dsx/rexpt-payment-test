import React from "react";
import styles from "../BusinessListing/BusinessListing.module.css";

const BusinessListing = () => {
  return (
    <>
      <div>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Your business Listing</h1>
          </div>

          <form className={styles.formContainer}>
            <div className={styles.form}>
              <div className={styles.labReq}>
                <div className={styles.formGroup}>
                  <label>
                    Business Name
                    <span className={styles.requiredStar1}>*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Your Business Name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Phone Number
                    <span className={styles.requiredStar1}>*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="88XX 77X 6XX"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Address
                    <span className={styles.requiredStar1}>*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Business Address"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Business Email</label>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Business Email Address"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>About My Business</label>
                  <textarea
                    rows="5"
                    cols="50"
                    id="about-business"
                    type="text"
                    placeholder="Describe"
                  ></textarea>
                </div>
              </div>
              <div className={styles.fixedBtn}>
                <button type="submit" className={styles.btnTheme}>
                  <img alt="" src="svg/svg-theme.svg" />
                  <p>Continue</p>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BusinessListing;
