import React, { useState } from 'react'
import EditHeader from '../EditHeader/EditHeader';
import AnimatedButton from '../AnimatedButton/AnimatedButton';
import styles from '../EditServicesOffered/EditServicesOffered.module.css'


const EditServicesOffered = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const businessTypes = [
        { type: 'Real Estate Broker', subtype: 'Your Journey Begins Here', icon: 'svg/Estate-icon.svg' },
        { type: 'Restaurant', subtype: 'Your Journey Begins Here', icon: 'svg/Landscaping-icon.svg' },
        { type: 'Interior Designer', subtype: 'Your Journey Begins Here', icon: 'svg/Interior-Designer-icon.svg' },
        { type: 'Saloon', subtype: 'Your Journey Begins Here', icon: 'svg/Saloon-icon.svg' },
        { type: 'Landscaping Company', subtype: 'Your Journey Begins Here', icon: 'svg/Landscaping-icon.svg' },
        { type: 'Dentist', subtype: 'Your Journey Begins Here', icon: 'svg/Dentist-Office-icon.svg' },
        { type: "Doctor's Clinic", subtype: 'Your Journey Begins Here', icon: 'svg/Doctor-clinic-icon.svg' },
        { type: 'Gym & Fitness Center', subtype: 'Your Journey Begins Here', icon: 'svg/Gym-icon.svg' },
        { type: 'Personal Trainer', subtype: 'Your Journey Begins Here', icon: 'svg/Personal-Trainer-icon.svg' },
        { type: 'Web Design Agency', subtype: 'Your Journey Begins Here', icon: 'svg/Web-Design-Agency-icon.svg' },
        { type: 'Architect', subtype: 'Your Journey Begins Here', icon: 'svg/Architect-icon.svg' },
        { type: 'Property Rental & Leasing Service', subtype: 'Your Journey Begins Here', icon: 'svg/Property Rental & Leasing Service.svg' },
        { type: 'Construction Services', subtype: 'Your Journey Begins Here', icon: 'svg/Construction Services.svg' },
        { type: 'Insurance Agency', subtype: 'Your Journey Begins Here', icon: 'svg/Insurance Agency.svg' },
        { type: 'Old Age Home', subtype: 'Your Journey Begins Here', icon: 'svg/Old Age Home.svg' },
        { type: 'Travel Agency', subtype: 'Your Journey Begins Here', icon: 'svg/Travel Agency.svg' },
        { type: 'Ticket Booking', subtype: 'Your Journey Begins Here', icon: 'svg/Ticket Booking.svg' },
        { type: 'Accounting Services', subtype: 'Your Journey Begins Here', icon: 'svg/Accounting Services.svg' },
        { type: 'Financial Planners', subtype: 'Your Journey Begins Here', icon: 'svg/Financial Planners.svg' },
        { type: 'Beauty Parlour', subtype: 'Your Journey Begins Here', icon: 'svg/Beauty Parlour.svg' },
        { type: 'Nail Salon', subtype: 'Your Journey Begins Here', icon: 'svg/Nail Saloon.svg' },
        { type: 'Barber Studio/Shop', subtype: 'Your Journey Begins Here', icon: 'svg/Barber.svg' },
        { type: 'Hair Stylist', subtype: 'Your Journey Begins Here', icon: 'svg/Hair Stylist.svg' },
        { type: 'Bakery', subtype: 'Your Journey Begins Here', icon: 'svg/Bakery.svg' },
        { type: 'Dry Cleaner', subtype: 'Your Journey Begins Here', icon: 'svg/Dry Cleaner.svg' },
        { type: 'Cleaning Janitorial Service', subtype: 'Your Journey Begins Here', icon: 'svg/Cleaning Janitorial Service.svg' },
        { type: 'Other', subtype: 'Your Journey Begins Here', icon: 'svg/Web-Design-Agency-icon.svg' },
    ];

    const filteredBusinessTypes = businessTypes.filter((item) =>
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <EditHeader title='Edit Agent ' agentName='Sofia' />
            <div className={styles.Maindiv}>
                <div className={styles.headerWrapper}>
                    <h2 className={styles.heading}>Services Offered</h2>
                    <p className={styles.subheading}>Select the “Services You Offer” based on the Business Category</p>
                    <div className={styles.tooltipIcon}>
                        <img src='/svg/informtion-icon.svg' alt='informtion-icon' />
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>
                            <img src='svg/Search-Icon.svg' alt='Search icon' />
                        </span>
                        <input
                            type='text'
                            placeholder='Quick find Business type'
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className={styles.ListDiv}>
                        <div className={styles.optionList}>
                            {filteredBusinessTypes.length > 0 ? (
                                filteredBusinessTypes.map((item, index) => (
                                    <label className={styles.option} key={index}>
                                        <div className={styles.forflex}>
                                            <div className={styles.icon}>
                                                <img src={item.icon} alt={`${item.type} icon`} className={styles.iconImg} />
                                            </div>
                                            <div className={styles.strongDiv}>
                                                <strong>{item.type}</strong>
                                                <p className={styles.subType}>{item.subtype}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <input
                                                type='checkbox'
                                                name='businessType'
                                                checked={selectedType === item.type}
                                                onChange={() => setSelectedType(item.type)}
                                                className={styles.purpleCheckbox}
                                            />
                                        </div>
                                    </label>
                                ))
                            ) : (
                                <div className={styles.noResult}>No results found</div>
                            )}

                        </div>
                    </div>

                    <div className={styles.addMore}>
                        <input
                            type='checkbox'
                            name='businessType'
                            className={styles.purpleCheckbox}
                        />
                        <p>Add More Services(Not on Above List)</p>
                    </div>
                    <div className={styles.wrapper}>
                        <label className={styles.label}>Service Name</label>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                placeholder="Enter your service name"
                                className={styles.input}
                            />
                            <button className={styles.addButton}>
                                <img src='/svg/addMore-icon.svg' alt='addMore-icon' />
                            </button>
                        </div>
                    </div>
                    <div className={styles.stickyWrapper}>
                        <AnimatedButton label="Save" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditServicesOffered
