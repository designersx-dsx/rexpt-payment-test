import React, { useState } from 'react'
import styles from '../AssignNumber/AssignNumber.module.css'
import HeaderBar from '../HeaderBar/HeaderBar'
import Modal2 from '../Modal2/Modal2'
import AnimatedButton from '../AnimatedButton/AnimatedButton'
const AssignNumber = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("us");
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [isRotating, setIsRotating] = useState(false);
    const [modalNumber, setModalNumber] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const languages = [
        { code: "us", label: "English", flag: "/svg/US-svg.svg" },
        { code: "fr", label: "Français", flag: "/svg/US-svg.svg" },
        { code: "de", label: "Deutsch", flag: "/svg/US-svg.svg" },
    ];
    const handleSelect = (code) => {
        setSelected(code);
        setOpen(false);
    };
    const dummyNumbers = [
        "+1 (807)-300-5008",
        "+1 (807)-300-5011",
        "+1 (902)-267-7267",
        "+1 (902)-267-7292",
        "+1 (902)-500-2673",
        "+1 (705)-230-3530",
        "+1 (805)-530-3854",
        "+1 (905)-237-9563",
        "+1 (507)-238-9730",
    ];


    const [search, setSearch] = useState("");

    const filteredNumbers = dummyNumbers.filter((number) =>
        number.includes(search)
    );

    const selectedLang = languages.find((lang) => lang.code === selected);

    const handleRefresh = () => {
        setIsRotating(true);
        // You can run your refresh logic here...

        setTimeout(() => {
            setIsRotating(false); // Reset after animation
        }, 1000); // Match animation duration
    };
    const handleNumberClick = (num) => {
        setSelectedNumber(num);
        setModalNumber(num);
        setIsModalOpen(true);
    };
    return (
        <div className={styles.AssignNumberMain}>
            <div className={styles.devHeadbar}>
                <HeaderBar title="Assign Number" />
                <div className={styles.dropdownWrapper}>
                    <div className={styles.dropdown} onClick={() => setOpen(!open)}>
                        <img
                            src={selectedLang.flag}
                            alt={selectedLang.label}
                            className={styles.flagIcon}
                        />
                        <span className={styles.arrow}><img src='/svg/down-arrow.svg' /></span>
                    </div>
                    {open && (
                        <ul className={styles.dropdownMenu}>
                            {languages.map((lang) => (
                                <li key={lang.code} onClick={() => handleSelect(lang.code)}>
                                    <img src={lang.flag} alt={lang.label} className={styles.flagIcon} />
                                    <span>{lang.label}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>



            <div>
                <div className={styles.container}>
                    <div className={styles.filters}>
                        <div className={styles.inputGroupSmall}>
                            <label className={styles.inputLabel}>State/Province</label>
                            <input type="text" placeholder="State" className={styles.inputBox} />
                        </div>
                        <div className={styles.inputGroupLarge}>
                            <label className={styles.inputLabel}>City</label>
                            <input type="text" placeholder="City" className={styles.inputBox} />
                        </div>
                    </div>

                    <div className={styles.searchSection}>
                        <input
                            type="text"
                            placeholder="Search number for Agent"
                            className={styles.searchInput}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className={`${styles.refreshBtn} ${isRotating ? styles.rotate : ""}`}
                            onClick={handleRefresh}><img src='/svg/refresh-svg.svg' alt='refresh-svg' /></button>
                    </div>

                    <div className={styles.numberList}>
                        {filteredNumbers.length > 0 ? (
                            filteredNumbers.map((num) => (
                                <label
                                    key={num}
                                    className={styles.phoneItem}
                                    onClick={() => handleNumberClick(num)}
                                >
                                    <input
                                        type="radio"
                                        name="agentNumber"
                                        value={num}
                                        checked={selectedNumber === num}
                                        onChange={() => setSelectedNumber(num)}
                                    />
                                    <span className={styles.customRadio}></span>
                                    <span className={styles.numbers}>{num}</span>
                                </label>
                            ))
                        ) : (
                            <div className={styles.noData}>No data found</div>
                        )}
                    </div>

                    <Modal2 isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <div className={styles.modalContent}>
                            <h2 className={styles.modalTitle}>Confirm Phone Number</h2>

                            <p className={styles.assignText}>
                                You have chosen to <br />
                                assign <span className={styles.phoneNumber}>{selectedNumber}</span> to your:
                            </p>

                            <div className={styles.infoRow}>
                                <img src="/svg/green-check.svg" alt="check" />
                                <span><strong>Agent Name:</strong> Sofia</span>
                            </div>

                            <div className={styles.infoRow}>
                                <img src="/svg/green-check.svg" alt="check" />
                                <span><strong>Business:</strong> Apollo Fitness Solutions</span>
                            </div>

                            <div className={styles.disclaimerBox}>
                                <img src="/svg/warning-svg.svg" alt="warning" />
                                <span>
                                    <strong>Disclaimer:</strong> You will not be able to change this phone number in current billing cycle.
                                </span>
                            </div>

                            <div className={styles.assignBtn}> <AnimatedButton label="Assign Number" position={{ position: "relative" }} /></div>
                        </div>
                    </Modal2>

                </div>
            </div>

        </div>
    )
}

export default AssignNumber
