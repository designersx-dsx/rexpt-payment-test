// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from './Plan.module.css';
// import Loader from '../Loader/Loader';

// const API_BASE = process.env.REACT_APP_API_BASE_URL;

// const Plan = ({ agentID, locationPath, subscriptionID }) => {
//   console.log(agentID, subscriptionID)
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selected, setSelected] = useState(null);
//   const [selectedAccordion, setSelectedAccordion] = useState(null);
//   const [priceId, setPriceId] = useState(null); // State to store the selected priceId
//   const [selectedTab, setSelectedTab] = useState('month'); // State to handle tab selection (monthly/yearly)
//   const navigate = useNavigate();
//   const [price, setPrice] = useState()

//   const [userCurrency, setUserCurrency] = useState('usd');

//   console.log("userCurrency", userCurrency)


//   useEffect(() => {
//     const getLocationCurrency = async () => {
//       try {
//         const response = await fetch('https://ipapi.co/json/');
//         const data = await response.json();
//         setUserCurrency(mapCountryToCurrency(data.country));
//       } catch (error) {
//         console.error('Error getting location:', error);
//         setUserCurrency('USD'); // fallback
//       }
//     };

//     const mapCountryToCurrency = (countryCode) => {
//       const countryCurrencyMap = {
//         IN: 'inr',
//         US: 'usd',
//         CA: 'cad',
//         AU: 'aud',
//         GB: 'gbp',
//         // add more as needed
//       };
//       return countryCurrencyMap[countryCode] || 'usd';
//     };

//     getLocationCurrency();
//   }, []);

//   useEffect(() => {
//     if (!userCurrency) return
//     const fetchPlans = async () => {
//       const apiUrl = `${API_BASE}/products`;
//       try {
//         const response = await fetch(apiUrl);
//         const data = await response.json();

//         const products = data.map(product => {
//           const matchingPrices = product.prices.filter(p =>
//             p.currency.toLowerCase() === userCurrency.toLowerCase() ||
//             p.currency_options?.some(opt => opt.currency === userCurrency.toLowerCase())
//           );

//           const selectedPrice = matchingPrices.length > 0
//             ? (matchingPrices.find(p => p.currency === userCurrency) || matchingPrices[0])
//             : product.prices[0];

//           let displayPrice = selectedPrice.unit_amount / 100;
//           let currency = selectedPrice.currency;

//           // Check if currency_options has a match and override
//           const option = selectedPrice.currency_options?.find(opt => opt.currency === userCurrency);
//           if (option) {
//             displayPrice = option.unit_amount / 100;
//             currency = option.currency;
//           }

//           return {
//             ...product,
//             price: displayPrice.toFixed(2),
//             currency: currency.toUpperCase(),
//             selectedPrice,
//             prices: product.prices,
//           };
//         });

//         setPlans(products);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError('Failed to load plans.');
//         setLoading(false);
//       }
//     };

//     fetchPlans();
//   }, [userCurrency]);

//   // Filter plans based on selected tab (monthly/yearly)
//   const filterPlansByInterval = (interval) => {
//     return plans.map((product) => {
//       const matchingPrices = product.prices.filter((price) => price.interval === interval &&
//         (price.currency.toLowerCase() === userCurrency.toLowerCase() ||
//           price.currency_options?.some(opt => opt.currency === userCurrency.toLowerCase()))
//       );

//       const selectedPrice = matchingPrices.find(p => p.currency === userCurrency) || matchingPrices[0];

//       let displayPrice = selectedPrice?.unit_amount / 100 || 0;
//       let currency = selectedPrice?.currency || userCurrency;

//       const option = selectedPrice?.currency_options?.find(opt => opt.currency === userCurrency);
//       if (option) {
//         displayPrice = option.unit_amount / 100;
//         currency = option.currency;
//       }

//       return {
//         ...product,
//         prices: matchingPrices,
//         selectedPrice,
//         price: displayPrice.toFixed(2),
//         currency: currency.toUpperCase()
//       };
//     }).filter(product => product.prices.length > 0);
//   };


//   // Accordion toggle function
//   const toggleAccordion = (id) => {
//     setSelectedAccordion(selectedAccordion === id ? null : id);
//   };


//   if (loading) return <p className={styles.status}><Loader /></p>;
//   if (error) return <p className={styles.statusError}>{error}</p>;

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <div className={styles.icon}>
//           <img src="images/inlogo.png" alt="inlogo" />
//         </div>
//         <div className={styles.headercontent}>
//           <h3>Select Your Plan</h3>
//           <p>Customizable payment structures</p>
//         </div>
//       </div>

//       {/* Tab buttons for Monthly and Yearly plans */}
//       <div className={styles.tabs}>
//         <button
//           className={`${styles.tabButton} ${selectedTab === 'month' ? styles.active : ''}`}
//           onClick={() => setSelectedTab('month')}
//         >
//           Monthly
//         </button>
//         <button
//           className={`${styles.tabButton} ${selectedTab === 'year' ? styles.active : ''}`}
//           onClick={() => setSelectedTab('year')}

//         >
//           Yearly
//         </button>
//       </div>

//       {/* Display Plans based on selected tab */}
//       <div className={styles.PlanDiv}>
//         {filterPlansByInterval(selectedTab).map((plan) => (
//           <div
//             key={plan.id}
//             className={`${styles.planBox} ${selected === plan.id ? styles.selected : ''}`}
//           >
//             <div className={styles.part1}>
//               <label className={styles.radioLabel}>
//                 <input
//                   type="radio"
//                   name="plan"
//                   value={plan.id}
//                   checked={selected === plan.id}
//                   onChange={() => {

//                     setSelected(plan.id);  // Set selected plan ID
//                     setPriceId(plan.selectedPrice?.id || null);
//                     setPrice(plan.price);

//                   }}
//                 />
//                 <div className={styles.planContent}>
//                   <div className={styles.planTitle}>
//                     <div>
//                       <p>{plan.name}</p>
//                       <span className={styles.description}>{plan.description.trim()}</span>
//                     </div>
//                   </div>
//                   <div className={styles.planData}>
//                     {plan.prices.length > 0 && (
//                       <p>
//                         Price: <strong>{plan.price} {plan.currency}</strong> / {plan.selectedPrice?.interval}
//                       </p>

//                     )}
//                     <p>
//                       <strong>{(plan.prices[0].metadata || "")}</strong> minutes included / month
//                     </p>
//                   </div>
//                 </div>

//               </label>
//             </div>

//             {/* Accordion for extra details */}
//             <div className={`${styles.accordion} ${selectedAccordion === plan.id ? styles.open : ''}`}>
//               {plan.minutes && (
//                 <p>Includes <strong>{plan.minutes}</strong> minutes</p>
//               )}
//               <div className={styles.pricesContainer}>
//                 {plan.prices.map((price) => (
//                   <div
//                     key={price.id}
//                     className={styles.priceOption}

//                     onClick={(e) => {
//                       e.stopPropagation();
//                       navigate('/steps', { state: { priceId: price.id } });
//                       setPriceId(null);
//                       sessionStorage.setItem("priceId", priceId)

//                     }}
//                   >
//                     {(price.unit_amount / 100).toFixed(2)} {price.currency.toUpperCase()} / {price.interval}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Continue button */}
//       <div className={styles.bottomBtn}>
//         <div
//           className={styles.btnTheme}
//           onClick={() => {
//             if (priceId) {
//               if (agentID) {
//                 navigate(`/checkout`, { state: { priceId, agentId: agentID, subscriptionId: subscriptionID, locationPath1: "/update", price: price } }, sessionStorage.setItem("priceId", priceId), sessionStorage.setItem("price", price), sessionStorage.setItem("agentId", agentID), sessionStorage.setItem("subscriptionID", subscriptionID))
//               }
//               else {
//                 navigate(`/steps`, { state: { priceId, agentId: agentID, subscriptionId: subscriptionID, price: price } }, sessionStorage.setItem("priceId", priceId), sessionStorage.setItem("price", price), sessionStorage.setItem("agentId", agentID), sessionStorage.setItem("subscriptionID", subscriptionID))
//               }
//               ;
//             } else {
//               alert('Please select a plan first');
//             }
//           }}
//         >
//           <img src="svg/svg-theme.svg" alt="" />
//           <p>Continue</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Plan;





import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './Plan.module.css';
import AnimatedButton from '../AnimatedButton/AnimatedButton';
import HeaderBar from "../HeaderBar/HeaderBar";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Planss = () => {
    const sliderRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [expandedPlans, setExpandedPlans] = useState({});
    const [toggleStates, setToggleStates] = useState({}); // { planId: true/false }
    const [products, setProducts] = useState([]);
    console.log("products", products)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userCurrency, setUserCurrency] = useState("usd");

    const navigate = useNavigate();
    const location = useLocation();

    let agentID = location?.state?.agentID

    let subscriptionID = location?.state?.subscriptionID
    let locationPath = location?.state?.locationPath
    console.log(location, "agent")

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


    const mapCountryToCurrency = (countryCode) => {

        const countryCurrencyMap = {
            // IN: 'inr',
            US: 'usd',
            CA: 'cad',
            AU: 'aud',
            GB: 'gbp',
            // add more as needed
        };
        return countryCurrencyMap[countryCode] || 'usd';

    }

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
                IN: "inr",
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

                // Step 2: Sort by highest monthly priceee
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

                setToggleStates(toggleInit);
                setProducts(enrichedPlans.reverse()); // no .reverse()
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load plans.");
                setLoading(false);
            });
    }, [userCurrency]);


    if (loading)
        return (
            <p className={styles.status}>
                <Loader />
            </p>
        );
    if (error) return <p className={styles.statusError}>{error}</p>;

    return (
        <div>
            <HeaderBar title="Upgrade Plan" />
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
                                    className={`${styles.card} ${styles[plan.color]}`}

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
                                                onChange={(e) =>
                                                    setToggleStates((prev) => ({
                                                        ...prev,
                                                        [plan.id]: e.target.checked,
                                                    }))
                                                }
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

                                    <div className={styles.discount}>
                                        Save up to 20% when billed yearly
                                    </div>
                                    <br />
                                    <div className={styles.stickyWrapper}>
                                        <AnimatedButton
                                            label={
                                                priceForInterval
                                                    ? `Subscribe for ${getCurrencySymbol(priceForInterval.currency)}${(
                                                        priceForInterval.unit_amount / 100
                                                    ).toFixed(2)}/${priceForInterval.interval}`
                                                    : "Unavailable"
                                            }
                                            position={{ position: "relative" }} 
                                            size = "14px" 
                                            onClick={() => {
                                                if (priceForInterval) {

                                                    if (agentID) {
                                                        navigate(`/checkout`, { state: { priceId: priceForInterval.id, agentId: agentID, subscriptionId: subscriptionID, locationPath1: "/update", price: (priceForInterval.unit_amount / 100).toFixed(2) } }, sessionStorage.setItem("priceId", priceForInterval.id), sessionStorage.setItem("price", (priceForInterval.unit_amount / 100).toFixed(2)), sessionStorage.setItem("agentId", agentID), sessionStorage.setItem("subscriptionID", subscriptionID))
                                                    }

                                                    else {
                                                        const today = new Date();
                                                        const nextBillingDate = new Date(today);

                                                        if (priceForInterval.interval === "month") {
                                                            nextBillingDate.setMonth(today.getMonth() + 1);
                                                        } else {
                                                            nextBillingDate.setFullYear(today.getFullYear() + 1);
                                                        }

                                                        const selectedPlanData = {
                                                            priceId: priceForInterval.id,
                                                            agentId: agentID,
                                                            price: (priceForInterval.unit_amount / 100).toFixed(2),
                                                            interval: priceForInterval.interval,
                                                            currency: priceForInterval.currency,
                                                            billingTodayAmount:
                                                                priceForInterval.interval === "month"
                                                                    ? (priceForInterval.unit_amount / 100).toFixed(2)
                                                                    : ((priceForInterval.unit_amount / 100) * 12 * 0.95).toFixed(2),
                                                            billingDate: today.toISOString(),
                                                            nextBillingDate: nextBillingDate.toISOString(),
                                                        };

                                                        // ✅ Save to localStorage
                                                        localStorage.setItem("selectedPlanData", JSON.stringify(selectedPlanData));
                                                        navigate("/steps", {
                                                            state: {
                                                                priceId: priceForInterval.id,
                                                                agentId: agentID,
                                                                locationPath1: locationPath,
                                                                price: (priceForInterval.unit_amount / 100).toFixed(2),
                                                                interval: priceForInterval.interval,
                                                            },
                                                        },
                                                            sessionStorage.setItem("priceId", priceForInterval.id), sessionStorage.setItem("price", (priceForInterval.unit_amount / 100).toFixed(2))
                                                        );
                                                    }
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

            <div className={styles.ForSticky}>
                <div className={styles.footerButtons}>
                    {products.map((plan, index) => (
                        <button
                            key={index}
                            className={`${styles.footerBtn} ${styles[plan.color]} ${index === activeIndex ? styles.active : ""
                                }`}
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

export default Planss
