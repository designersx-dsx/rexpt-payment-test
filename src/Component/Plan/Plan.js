import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Plan.module.css';
import Loader from '../Loader/Loader';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Plan = ({ agentID, locationPath, subscriptionID }) => {
  console.log(agentID, subscriptionID)
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [selectedAccordion, setSelectedAccordion] = useState(null);
  const [priceId, setPriceId] = useState(null); // State to store the selected priceId
  const [selectedTab, setSelectedTab] = useState('month'); // State to handle tab selection (monthly/yearly)
  const navigate = useNavigate();
  const [price, setPrice] = useState()

  const [userCurrency, setUserCurrency] = useState('usd');

  console.log("userCurrency", userCurrency)


  useEffect(() => {
    const getLocationCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserCurrency(mapCountryToCurrency(data.country));
      } catch (error) {
        console.error('Error getting location:', error);
        setUserCurrency('USD'); // fallback
      }
    };

    const mapCountryToCurrency = (countryCode) => {
      const countryCurrencyMap = {
        IN: 'inr',
        US: 'usd',
        CA: 'cad',
        AU: 'aud',
        GB: 'gbp',
        // add more as needed
      };
      return countryCurrencyMap[countryCode] || 'usd';
    };

    getLocationCurrency();
  }, []);

  useEffect(() => {
    if (!userCurrency) return
    const fetchPlans = async () => {
      const apiUrl = `${API_BASE}/products`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const products = data.map(product => {
          const matchingPrices = product.prices.filter(p =>
            p.currency.toLowerCase() === userCurrency.toLowerCase() ||
            p.currency_options?.some(opt => opt.currency === userCurrency.toLowerCase())
          );

          const selectedPrice = matchingPrices.length > 0
            ? (matchingPrices.find(p => p.currency === userCurrency) || matchingPrices[0])
            : product.prices[0];

          let displayPrice = selectedPrice.unit_amount / 100;
          let currency = selectedPrice.currency;

          // Check if currency_options has a match and override
          const option = selectedPrice.currency_options?.find(opt => opt.currency === userCurrency);
          if (option) {
            displayPrice = option.unit_amount / 100;
            currency = option.currency;
          }

          return {
            ...product,
            price: displayPrice.toFixed(2),
            currency: currency.toUpperCase(),
            selectedPrice,
            prices: product.prices,
          };
        });

        setPlans(products);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load plans.');
        setLoading(false);
      }
    };

    fetchPlans();
  }, [userCurrency]);

  // Filter plans based on selected tab (monthly/yearly)
  const filterPlansByInterval = (interval) => {
    return plans.map((product) => {
      const matchingPrices = product.prices.filter((price) => price.interval === interval &&
        (price.currency.toLowerCase() === userCurrency.toLowerCase() ||
          price.currency_options?.some(opt => opt.currency === userCurrency.toLowerCase()))
      );

      const selectedPrice = matchingPrices.find(p => p.currency === userCurrency) || matchingPrices[0];

      let displayPrice = selectedPrice?.unit_amount / 100 || 0;
      let currency = selectedPrice?.currency || userCurrency;

      const option = selectedPrice?.currency_options?.find(opt => opt.currency === userCurrency);
      if (option) {
        displayPrice = option.unit_amount / 100;
        currency = option.currency;
      }

      return {
        ...product,
        prices: matchingPrices,
        selectedPrice,
        price: displayPrice.toFixed(2),
        currency: currency.toUpperCase()
      };
    }).filter(product => product.prices.length > 0);
  };


  // Accordion toggle function
  const toggleAccordion = (id) => {
    setSelectedAccordion(selectedAccordion === id ? null : id);
  };


  if (loading) return <p className={styles.status}><Loader /></p>;
  if (error) return <p className={styles.statusError}>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <img src="images/inlogo.png" alt="inlogo" />
        </div>
        <div className={styles.headercontent}>
          <h3>Select Your Plan</h3>
          <p>Customizable payment structures</p>
        </div>
      </div>

      {/* Tab buttons for Monthly and Yearly plans */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${selectedTab === 'month' ? styles.active : ''}`}
          onClick={() => setSelectedTab('month')}
        >
          Monthly
        </button>
        <button
          className={`${styles.tabButton} ${selectedTab === 'year' ? styles.active : ''}`}
          onClick={() => setSelectedTab('year')}

        >
          Yearly
        </button>
      </div>

      {/* Display Plans based on selected tab */}
      <div className={styles.PlanDiv}>
        {filterPlansByInterval(selectedTab).map((plan) => (
          <div
            key={plan.id}
            className={`${styles.planBox} ${selected === plan.id ? styles.selected : ''}`}
          >
            <div className={styles.part1}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={selected === plan.id}
                  onChange={() => {

                    setSelected(plan.id);  // Set selected plan ID
                    setPriceId(plan.selectedPrice?.id || null);
                    setPrice(plan.price);

                  }}
                />
                <div className={styles.planContent}>
                  <div className={styles.planTitle}>
                    <div>
                      <p>{plan.name}</p>
                      <span className={styles.description}>{plan.description.trim()}</span>
                    </div>
                  </div>
                  <div className={styles.planData}>
                    {plan.prices.length > 0 && (
                      <p>
                        Price: <strong>{plan.price} {plan.currency}</strong> / {plan.selectedPrice?.interval}
                      </p>

                    )}
                    <p>
                      <strong>{(plan.prices[0].metadata || "")}</strong> minutes included / month
                    </p>
                  </div>
                </div>

              </label>
            </div>

            {/* Accordion for extra details */}
            <div className={`${styles.accordion} ${selectedAccordion === plan.id ? styles.open : ''}`}>
              {plan.minutes && (
                <p>Includes <strong>{plan.minutes}</strong> minutes</p>
              )}
              <div className={styles.pricesContainer}>
                {plan.prices.map((price) => (
                  <div
                    key={price.id}
                    className={styles.priceOption}

                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/steps', { state: { priceId: price.id } });
                      setPriceId(null);
                      sessionStorage.setItem("priceId", priceId)

                    }}
                  >
                    {(price.unit_amount / 100).toFixed(2)} {price.currency.toUpperCase()} / {price.interval}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue button */}
      <div className={styles.bottomBtn}>
        <div
          className={styles.btnTheme}
          onClick={() => {
            if (priceId) {
              if (agentID) {
                navigate(`/checkout`, { state: { priceId, agentId: agentID, subscriptionId: subscriptionID, locationPath1: "/update", price: price } }, sessionStorage.setItem("priceId", priceId), sessionStorage.setItem("price", price), sessionStorage.setItem("agentId", agentID), sessionStorage.setItem("subscriptionID", subscriptionID))
              }
              else {
                navigate(`/steps`, { state: { priceId, agentId: agentID, subscriptionId: subscriptionID, price: price } }, sessionStorage.setItem("priceId", priceId), sessionStorage.setItem("price", price), sessionStorage.setItem("agentId", agentID), sessionStorage.setItem("subscriptionID", subscriptionID))
              }
              ;
            } else {
              alert('Please select a plan first');
            }
          }}
        >
          <img src="svg/svg-theme.svg" alt="" />
          <p>Continue</p>
        </div>
      </div>
    </div>
  );
};

export default Plan;