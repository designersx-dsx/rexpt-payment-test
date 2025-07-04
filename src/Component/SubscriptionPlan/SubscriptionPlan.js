import React, { useRef, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './SubscriptionPlan.module.css';
import AnimatedButton from '../AnimatedButton/AnimatedButton';
import HeaderBar from "../HeaderBar/HeaderBar";

const plans = [
    {
        title: "STARTER",
        icon: '/svg/premium-icon.svg',
        circleFill: '/svg/sky-circle.svg',
        dollar: '$119',
        price: "/month per agent",
        subPrice: "$99/m",
        description: "Perfect for small workload in a startup or micro business",
        billedText: "When billed yearly in advance",
        features: [
            "300 minutes / month",
            "FREE VoIP Number",
            "Agent Characterization",
            "24/7 Availability",
            "Email Notifications",
            "Website Widget Integration",
            "Speech Naturalization",
            "Environment Setup",
            "Calendar Integration using Cal.com",
            "Book Calendar Meetings",
            "Call History(Basic)"
        ],
        color: "starter"
    },
    {
        title: "SCALER",
        icon: '/svg/premium-icon.svg',
        circleFill: '/svg/green-circle.svg',
        dollar: '$249',
        price: "/month per agent",
        subPrice: "$199/m",
        description: "Perfect for small workload in a startup or micro business",
        billedText: "When billed yearly in advance",
        features: [
            "300 minutes / month",
            "FREE VoIP Number",
            "Agent Characterization",
            "24/7 Availability",
            "Email Notifications",
            "Website Widget Integration",
            "Speech Naturalization",
            "Environment Setup",
            "Calendar Integration using Cal.com",
            "Book Calendar Meetings",
            "Call History(Basic)"
        ],
        color: "scaler"
    },
    {
        title: "GROWTH",
        icon: '/svg/premium-icon.svg',
        circleFill: '/svg/pink-circle.svg',
        dollar: '$499',
        price: "/month per agent",
        subPrice: "$449/m",
        description: "Perfect for small workload in a startup or micro business",
        billedText: "When billed yearly in advance",
        features: [
            "300 minutes / month",
            "FREE VoIP Number",
            "Agent Characterization",
            "24/7 Availability",
            "Email Notifications",
            "Website Widget Integration",
            "Speech Naturalization",
            "Environment Setup",
            "Calendar Integration using Cal.com",
            "Book Calendar Meetings",
            "Call History(Basic)"
        ],
        color: "growth"
    },
    {
        title: "CORPORATE",
        icon: '/svg/premium-icon.svg',
        circleFill: '/svg/orange-circle.svg',
        dollar:'$799',
        price: "/month per agent",
        subPrice: "$699/m",
        description: "Perfect for small workload in a startup or micro business",
        billedText: "When billed yearly in advance",
        features: [
            "300 minutes / month",
            "FREE VoIP Number",
            "Agent Characterization",
            "24/7 Availability",
            "Email Notifications",
            "Website Widget Integration",
            "Speech Naturalization",
            "Environment Setup",
            "Calendar Integration using Cal.com",
            "Book Calendar Meetings",
            "Call History(Basic)"
        ],
        color: "corporate"
    }
];

const SubscriptionPlan = () => {
    const sliderRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isYearly, setIsYearly] = useState(false);
    const [expandedPlans, setExpandedPlans] = useState({});
    const toggleExpand = (index) => {
        setExpandedPlans((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };


    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 1.15,
        slidesToScroll: 1,
        arrows: false,
        cssEase: 'ease-in-out',
        afterChange: (index) => setActiveIndex(index),
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1.2,
                },
            },
        ],
    };

    return (
        <div>
            <HeaderBar title="Upgrade Plan" />
            <div className={styles.wrapper}>
                <Slider ref={sliderRef} {...settings}>
                    {plans.map((plan, index) => (
                        <div key={index} className={styles.slide}>
                            <div className={`${styles.card} ${styles[plan.color]}`}>
                                <div className={`${styles.sectionTop} ${styles[`${plan.color}Bg`]}`}>
                                    <div className={styles.CardiSection}>
                                        <div className={styles.header}>
                                            <div className={styles.priceTop}>
                                                <div>
                                                    <img src={plan.icon} />
                                                </div>
                                                <div className={styles.pricdec}>
                                                    <p className={styles.subPrice}>{plan.subPrice}</p>
                                                    <p className={styles.billedText}>{plan.billedText}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className={`${styles.Title} ${styles[`${plan.color}Text`]}`}>{plan.title}</h3>
                                        <p className={styles.mainPrice}><b className={styles.doolor}>{plan.dollar}</b>{plan.price}</p>
                                        <p className={styles.description}>{plan.description}</p>
                                    </div>

                                </div>
                                <ul className={styles.featuresList}>
                                    <div
                                        className={`${styles.featuresWrapper} ${expandedPlans[index] ? styles.expanded : ''}`}
                                    >
                                        {plan.features.map((feature, idx) => (
                                            <li
                                                key={idx}
                                                className={`${styles.featureItem} ${expandedPlans[index] || idx < 5 ? styles.visible : styles.hidden
                                                    }`}
                                            >
                                                <img src={plan.circleFill} alt="" className={styles.featureIcon} />
                                                {feature}
                                            </li>
                                        ))}
                                    </div>

                                    {plan.features.length > 5 && (
                                        <p
                                            type="button"
                                            className={styles.seeAll}
                                            onClick={() => toggleExpand(index)}
                                        >
                                            {expandedPlans[index] ? 'Show Less' : '~ See All Features'}
                                        </p>
                                    )}
                                </ul>


                                <div className={styles.toggleWrap}>
                                    <span className={isYearly ? styles.inactive : styles.active}>Monthly</span>
                                    <label className={styles.toggleSwitch}>
                                        <input
                                            type="checkbox"
                                            checked={isYearly}
                                            onChange={() => setIsYearly(!isYearly)}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                    <span className={isYearly ? styles.active : styles.inactive}>Yearly</span>
                                </div>


                                <div className={styles.discount}>Save up to 20% when billed  yearly</div>
                                <br />
                                <div className={styles.stickyWrapper} >
                                    <AnimatedButton label="Subscribe for $119/m" position={{ position: 'relative' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>


            </div>
            <div className={styles.ForSticky}>
                <div className={styles.footerButtons}>
                    {plans.map((plan, index) => (
                        <button
                            key={index}
                            className={`${styles.footerBtn} ${styles[plan.color]} ${index === activeIndex ? styles.active : ''}`}
                            onClick={() => {
                                setActiveIndex(index);
                                sliderRef.current.slickGoTo(index);
                            }}
                        >
                            {plan.title}
                        </button>
                    ))}
                </div>
            </div>

        </div>

    );
};

export default SubscriptionPlan;
