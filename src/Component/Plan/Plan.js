import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Plan.module.css';
import Loader from '../Loader/Loader';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Plan = ({ agentID, locationPath, subscriptionID }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [selectedAccordion, setSelectedAccordion] = useState(null);
  const [priceId, setPriceId] = useState(null); // State to store the selected priceId
  const [selectedTab, setSelectedTab] = useState('month'); // State to handle tab selection (monthly/yearly)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      const apiUrl = `${API_BASE}/products`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
console.log({data})
        // Process the API response (products)
        const products = data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: (product.prices[0].unit_amount / 100).toFixed(2),
          currency: product.prices[0].currency.toUpperCase(),
          minutes: product.metadata?.minutes,
          period: product.prices[0].recurring?.interval,
          priceId: product.prices[0].id,
          prices: product.prices // Store all prices for each product
        }));

        setPlans(products);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load plans.');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Filter plans based on selected tab (monthly/yearly)
  const filterPlansByInterval = (interval) => {
    return plans.map((product) => ({
      ...product,
      prices: product.prices.filter((price) => price.interval === interval), // Filter prices by interval
    })).filter(product => product.prices.length > 0); // Remove products with no matching prices
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
                    setPriceId(plan.priceId);  // Set the corresponding priceId
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
                    <p>
                      Price: <strong>{plan.price} {plan.currency}</strong> / {plan.prices[0].interval}
                    </p>
                    <p>
                      <strong>{plan.minutes}</strong> minutes included
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
                      navigate('/checkout', { state: { priceId: price.id } });
                      setPriceId(null);
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
              navigate('/checkout', { state: { priceId, agentId: agentID, subscriptionId: subscriptionID, locationPath1: agentID ? locationPath : "/dsbd" } });
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
