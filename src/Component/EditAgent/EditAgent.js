import React, { useState } from "react";
import styles from '../EditAgent/EditAgent.module.css'

const options = [
    {
        id: "details",
        title: "Business Details",
        description: "Edit name, size, and type.",
    },
    {
        id: "services",
        title: "Business Services",
        description: "Edit Services List, Email Address.",
    },
    {
        id: "location",
        title: "Business Location",
        description: "Edit Country, State and City.",
    },
    {
        id: "about",
        title: "About Your Business",
        description: "Edit URL, Google Listing.",
    },
    {
        id: "avatar",
        title: "Agent (Avatar)",
        description: "Edit Language, Gender, etc.",
    },
];

const EditOptions = () => {
    const [selected, setSelected] = useState("details");

    return (
        <div className={styles.container}>
            <div className={styles.TitleBar}>
             <h3>Edit Agent:</h3><p>Sofia</p>
            </div>
            {options.map((option) => (
                <label
                    key={option.id}
                    className={`${styles.card} ${selected === option.id ? styles.active : ""
                        }`}
                >
                    <div className={styles.leftSection}>
                        <input
                            type="radio"
                            name="editOption"
                            value={option.id}
                            checked={selected === option.id}
                            onChange={() => setSelected(option.id)}
                        />
                        <div className={styles.textContainer}>
                            <span className={styles.title}>{option.title}</span>
                            <span className={styles.description}>{option.description}</span>
                        </div>
                    </div>
                    <span className={styles.arrow}>›</span>
                </label>
            ))}
            <div >
                <div type="submit">
                    <div className={styles.btnTheme}>
                        <img src="svg/svg-theme.svg" alt="" />
                        <p>Continue</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditOptions;
