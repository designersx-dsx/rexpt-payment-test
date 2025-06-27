import React, { useState, useEffect } from 'react';
import styles from '../Plan/Plan.module.css';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import Modal from '../Modal2/Modal2';
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Plan = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(null);
    const [show, setShow] = useState(false);
    const [landingPageSelection,setLandingPageSelection]=useState(sessionStorage.getItem('selectedPlan')||"")

    const navigate = useNavigate();

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        fetch(`${API_BASE}/products`)
            .then(res => res.json())
            .then(data => {
                const productsWithMetadata = data.map(product => {
                    const matchedData = product.data?.data?.find(p => p.id === product.id);
                    return {
                        ...product,
                        metadata: matchedData?.metadata || {},
                    };
                });
                setProducts(productsWithMetadata);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load plans.');
                setLoading(false);
            });
    }, []);

    const toggleAccordion = (id) => {
        setOpen(open === id ? null : id);
    };

    const handleContinue = () => {
        if (selected === 'free-trial') {
            navigate('/signup');
        } else {
            setShow(true); 
        }
    };

       useEffect(()=>{
            if (landingPageSelection && products) {

            const selectedPlan = products.find(
            (plan) => plan?.name?.toLowerCase()?.trim() === landingPageSelection?.toLowerCase()?.trim()
            );

            if (selectedPlan) {
            setSelected(selectedPlan.id)
            // You can store or use selectedPlan.id here
            }
        }
    },[landingPageSelection,products])


    if (loading) return <p className={styles.status}><Loader /></p>;
    if (error) return <p className={styles.statusError}>{error}</p>;

    return (
        <>
            <div className={styles.hero_sec}>
                {show && (
                    <Modal isOpen={show} onClose={handleClose}>
                        <h2 className={styles.apologyHead}>Coming Soon</h2>
                        <p className={styles.apologyHeadText}>
                            We apologise, But our paid plans are being tested to pass our "Rigorous QA Process"
                            For now, If your sign-up for a "Free Account", We promise to send you Upgradation Options in your email within next 2 weeks.
                        </p>
                        <div className={styles.zz}>
                            <button className={styles.closeBTN} onClick={() => navigate('/signup')}>Sign-up for FREE</button>
                        </div>
                    </Modal>
                )}

                <div className={styles.container}>
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

                    {/* Free Trial Plan */}
                    <div
                        className={`${styles.planBox} ${selected === 'free-trial' ? styles.selected : ''}`}
                        onClick={() => setSelected('free-trial')}
                    >
                        <div className={styles.part1}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="plan"
                                    value="free-trial"
                                    checked={selected === 'free-trial'}
                                    onChange={() => setSelected('free-trial')}
                                />
                                <div className={styles.planContent}>
                                    <div className={styles.planTitle}>
                                        <div>
                                            <p>Free Trial</p>
                                            <span className={styles.description}>
                                                Try all features free — includes 20 minutes
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Paid Plans */}
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className={`${styles.planBox} ${selected === product.id ? styles.selected : ''}`}
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
                                    src={open === product.id ? '/svg/up.svg' : '/svg/down.svg'}
                                    alt="Toggle Arrow"
                                    className={`${styles.arrowIcon} ${open === product.id ? styles.rotated : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAccordion(product.id);
                                    }}
                                />
                            </div>

                            <div className={`${styles.accordion} ${open === product.id ? styles.open : ''}`}>
                                {product.metadata.minutes && (
                                    <p>Includes <strong>{product.metadata.minutes}</strong> minutes</p>
                                )}
                                <div className={styles.pricesContainer}>
                                    {product.prices.map(price => (
                                        <div key={price.id} className={styles.priceOption}>
                                            {(price.unit_amount / 100).toFixed(2)} {price.currency.toUpperCase()} / {price.interval}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Continue Button */}
                    <div className={styles.btnTheme} onClick={handleContinue}>
                        <img src='svg/svg-theme.svg' alt='' />
                        <p>Continue</p>
                    </div>

                    {/* Login Link */}
                    <div className={styles.loginBox}>
                        <p>
                            Already have an account?{' '}
                            <span className={styles.loginLink} onClick={() => navigate('/signup')}>
                                Login
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Plan;
