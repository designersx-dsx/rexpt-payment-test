import React, { useState, useEffect } from "react";
import styles from "./Plan.module.css";
import { useNavigate } from "react-router-dom";
import Loader2 from "../Loader2/Loader2";
import Modal from '../Modal2/Modal2'
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Plan = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("free-trial");
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
    const [show  , setShow] = useState(false)
    const [close  , setClose] = useState(false)
    
    const handleCLose = ()=>{
        setClose(true)
        setShow(false)
    }
    const handleNaviagte =()=>{
    navigate('/signup')
}
  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => {
        // Map products to expected structure (with metadata)
        const productsWithMetadata = data.map((product) => {
          const matchedData = product.data?.data?.find((p) => p.id === product.id);
          return {
            ...product,
            metadata: matchedData?.metadata || {},
          };
        });
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

  // const handleContinue = () => {
  //   if (!selected) {
  //     alert("Please select a plan first");
  //     return;
  //   }
  //   if (selected === "free-trial") {
  //     navigate("/signup");
  //     return;
  //   }
  //   // Find selected product for price id
  //   const selectedProduct = products.find((p) => p.id === selected);
  //   if (selectedProduct && selectedProduct.prices.length > 0) {
  //     navigate("/checkout", { state: { priceId: selectedProduct.prices[0].id } });
  //   } else {
  //     alert("No price available for selected plan");
  //   }
  // };
const handleContinue = ()=>{
   setShow(true)
}
    if (loading) return <div className={styles.status}><Loader2 /></div>;
  if (error) return <p className={styles.statusError}>{error}</p>;

  return (
    <div className={styles.container}>
      {/* Header */}

       {show?  <Modal isOpen={show} onClose={handleCLose} ><></><h2 className={styles.apologyHead}>
                Comming Soon
                
                </h2>
                
                <p className={styles.apologyHeadText}apologyHeadText>

We apologise, But our paid plans are being tested to pass our "Rigorous QA Process" 
For now, If your sign-up for a "Free Account", We promise to send you Upgradation Options in your email within next 2 weeks. 
                </p>

                <div className={styles.zz}>

                {/* <button className={styles.closeBTN} onClick={handleNaviagte}>Continue with Free</button> */}

                </div>

                
                </Modal>
                
                : null}
      <div className={styles.header}>
        <div className={styles.icon}>
          <img src="images/inlogo.png" alt="inlogo" />
        </div>
        <div className={styles.headercontent}>
          <h3>Select Your Plan</h3>
          <p>Customizable payment structures</p>
        </div>
      </div>

      {/* Free Trial Plan */}
      {/* <div
        className={`${styles.planBox} ${selected === "free-trial" ? styles.selected : ""}`}
        onClick={() => setSelected("free-trial")}
      >
        <div className={styles.part1}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="plan"
              value="free-trial"
              checked={selected === "free-trial"}
              onChange={() => setSelected("free-trial")}
            />
            <div className={styles.planContent}>
              <div className={styles.planTitle}>
                <div>
                  <p>Free Trial</p>
                  <span className={styles.description}>
                    Try all features free — includes 10 minutes
                  </span>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div> */}

      {/* Dynamic Plans from API */}
      {products.map((product) => (
        <div
          key={product.id}
          className={`${styles.planBox} ${selected === product.id ? styles.selected : ""}`}
          onClick={() => setSelected(product.id)}
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
                    <span className={styles.description}>{product.description}</span>
                  </div>
                  {product.metadata.badge && (
                    <span className={styles.badge}>{product.metadata.badge}</span>
                  )}
                </div>
              </div>
            </label>
            <img
              src={open === product.id ? "/svg/up.svg" : "/svg/down.svg"}
              alt="Toggle Arrow"
              className={`${styles.arrowIcon} ${open === product.id ? styles.rotated : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleAccordion(product.id);
              }}
            />
          </div>

          <div className={`${styles.accordion} ${open === product.id ? styles.open : ""}`}>
            {product.metadata.minutes && (
              <p>
                Includes <strong>{product.metadata.minutes}</strong> minutes
              </p>
            )}
            <div className={styles.pricesContainer}>
              {product.prices.map((price) => (
                <div
                  key={price.id}
                  className={styles.priceOption}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/checkout", { state: { priceId: price.id } });
                  }}
                >
                  {(price.unit_amount / 100).toFixed(2)} {price.currency.toUpperCase()} / {price.interval}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Continue button */}
      <div className={styles.btnTheme} onClick={handleContinue}>
        <img src="svg/svg-theme.svg" alt="" />
        <p>Continue</p>
      </div>

      {/* Login link */}
      {/* <div className={styles.loginBox}>
        <p>
          Already have an account?{" "}
          <span className={styles.loginLink} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div> */}
    </div>
  );
};

export default Plan;
