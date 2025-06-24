import React, { useState, useEffect } from "react";
import styles from "./Plans.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Plan = ({ agentID, locationPath }) => {
  const [products, setProducts] = useState([]);
  console.log("products", products);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(null);
  const [selectedTab, setSelectedTab] = useState("month"); // To handle the tab state
  const [selectedPrice, setSelectedPrice] = useState(null);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => {
        // Add a free trial option
        const freeTrial = {
          id: "free-trial",
          name: "Free Trial",
          description: "Try all features free — includes 10 minutes",
          prices: [],
          metadata: { minutes: 10 },
        };

        // Map the products and add the free trial at the top
        const productsWithMetadata = [
          freeTrial,
          ...data.map((product) => {
            const matchedData = product.data?.data?.find(
              (p) => p.id === product.id
            );
            return {
              ...product,
              metadata: matchedData?.metadata || {},
            };
          }),
        ];

        setProducts(productsWithMetadata);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load plans.");
        setLoading(false);
      });
  }, []);

  const toggleAccordion = (id) => {
    setOpen(open === id ? null : id);
  };

  // Filter the products based on selectedTab (monthly or yearly)
  const filterPlansByInterval = (interval) => {
    return (
      products
        .map((product) => {
          // If it's the free trial, just return it as is
          if (product.id === "free-trial") return product;

          // Filter the prices based on the selected interval
          const filteredPrices = product.prices.filter(
            (price) => price.interval === interval
          );

          // If the product has prices for the selected interval, return the product with only those prices
          if (filteredPrices.length > 0) {
            return {
              ...product,
              prices: filteredPrices,
            };
          }

          // Return null if no matching prices exist
          return null;
        })
        // Remove null values from the array (products that don't have prices for the selected interval)
        .filter((product) => product !== null)
    );
  };

  if (loading)
    return (
      <p className={styles.status}>
        <Loader />
      </p>
    );
  if (error) return <p className={styles.statusError}>{error}</p>;

  return (
    <div className={styles.hero_sec}>
      <div className={styles.container}>
        <div className={styles.headerCOntro}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.icon}>
              <img src="images/inlogo.png" alt="inlogo" />
            </div>
            <div className={styles.headercontent}>
              <h3>Select Your Plan</h3>
              <p>Customizable payment structures</p>
            </div>
          </div>

          {/* Tab buttons for Yearly and Monthly plans */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${
                selectedTab === "month" ? styles.active : ""
              }`}
              onClick={() => {
                setSelectedTab("month");
                setSelected(null);
                setSelectedPrice(null);
              }}
            >
              Monthly
            </button>
            <button
              className={`${styles.tabButton} ${
                selectedTab === "year" ? styles.active : ""
              }`}
              onClick={() => {
                setSelectedTab("year");
                setSelected(null);
                setSelectedPrice(null);
              }}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Stripe Product Plans */}
        {filterPlansByInterval(selectedTab).map((product) => (
          <div
            key={product.id}
            className={`${styles.planBox} ${
              selected === product.id ? styles.selected : ""
            }`}
            onClick={() => {
              setSelected(product.id);
              if (product.prices.length === 1) {
                const price = product.prices[0];
                setSelectedPrice({
                  id: price.id,
                  amount: (price.unit_amount / 100).toFixed(2),
                  rawAmount: price.unit_amount,
                  currency: price.currency,
                  interval: price.interval,
                });
              }
            }}
          >
            <div className={styles.part1}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="plan"
                  value={product.id}
                  checked={selected === product.id}
                  onChange={() => setSelected(product.id)}
                />
                <div className={styles.planContent}>
                  <div className={styles.planTitle}>
                    <div>
                      <p>{product.name}</p>
                      <span className={styles.description}>
                        {product.description}
                      </span>
                    </div>
                    {product.metadata.badge && (
                      <span className={styles.badge}>
                        {product.metadata.badge}
                      </span>
                    )}
                  </div>
                </div>
              </label>

              <img
                src={open === product.id ? "/svg/up.svg" : "/svg/down.svg"}
                alt="Toggle Arrow"
                className={`${styles.arrowIcon} ${
                  open === product.id ? styles.rotated : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAccordion(product.id);
                }}
              />
            </div>

            <div
              className={`${styles.accordion} ${
                open === product.id ? styles.open : ""
              }`}
            >
              {product.metadata.minutes && (
                <p>
                  Includes <strong>{product?.prices[0]?.metadata}</strong>{" "}
                  minutes
                </p>
              )}
              <div className={styles.pricesContainer}>
                {product.prices.map((price) => (
                  <div
                    key={price.id}
                    className={`${styles.priceOption} ${
                      selectedPrice?.id === price.id ? styles.activePrice : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(product.id); // make sure the product is also selected
                      setSelectedPrice({
                        id: price.id,
                        amount: (price.unit_amount / 100).toFixed(2),
                        rawAmount: price.unit_amount,
                        currency: price.currency,
                        interval: price.interval,
                      });
                    }}
                  >
                    {(price.unit_amount / 100).toFixed(2)}{" "}
                    {price.currency.toUpperCase()} / {price.interval}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Continue button */}
        <div className={styles.bottomBtn}>
          <div
            className={styles.btnTheme}
            onClick={() => {
              if (selected) {
                if (selected === "free-trial") {
                  navigate("/signup");
                } else if (selectedPrice) {
                  navigate("/checkout", {
                    state: {
                      priceId: selectedPrice.id,
                      agentId: agentID,
                      locationPath1: locationPath,
                      price: selectedPrice.amount,
                      interval: selectedPrice.interval,
                    },
                  });
                } else {
                  alert(
                    "Please select a specific plan duration (monthly/yearly)"
                  );
                }
              } else {
                alert("Please select a plan first");
              }
            }}
          >
            <img src="svg/svg-theme.svg" alt="" />
            <p>Continue</p>
          </div>
        </div>

        {/* Login link */}
        {location.pathname === "/dashboard" ? (
          ""
        ) : (
          <div className={styles.loginBox}>
            <p>
              Already have an account?{" "}
              <span
                className={styles.loginLink}
                onClick={() => navigate("/signup")}
              >
                Login
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plan;
