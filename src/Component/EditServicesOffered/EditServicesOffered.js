import React, { useState } from 'react'
import EditHeader from '../EditHeader/EditHeader';
import AnimatedButton from '../AnimatedButton/AnimatedButton';
import styles from '../EditServicesOffered/EditServicesOffered.module.css'


const EditServicesOffered = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [newService, setNewService] = useState('');
    const businessServices = [
        {
            type: "Restaurant",
            subtype: "Your Journey Begins Here",
            icon: "svg/Restaurant-icon.svg",
            services: [
                "Dine-in Service",
                "Takeaway Orders",
                "Home Delivery",
                "Event Catering",
                "Online Ordering",
                "Other"
            ],
        },
        {
            type: "Real Estate Broker",
            subtype: "Your Journey Begins Here",
            icon: "svg/Estate-icon.svg",
            services: [
                "Property Sales",
                "Property Rentals",
                "Property Viewings",
                "Price Valuation",
                "Legal Help",
                "Other"
            ],
        },
        {
            type: "Saloon",
            subtype: "Your Journey Begins Here",
            icon: "svg/Saloon-icon.svg",
            services: [
                "Haircuts",
                "Hair Spa Treatments",
                "Hair Straightening",
                "Nail Extensions",
                "Facials",
                "Other"
            ],
        },
        {
            type: "Doctor's Clinic",
            subtype: "Your Journey Begins Here",
            icon: "svg/Doctor-clinic-icon.svg",
            services: [
                "General Checkups",
                "Specialist Consultations",
                "Vaccinations",
                "Blood Tests",
                "Health Screenings",
                "Other"
            ],
        },
        {
            type: "Dry Cleaner",
            subtype: "Your Journey Begins Here",
            icon: "svg/Dry -Cleaner-icon.svg",
            services: [
                "Garment Cleaning",
                "Stain Removal",
                "Clothing Alterations",
                "Leather & Suede Cleaning",
                "Other"
            ],
        },
        {
            type: "Web Design Agency",
            subtype: "Your Journey Begins Here",
            icon: "svg/Web-Design-Agency-icon.svg",
            services: [
                "Website Creation",
                "Responsive Design",
                "SEO Services",
                "Website Maintenance",
                "E-commerce Setup",
                "Other"
            ],
        },
        {
            type: "Gym & Fitness Center",
            subtype: "Your Journey Begins Here",
            icon: "svg/Gym-icon.svg",
            services: [
                "Group Fitness Classes",
                "Weight Training Equipment",
                "Cardio Workouts",
                "Personal Training Sessions",
                "Other"
            ],
        },
        {
            type: "Marketing Agency",
            subtype: "Your Journey Begins Here",
            icon: "svg/Marketing Agency.svg",
            services: [
                "Social Media Advertising",
                "Content Creation",
                "Email Marketing",
                "PPC Ads",
                "Branding Strategy",
                "Other"
            ],
        },
        {
            type: "Personal Trainer",
            subtype: "Your Journey Begins Here",
            icon: "images/other.png",
            services: [
                "Personalized Workout Plans",
                "One-on-One Training",
                "Nutrition Guidance",
                "Fitness Assessments",
                "Other"
            ],
        },
        {
            type: "Architect",
            subtype: "Your Journey Begins Here",
            icon: "svg/Architect-icon.svg",
            services: [
                "Residential Building Design",
                "Commercial Building Plans",
                "Renovation Planning",
                "Permit Drawings",
                "Site Planning",
                "Project Management",
                "Other"
            ],
        },
        {
            type: "Interior Designer",
            subtype: "Your Journey Begins Here",
            icon: "images/other.png",
            services: [
                "Space Planning",
                "Furniture Selection",
                "Color Consultation",
                "Lighting Design",
                "Home Makeovers",
                "Other"
            ],
        },
        {
            type: "Construction Services",
            subtype: "Your Journey Begins Here",
            icon: "svg/Construction Services.svg",
            services: [
                "New Building Construction",
                "Home Renovations",
                "Project Supervision",
                "Structural Repairs",
                "Other"
            ],
        },
        {
            type: "Cleaning/Janitorial Service",
            subtype: "Your Journey Begins Here",
            icon: "images/other.png",
            services: [
                "Office Cleaning",
                "Deep Carpet Cleaning",
                "Window Washing",
                "Floor Polishing",
                "Regular Maintenance",
                "Other"
            ],
        },
        {
            type: "Transport Company",
            subtype: "Your Journey Begins Here",
            icon: "images/other.png",
            services: [
                "Freight Shipping",
                "Passenger Transport",
                "Courier Services",
                "Vehicle Rentals",
                "Logistics Management",
                "Other"
            ],
        },
        {
            type: "Landscaping Company",
            subtype: "Your Journey Begins Here",
            icon: "images/other.png",
            services: [
                "Lawn Mowing & Maintenance",
                "Garden Design",
                "Tree Pruning & Removal",
                "Irrigation Installation",
                "Other"
            ],
        },
        {
            type: "Insurance Agency",
            subtype: "Your Journey Begins Here",
            icon: "svg/Insurance Agency.svg",
            services: [
                "Life Insurance",
                "Health Insurance",
                "Car Insurance",
                "Home Insurance",
                "Business Insurance",
                "Other"
            ],
        },
        {
            type: "Financial Services",
            subtype: "Your Journey Begins Here",
            icon: "images/other.png",
            services: [
                "Investment Planning",
                "Tax Preparation",
                "Retirement Planning",
                "Wealth Management",
                "Loan Consulting",
                "Other"
            ],
        },
        {
            type: "Accounting Services",
            subtype: "Your Journey Begins Here",
            icon: "svg/Accounting Services.svg",
            services: [
                "Bookkeeping",
                "Tax Filing",
                "Payroll Services",
                "Financial Auditing",
                "Business Financial Reports",
                "Other"
            ],
        },
        {
            type: "Car Repair & Garage",
            subtype: "Your Journey Begins Here",
            icon: "images/other.png",
            services: [
                "Oil & Filter Change",
                "Brake Repairs",
                "Engine Diagnostics",
                "Tire Replacement",
                "Battery Service",
                "Other"
            ],
        },
        {
            type: "Boat Repair & Maintenance",
            subtype: "Your Journey Begins Here",
            icon: "images/other.png",
            services: [
                "Hull Repair",
                "Engine Maintenance",
                "Electrical System Repairs",
                "Boat Cleaning",
                "Winterizing Services",
                "Other"
            ],
        },
        {
            type: "Dentist",
            subtype: "Your Journey Begins Here",
            icon: "images/other.png",
            services: [
                "Teeth",
                "Cleaning",
                "Teeth Whitening",
                "Braces & Aligners",
                "Root Canal",
                "Tooth Extraction",
                "Other"
            ],
        },
        {
            type: "Property Rental & Leasing Service",
            subtype: "Your Journey Begins Here",
            icon: "svg/Property Rental & Leasing Service.svg",
            services: [
                "Tenant Screening",
                "Lease Agreement Preparation",
                "Rent Collection",
                "Property Maintenance Coordination",
                "Other"
            ],
        },
        {
            type: "Old Age Home",
            subtype: "Your Journey Begins Here",
            icon: "svg/Old Age Home.svg",
            services: [
                "Assisted Living",
                "Meal Services",
                "Housekeeping & Laundry",
                "Recreational Activities",
                "Physiotherapy",
                "Emergency Support",
                "Other"
            ],
        },
        {
            type: "Travel Agency",
            subtype: "Your Journey Begins Here",
            icon: "svg/Travel Agency.svg",
            services: [
                "Flight Booking",
                "Hotel Reservations",
                "Holiday Packages",
                "Visa Assistance",
                "Travel Insurance",
                "Customized Itineraries",
                "Cruise Bookings",
                "Local Tours & Sightseeing",
                "Car Rentals",
                "Other"
            ],
        },
        {
            type: "Ticket Booking",
            subtype: "Your Journey Begins Here",
            icon: "svg/Ticket Booking.svg",
            services: [
                "Flight Tickets",
                "Train Tickets",
                "Bus Tickets",
                "Movie Tickets",
                "Event Tickets",
                "Amusement Park Tickets",
                "Concert & Show Tickets",
                "Sports Tickets",
                "Other"
            ],
        }
        ,
        {
            type: "Financial Planners",
            subtype: "Your Journey Begins Here",
            icon: "svg/Financial Planners.svg",
            services: [
                "Retirement Planning",
                "Investment Portfolio Management",
                "Tax Planning",
                "Budgeting & Expense Management",
                "Estate Planning",
                "Insurance Planning",
                "Education Planning",
                "Debt Management",
                "Other"
            ],
        },
        {
            type: "Beauty Parlour",
            subtype: "Your Journey Begins Here",
            icon: "svg/Beauty Parlour.svg",
            services: [
                "Hair Cutting & Styling",
                "Facials & Cleanups",
                "Manicure & Pedicure",
                "Bridal Makeup",
                "Hair Coloring & Highlights",
                "Waxing & Threading",
                "Skin Treatments",
                "Makeup for Events",
                "Spa & Massage Services",
                "Other"
            ],
        },
        {
            type: "Nail Salon",
            subtype: "Your Journey Begins Here",
            icon: "svg/Nail Saloon.svg",
            services: [
                "Manicure",
                "Pedicure",
                "Nail Art",
                "Gel Nails",
                "Acrylic Nails",
                "Nail Extensions",
                "Cuticle Care",
                "Nail Repair & Removal",
                "Hand & Foot Spa",
                "Other"
            ],
        }
        ,
        {
            type: "Barber Studio/Shop",
            subtype: "Your Journey Begins Here",
            icon: "svg/Barber.svg",
            services: [
                "Haircut",
                "Beard Trimming & Styling",
                "Shaving & Grooming",
                "Hair Coloring",
                "Head Massage",
                "Facial for Men",
                "Scalp Treatment",
                "Hair Wash & Styling",
                "Kids Haircut",
                "Other"
            ],
        }
        ,
        {
            type: "Hair Stylist",
            subtype: "Your Journey Begins Here",
            icon: "svg/Hair Stylist.svg",
            services: [
                "Hair Cutting & Trimming",
                "Hair Styling",
                "Blow Dry & Ironing",
                "Hair Coloring & Highlights",
                "Hair Spa",
                "Keratin & Smoothening Treatments",
                "Hair Extensions",
                "Scalp Treatments",
                "Bridal & Occasion Hairstyles",
                "Other"
            ],
        }
        ,
        {
            type: "Bakery",
            subtype: "Your Journey Begins Here",
            icon: "svg/Bakery.svg",
            services: [
                "Custom Cakes",
                "Birthday & Wedding Cakes",
                "Pastries & Cupcakes",
                "Cookies & Biscuits",
                "Bread & Buns",
                "Chocolates & Desserts",
                "Eggless & Sugar-Free Items",
                "Bulk & Party Orders",
                "Online Ordering & Delivery",
                "Other"
            ],
        },
        {
            type: "Cleaning Janitorial Service",
            subtype: "Your Journey Begins Here",
            icon: "svg/Cleaning Janitorial Service.svg",
            services: [
                "Residential Cleaning",
                "Commercial Office Cleaning",
                "Deep Cleaning Services",
                "Move-In/Move-Out Cleaning",
                "Carpet & Upholstery Cleaning",
                "Window Cleaning",
                "Disinfection & Sanitization",
                "Post-Construction Cleaning",
                "Restroom Cleaning & Maintenance",
                "Other"
            ],
        }
        ,
        ,
        {
            type: "Other Local Business",
            subtype: "Your Journey Begins Here",
            icon: "images/other.png",
            services: [
                "Custom Services – Please Specify Your Business Type and Needs",
            ],
        },
    ];
    // Parse sessionStorage safely
    const fetchBusinessType = JSON.parse(sessionStorage.getItem("businessDetails") || "{}");
    const fetchServices = JSON.parse(sessionStorage.getItem("businesServices") || "{}");
    const services = fetchServices.selectedService
    const [selectedServices, setSelectedServices] = useState(services || []);

    const businessType = fetchBusinessType.businessType || "";
    console.log(services)
    // Find business object by type
    const filteredBusinessType = businessServices?.find(
        (item) =>
            item.type.toLowerCase().includes(businessType.toLowerCase())
    );
    const uniqueServices = Array.from(
        new Set([
            ...filteredBusinessType?.services?.filter((s) => s !== "Other") || [],
            ...selectedServices || [],
        ])
    );
    const handleAddService = () => {
    const trimmedService = newService.trim();

    if (!trimmedService) return;

    // Prevent duplicates (case insensitive)
    const isAlreadyPresent = selectedServices.some(
        (service) => service.toLowerCase() === trimmedService.toLowerCase()
    );

    if (!isAlreadyPresent) {
        setSelectedServices([...selectedServices, trimmedService]);
        setNewService('');
    }
};

    const defaultServices = filteredBusinessType?.services?.filter((s) => s !== "Other") || [];

    const extraServices = selectedServices?.filter(service => !defaultServices.includes(service))
    const isAddMoreChecked = extraServices.length > 0;

    const icon = filteredBusinessType.icon
    console.log(filteredBusinessType.icon, "filteredBusinessType")

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
                            {uniqueServices?.length > 0 ? (
                                uniqueServices?.filter((service) => service !== "Other").map((item, index) => (
                                    <label className={styles.option} key={index}>
                                        <div className={styles.forflex}>
                                            <div className={styles.icon}>
                                                <img src={icon} alt={`${item} icon`} className={styles.iconImg} />
                                            </div>
                                            <div className={styles.strongDiv}>
                                                <strong>{item}</strong>
                                                <p className={styles.subType}>{item}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <input
                                                type='checkbox'
                                                name='businessType'
                                                checked={
                                                    selectedServices?.includes(item) &&
                                                    fetchBusinessType.businessType.toLowerCase() === filteredBusinessType?.type.toLowerCase()
                                                }
                                                onChange={() => {
                                                    if (selectedServices.includes(item)) {
                                                        setSelectedServices(selectedServices.filter(s => s !== item));
                                                    } else {
                                                        setSelectedServices([...selectedServices, item]);
                                                    }
                                                }}
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
                            checked={isAddMoreChecked}
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
                                <img src='/svg/addMore-icon.svg' alt='addMore-icon'   onClick={handleAddService}/>
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
