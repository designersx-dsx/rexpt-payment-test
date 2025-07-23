import React, { useState } from 'react'
import styles from '../HelpSupport/HelpSupport.module.css'
import { useNavigate } from 'react-router-dom';

const HelpSupport = () => {
    const navigate = useNavigate();
    const handleCardClick = (type) => {
        if (type === 'agent-setup') {
            navigate('/agent-setup');
        }
        if (type === 'documentation') {
            navigate('/documentation');
        }
        if(type === 'raise-tickets') {
            navigate('/raise-tickets');
        }
    };

    const cursor = {
        cursor: 'no-drop',
        opacity: 0.6,
    };
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Help & Support</h3>
                <p>Rexpt AI Support Agent</p>
            </div>

            <div className={styles.card} onClick={() => handleCardClick('agent-setup')}>
                <img src="/svg/agent-setup.svg" alt="Agent" />
                <span>AGENT SETUP HELP</span>
                <span className={styles.arrow}>
                    <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.251051 21.7522C-0.0836838 21.4217 -0.0836838 20.886 0.251051 20.5555L9.93067 11L0.25105 1.44448C-0.0836847 1.11403 -0.0836847 0.578277 0.25105 0.247832C0.585785 -0.0826115 1.1285 -0.0826115 1.46323 0.247832L11.7489 10.4017C12.0837 10.7321 12.0837 11.2679 11.7489 11.5983L1.46323 21.7522C1.1285 22.0826 0.585786 22.0826 0.251051 21.7522Z" fill="#5F33E1" />
                    </svg>

                </span>
            </div>
            <div className={styles.card} onClick={() => handleCardClick('raise-tickets')}>
                <img src="/svg/Support-ticket.svg" alt="Agent" />
                <span>CREATE SUPPORT TICKET</span>
                <span className={styles.arrow}>
                    <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.251051 21.7522C-0.0836838 21.4217 -0.0836838 20.886 0.251051 20.5555L9.93067 11L0.25105 1.44448C-0.0836847 1.11403 -0.0836847 0.578277 0.25105 0.247832C0.585785 -0.0826115 1.1285 -0.0826115 1.46323 0.247832L11.7489 10.4017C12.0837 10.7321 12.0837 11.2679 11.7489 11.5983L1.46323 21.7522C1.1285 22.0826 0.585786 22.0826 0.251051 21.7522Z" fill="#5F33E1" />
                    </svg>

                </span>
            </div>
            <div className={styles.card} onClick={() => handleCardClick('documentation')}>
                <img src="/svg/document.svg" alt="Agent" />
                <span>DOCUMENTATION</span>
                <span className={styles.arrow}>
                    <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.251051 21.7522C-0.0836838 21.4217 -0.0836838 20.886 0.251051 20.5555L9.93067 11L0.25105 1.44448C-0.0836847 1.11403 -0.0836847 0.578277 0.25105 0.247832C0.585785 -0.0826115 1.1285 -0.0826115 1.46323 0.247832L11.7489 10.4017C12.0837 10.7321 12.0837 11.2679 11.7489 11.5983L1.46323 21.7522C1.1285 22.0826 0.585786 22.0826 0.251051 21.7522Z" fill="#5F33E1" />
                    </svg>

                </span>
            </div>

            <div className={styles.card} onClick={()=>window.open('https://www.rexpt.in/FAQ', '_blank')}>
                <img src="/svg/Faq.svg" alt="Agent" />
                <span>FAQ</span>
                <span className={styles.arrow}>
                    <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.251051 21.7522C-0.0836838 21.4217 -0.0836838 20.886 0.251051 20.5555L9.93067 11L0.25105 1.44448C-0.0836847 1.11403 -0.0836847 0.578277 0.25105 0.247832C0.585785 -0.0826115 1.1285 -0.0826115 1.46323 0.247832L11.7489 10.4017C12.0837 10.7321 12.0837 11.2679 11.7489 11.5983L1.46323 21.7522C1.1285 22.0826 0.585786 22.0826 0.251051 21.7522Z" fill="#5F33E1" />
                    </svg>
                </span>
            </div>
        </div>
    )
}

export default HelpSupport
