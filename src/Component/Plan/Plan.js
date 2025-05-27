import React, { useState } from 'react';
import styles from './Plan.module.css';

const plans = [
    { id: 'mini', title: 'MINI PLAN', desc: 'Light use' },
    { id: 'pro', title: 'PRO PLAN', desc: 'Daily use', badge: 'MOST VALUE' },
    { id: 'max', title: 'MAX PLAN', desc: 'Full power' },
];

const Plan = () => {
    const [selected, setSelected] = useState('pro');
    const [open, setOpen] = useState(null);

    const toggleAccordion = (id) => {
        setOpen(open === id ? null : id);
    };

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

            {plans.map((plan) => (
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
                                onChange={() => setSelected(plan.id)}
                            />
                            <div className={styles.planContent}>
                                <div className={styles.planTitle}>
                                    <div>
                                        <p>{plan.title}</p>
                                        <span className={styles.description}>{plan.desc}</span>
                                    </div>
                                    {plan.badge && <span className={styles.badge}>{plan.badge}</span>}
                                </div>
                            </div>
                        </label>

                        <img
                            src={open === plan.id ? '/svg/up.svg' : '/svg/down.svg'}
                            alt="Toggle Arrow"
                            className={`${styles.arrowIcon} ${open === plan.id ? styles.rotated : ''}`}
                            onClick={() => toggleAccordion(plan.id)}
                        />
                    </div>

                    <div className={`${styles.accordion} ${open === plan.id ? styles.open : ''}`}>
                        <p>This is additional content for {plan.title.toLowerCase()}.</p>
                    </div>
                </div>
            ))}

            <div className={styles.btnTheme}>
                <img src='images/svg-theme.svg' alt='' />
                <p>Continue</p>
            </div>
        </div>
    );
};

export default Plan;
