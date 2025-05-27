import React, { useState, useEffect } from 'react';
import styles from '../Start/Start.module.css';
import { useNavigate } from 'react-router-dom';

function Start() {
    const navigate = useNavigate();

    // Track animation steps: 0 = nothing, 1 = button fade, 2 = part fade, 3 = logo fade
    const [animationStep, setAnimationStep] = useState(0);

    useEffect(() => {
        if (animationStep === 1) {
            // After button fades (800ms), start part fade
            const timer = setTimeout(() => setAnimationStep(2), 800);
            return () => clearTimeout(timer);
        }
        if (animationStep === 2) {
            // After part fades (800ms), start logo fade
            const timer = setTimeout(() => setAnimationStep(3), 800);
            return () => clearTimeout(timer);
        }
        if (animationStep === 3) {
            // After logo fades (800ms), navigate
            const timer = setTimeout(() => navigate('/signup'), 800);
            return () => clearTimeout(timer);
        }
    }, [animationStep, navigate]);

    const handleClick = () => {
        if (animationStep === 0) setAnimationStep(1);
    };

    return (
        <div>
            <div className={styles.StartMain}>
                <div>
                    {/* floating ellipses */}
                    <img src='images/Ellipse 1.png' alt='Ellipse 1' />
                    <img src='images/Ellipse 2.png' alt='Ellipse 2' />
                    <img src='images/Ellipse 5.png' alt='Ellipse 5' />
                    <img src='images/Ellipse 3.png' alt='Ellipse 3' />
                    <img src='images/Ellipse 4.png' alt='Ellipse 4' />
                    <img src='images/Ellipse 6.png' alt='Ellipse 6' />
                    <img src='images/Ellipse 7.png' alt='Ellipse 7' />
                    <img src='images/Ellipse 8.png' alt='Ellipse 8' />
                    <img src='images/Ellipse 9.png' alt='Ellipse 9' />
                    <img src='images/Ellipse 10.png' alt='Ellipse 10' />
                    <img src='images/Ellipse 11.png' alt='Ellipse 11' />
                </div>
            </div>

            <div className={styles.content}>
                <div className={`${styles.LogoDiv} ${animationStep >= 3 ? styles.fadeOutLogo : ''}`}>
                    <img src='images/Rexpt-Logo.png' alt='Rexpt-Logo' />
                </div>

                <div className={`${styles.part} ${animationStep >= 2 ? styles.fadeOutPart : ''}`}>
                    <p className={styles.heading}>Launch Your <b>AI Receptionist</b></p>
                    <div className={styles.withlogo}>
                        <p className={styles.with}>with</p>
                        <p><img src='images/Rexpt-Logo.png' alt='Rexpt-Logo' /></p>
                    </div>
                    <p className={styles.desc}>
                        Engage leads by voice, automate bookings & reminders, and unlock actionable call analytics—powered by Rexpt.in.
                    </p>
                </div>

                <div
                    className={`${styles.BtnDiv} ${animationStep >= 1 ? styles.fadeOutButton : ''}`}
                    onClick={handleClick}
                >
                    <img src='images/start-btn.png' alt='Start Button' />
                </div>
            </div>
        </div>
    );
}

export default Start;
