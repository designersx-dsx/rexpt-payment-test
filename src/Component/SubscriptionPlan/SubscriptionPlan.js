import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './SubscriptionPlan.module.css';
import AnimatedButton from '../AnimatedButton/AnimatedButton';
import FreeTrialModal from '../FreeTrialModal/FreeTrialModal';
import HeaderBar from "../HeaderBar/HeaderBar";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import Loader2 from '../Loader2/Loader2';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const SubscriptionPlan = ({ agentID, locationPath }) => {
    const sliderRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [expandedPlans, setExpandedPlans] = useState({});
    const [expanded, setExpanded] = useState(false);


    const [toggleStates, setToggleStates] = useState({}); // { planId: true/false }
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [freeTrial, setFreeTrial] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const [userCurrency, setUserCurrency] = useState("usd");

    const navigate = useNavigate();
    const location = useLocation();
    const handleClick = () => {
        setFreeTrial(!freeTrial);
        setIsModalOpen(true);
    };
    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 1.15,
        slidesToScroll: 1,
        arrows: false,
        cssEase: 'ease-in-out',
        afterChange: (index) => {
            setActiveIndex(Math.round(index));
        },
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1.2,
                },
            },
        ],
    };

    const toggleExpand = (index) => {
        setExpandedPlans((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const getCurrencySymbol = (currencyCode) => {
        try {
            return new Intl.NumberFormat('en', {
                style: 'currency',
                currency: currencyCode.toUpperCase(),
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            })
                .formatToParts(1)
                .find(part => part.type === 'currency')?.value || "$";
        } catch {
            return "$";
        }
    };



    useEffect(() => {
        const getLocationCurrency = async () => {
            try {
                const response = await fetch("https://ipwho.is/");
                const data = await response.json();

                if (data.success && data.country_code) {
                    const currency = mapCountryToCurrency(data.country_code);
                    setUserCurrency(currency);
                    console.log(data)
                } else {
                    throw new Error("Invalid IP data");
                }
            } catch (error) {
                console.error("Error determining location-based currency:", error);
                setUserCurrency("usd"); // fallback
            }
        };

        const mapCountryToCurrency = (countryCode) => {
            const countryCurrencyMap = {
                // IN: "inr",
                US: "usd",
                CA: "cad",
                AU: "aud",
                GB: "gbp",
            };
            return countryCurrencyMap[countryCode] || "usd";
        };

        getLocationCurrency();
    }, []);

    useEffect(() => {
        if (!userCurrency) return;

        fetch(`${API_BASE}/products`)
            .then((res) => res.json())
            .then((data) => {
                const planColorMap = ["starter", "scaler", "growth", "corporate"];
                const icon = "/svg/premium-icon.svg";
                const circleFills = [
                    "/svg/sky-circle.svg",
                    "/svg/green-circle.svg",
                    "/svg/pink-circle.svg",
                    "/svg/orange-circle.svg",
                ];

                // Step 1: Enrich each product WITHOUT assigning color
                let enrichedPlans = data.map((product) => {
                    const matchedData = product.data?.data?.find(
                        (p) => p.id === product.id
                    );

                    const matchingPrices = product.prices.filter(
                        (p) =>
                            p.currency.toLowerCase() === userCurrency.toLowerCase() ||
                            p.currency_options?.some(
                                (opt) => opt.currency === userCurrency.toLowerCase()
                            )
                    );

                    const enrichedPrices = matchingPrices.map((price) => {
                        let displayPrice = price.unit_amount / 100;
                        let currency = price.currency;

                        const option = price.currency_options?.find(
                            (opt) => opt.currency === userCurrency
                        );
                        if (option) {
                            displayPrice = option.unit_amount / 100;
                            currency = option.currency;
                        }

                        return {
                            ...price,
                            unit_amount: displayPrice * 100,
                            currency: currency.toLowerCase(),
                        };
                    });

                    return {
                        ...product,
                        title: product.name || `Plan`,
                        icon,
                        prices: enrichedPrices,
                        description: product.description || "No description provided",
                        billedText: "When billed yearly in advance",
                        features: product.metadata?.features
                            ? JSON.parse(product.metadata.features)
                            : [
                                `${matchedData?.metadata?.["minutes-month"] || "0"} minutes / month`, ,
                                "FREE VoIP Number",
                                "Agent Characterization",
                                "24/7 Availability",
                                "Email Notifications",
                                "Website Widget Integration",
                                "Speech Naturalization",
                                "Environment Setup",
                                "Calendar Integration using Cal.com",
                                "Book Calendar Meetings",
                                "Call History(Basic)",
                            ],
                    };
                });

                // Step 2: Sort by highest monthly price
                enrichedPlans.sort((a, b) => {
                    const aPrice =
                        a.prices.find((p) => p.interval === "month")?.unit_amount || 0;
                    const bPrice =
                        b.prices.find((p) => p.interval === "month")?.unit_amount || 0;
                    return bPrice - aPrice;
                });

                // Step 3: Assign reversed colors and circles
                const total = enrichedPlans.length;
                enrichedPlans = enrichedPlans.map((plan, index) => {
                    const reversedIndex = total - 1 - index;
                    return {
                        ...plan,
                        color: planColorMap[reversedIndex % planColorMap.length],
                        circleFill: circleFills[reversedIndex % circleFills.length],
                    };
                });

                // Step 4: Init toggle state
                const toggleInit = {};
                enrichedPlans.forEach((plan) => {
                    toggleInit[plan.id] = false; // monthly by default
                });

                const finalPlans = enrichedPlans.reverse()

                setToggleStates(toggleInit);
                setProducts(finalPlans); // no .reverse()
                setLoading(false);

                // ✅ Preselect saved plan name (e.g., "Growth")
                const savedPlanName = sessionStorage.getItem("selectedPlan");
                if (savedPlanName) {
                    const matchingIndex = finalPlans.findIndex(plan => plan.title.toLowerCase() === savedPlanName.toLowerCase());

                    if (matchingIndex >= 0) {
                        setActiveIndex(matchingIndex);
                        setTimeout(() => {
                            sliderRef.current?.slickGoTo(matchingIndex);
                        }, 100); // Ensure slider is ready
                    }

                    // Optional: remove it after selection
                    // sessionStorage.removeItem("selectedPlan");
                }


            })


            .catch(() => {
                setError("Failed to load plans.");
                setLoading(false);
            });

    }, [userCurrency]);


    if (loading)
        return (
            <p className={styles.status}>
                <Loader2 />
            </p>
        );
    if (error) return <p className={styles.statusError}>{error}</p>;


    const features = [
        '20 minutes FREE Usage on Us',
        'No VOIP Number',
        'Agent Characterization',
        'Starter Package Feature',
        'No Call Recording',
        'Priority Email Support',
        'Analytics Dashboard',
        'Custom Greeting Message',
        'User Management',
    ];
    const visibleFeatures = expanded ? features : features.slice(0, 5);

    const handleToggle = () => {
        setExpanded((prev) => !prev);
    };

    return (
        <div>
            <div className={styles.firstdiv}>
                <HeaderBar title="Upgrade Plan" />
                <label className={styles.freeTrialBtn} onChange={handleClick}>
                    FREE TRIAL
                    <input
                        type="checkbox"
                        checked={freeTrial}
                        onChange={() => setFreeTrial(!freeTrial)}
                    />
                    <span className={`${styles.checkCircle} ${freeTrial ? styles.checked : ""}`}>
                        {freeTrial && (
                            <svg
                                className={styles.checkIcon}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                            >
                                <path
                                    fill="white"
                                    d="M20.3 5.7a1 1 0 0 0-1.4 0L9 15.6l-3.9-3.9a1 1 0 0 0-1.4 1.4l4.6 4.6a1 1 0 0 0 1.4 0l10.6-10.6a1 1 0 0 0 0-1.4z"
                                />
                            </svg>
                        )}
                    </span>
                </label>
            </div>
            <div>
                <div className={styles.sectionPart}>
                    <h2>Subscriptions Plans </h2>
                    <p>Choose a suitable plan for your agent & business case</p>
                </div>
                <div className={styles.wrapper}>
                    <Slider ref={sliderRef} {...settings}>
                        {products.map((plan, index) => {
                            const isYearly = toggleStates[plan.id];
                            const interval = isYearly ? "year" : "month";
                            const priceForInterval = plan.prices.find((p) => p.interval === interval);

                            // 🔒 Always show yearly price in fixed places
                            const yearlyPrice = plan.prices.find((p) => p.interval === "year");
                            const monthlyPrice = plan.prices.find((p) => p.interval === "month");
                            const currencySymbol = getCurrencySymbol(monthlyPrice?.currency || userCurrency);
                            const yearlySymbol = getCurrencySymbol(yearlyPrice?.currency || userCurrency);



                            return (
                                <div key={plan.id} className={styles.slide}>
                                    <div
                                        className={`
      ${styles.card}
      ${styles[plan.color]}
      ${index === activeIndex ? styles.activeOverlay : ""}
      ${index !== activeIndex ? styles.inactiveCard : ""}
    `}

                                    >
                                        <div className={`${styles.sectionTop} ${styles[`${plan.color}Bg`]}`}>
                                            <div className={styles.CardiSection}>
                                                <div className={styles.header}>
                                                    <div className={styles.priceTop}>
                                                        <div>
                                                            <img src={plan.icon} alt="" />
                                                        </div>
                                                        <div className={styles.pricdec}>
                                                            <p className={styles.subPrice}>
                                                                {yearlyPrice
                                                                    ? `${yearlySymbol}${(yearlyPrice.unit_amount / 100 / 12).toFixed(0)}/m`
                                                                    : `${yearlySymbol}0/m`}
                                                            </p>
                                                            <p className={styles.billedText}>{plan.billedText}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <h3 className={`${styles.Title} ${styles[`${plan.color}Text`]}`}>
                                                    {plan.title}
                                                </h3>
                                                <p className={styles.mainPrice}>
                                                    <b className={styles.doolor}>
                                                        {monthlyPrice
                                                            ? `${currencySymbol}${(monthlyPrice.unit_amount / 100).toFixed(0)}`
                                                            : `${currencySymbol}0`}
                                                    </b>
                                                    /month per agent
                                                </p>
                                                <p className={styles.description}>{plan.description}</p>
                                            </div>
                                        </div>

                                        <ul className={styles.featuresList}>
                                            <div
                                                className={`${styles.featuresWrapper} ${expandedPlans[index] ? styles.expanded : ""
                                                    }`}
                                            >
                                                {plan.features.map((feature, idx) => (
                                                    <li
                                                        key={idx}
                                                        className={`${styles.featureItem} ${expandedPlans[index] || idx < 5
                                                            ? styles.visible
                                                            : styles.hidden
                                                            }`}
                                                    >
                                                        <img
                                                            src={plan.circleFill}
                                                            alt=""
                                                            className={styles.featureIcon}
                                                        />
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
                                                    {expandedPlans[index] ? "Show Less" : "~ See All Features"}
                                                </p>
                                            )}
                                        </ul>

                                        <div className={styles.toggleWrap}>
                                            <span
                                                className={
                                                    toggleStates[plan.id] ? styles.inactive : styles.active
                                                }
                                            >
                                                Monthly
                                            </span>
                                            <label className={styles.toggleSwitch}>
                                                <input
                                                    type="checkbox"
                                                    checked={toggleStates[plan.id]}
                                                    // onChange={(e) =>
                                                    //     setToggleStates((prev) => ({
                                                    //         ...prev,
                                                    //         [plan.id]: e.target.checked,
                                                    //     }))
                                                    // }
                                                    onChange={(e) => {
                                                        const isYearly = e.target.checked;
                                                        const newState = {};
                                                        products.forEach((p) => {
                                                            newState[p.id] = false; // default to Monthly
                                                        });
                                                        newState[plan.id] = isYearly; // only current one is Yearly if checked
                                                        setToggleStates(newState);
                                                    }}
                                                />
                                                <span className={styles.slider}></span>
                                            </label>
                                            <span
                                                className={
                                                    toggleStates[plan.id] ? styles.active : styles.inactive
                                                }
                                            >
                                                Yearly
                                            </span>
                                        </div>

                                        {toggleStates[plan.id] && monthlyPrice && yearlyPrice && (
                                            (() => {
                                                const monthlyTotal = monthlyPrice.unit_amount;
                                                console.log("monthlyPrice", monthlyPrice)
                                                const yearlyTotal = yearlyPrice.unit_amount / 12;
                                                console.log("yearlyTotal", yearlyPrice)
                                                const savings = monthlyTotal - yearlyTotal;
                                                const savingsPercent = ((savings / monthlyTotal) * 100).toFixed(0);

                                                return (
                                                    <div className={styles.discount}>
                                                        You save {savingsPercent}% ({getCurrencySymbol(yearlyPrice.currency)}{(savings / 100).toFixed(0)}) compared to monthly billing
                                                    </div>
                                                );
                                            })()
                                        )}
                                        <br />
                                        <div style={{ fontSize: "12px" }} className={styles.stickyWrapper}>
                                            <AnimatedButton
                                                label={
                                                    priceForInterval
                                                        ? `Subscribe for ${getCurrencySymbol(priceForInterval.currency)}${(
                                                            priceForInterval.unit_amount / 100
                                                        ).toFixed(2)}/${priceForInterval.interval}`
                                                        : "Unavailable"
                                                }
                                                position={{ position: "relative" }}
                                                size="10px"
                                                onClick={() => {
                                                    if (priceForInterval) {
                                                        navigate("/checkout", {
                                                            state: {
                                                                priceId: priceForInterval.id,
                                                                agentId: agentID,
                                                                locationPath1: locationPath,
                                                                price: (priceForInterval.unit_amount / 100).toFixed(2),
                                                                interval: priceForInterval.interval,
                                                            },
                                                        });
                                                    } else {
                                                        alert("Price not available for selected interval");
                                                    }
                                                }}
                                            />

                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                </div>
            </div>

            <FreeTrialModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setFreeTrial(false);
                }}>
                <div className={styles.freeTrialMain}>
                    <div className={styles.Topsection}>
                        <h1>FREE TRIAL</h1>
                        <p>No Cost to Try Our Agents</p>
                        <text>Explore our agents and viability for your business at <b className={styles.boldText}>“NO COST”.</b></text>
                    </div>
                    <div className={styles.featureList}>
                        <div className={styles.listdata}>
                            {visibleFeatures.map((text, index) => {
                                const isNegative = text.toLowerCase().includes('no');
                                return (
                                    <div className={styles.liData} key={index}>
                                        <img
                                            src={isNegative ? '/svg/cross-svg.svg' : '/svg/tick-svg.svg'}
                                            alt={isNegative ? 'cross icon' : 'tick icon'}
                                        />
                                        <p>{text}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <p className={styles.toggleText} onClick={handleToggle}>
                            ~ {expanded ? 'Hide Features' : 'See All Features'}
                        </p>

                        <AnimatedButton onClick={() => {
                            navigate("/steps", {
                                state: {
                                    freeTrial: true,
                                },
                            });
                        }} label='Subscribe' position={{ position: "relative" }} />


                    </div>

                </div>

            </FreeTrialModal>

            <div className={styles.ForSticky}>
                <div className={styles.footerButtons}>

                    {products.map((plan, index) => {
                        const isYearly = toggleStates[plan.id];
                        // const interval = isYearly ? "year" : ;
                        const interval = "month"
                        const selectedPrice = plan.prices.find(p => p.interval === interval);
                        const symbol = getCurrencySymbol(selectedPrice?.currency || userCurrency);
                        const amount = selectedPrice ? (selectedPrice.unit_amount / 100).toFixed(0) : "0";

                        return (
                            <div
                                key={plan.id}
                                className={styles.navBox}
                                onClick={() => {
                                    setActiveIndex(index);
                                    sliderRef.current.slickGoTo(index);
                                }}
                            >
                                <input
                                    type="radio"
                                    name="plan"
                                    checked={activeIndex === index}
                                    onChange={() => setActiveIndex(index)}
                                    className={styles.radiobtn}
                                />

                                {plan.title === "Starter" ? <img src="/svg/starter-icon.svg" /> : null}
                                {plan.title === "Scaler" ? <img src="/svg/scaler-icon.svg" /> : null}
                                {plan.title === "Growth" ? <img src="/svg/growth-icon.svg" /> : null}
                                {plan.title === "Corporate" ? <img src="/svg/corporate-icon.svg" /> : null}

                                <button
                                    className={`${styles.footerBtn} ${styles[plan.color]} ${index === activeIndex ? styles.active : ""
                                        }`}
                                >
                                    {plan.title}
                                </button>

                                <p className={`${styles.footerBtn} $ ${styles[plan.color]}  ${styles.extraClass} ${index === activeIndex ? styles.active : ""
                                    }`}>
                                    from {symbol}{amount}/{interval === "year" ? "yr" : "m"}
                                </p>
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlan;
