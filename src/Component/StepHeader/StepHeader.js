import React, { useState, useEffect } from 'react'
import styles from '../StepHeader/StepHeader.module.css'
import Loader2 from '../Loader2/Loader2';
const StepHeader = ({ title }) => {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            let newScale = 1 - Math.min(scrollY / 400, 0.3); // scale 1 to 0.7
            if (newScale < 0.7) newScale = 0.7;
            setScale(newScale);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <div className={styles.LogoDiv} style={{ textAlign: 'center' }}>

            <div
                className={styles.LogoWrapper}
                style={{
                    position: 'sticky',
                    top: '10px',
                    transform: `scale(${scale})`,
                    transition: 'transform 0.3s ease-out',
                    transformOrigin: 'center center',
                    margin: '0 auto',
                    display: 'inline-block',
                    zIndex: 10,
                }}
            >
                <div className={styles.pulseRing}></div>
                <div className={styles.logo}>
                    <svg width="283" height="283" viewBox="0 0 283 283" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_g_268_20416)">
                            <circle cx="141.5" cy="141.5" r="121.5" fill="url(#paint0_linear_268_20416)" />
                        </g>
                        <circle cx="141.496" cy="141.496" r="101.504" fill="url(#paint1_linear_268_20416)" stroke="white" />
                        <circle cx="141.496" cy="141.504" r="84.0974" fill="#FBFAFE" stroke="#F3EFFE" />
                        <circle cx="141.498" cy="141.498" r="69.2794" fill="url(#paint2_linear_268_20416)" />
                        <path d="M100.766 106.73C100.766 102.5 104.195 99.0703 108.425 99.0703H174.078C178.308 99.0703 181.738 102.5 181.738 106.73V168.495C181.738 172.725 178.308 176.154 174.078 176.154H149.156C147.321 176.154 145.548 176.813 144.158 178.01L128.588 191.418C123.528 195.776 115.844 191.128 117.355 184.623C118.361 180.293 115.073 176.154 110.628 176.154H108.425C104.195 176.154 100.766 172.725 100.766 168.495V106.73Z" fill="#6524EB" />
                        <path d="M134.688 150.501V112.785H141.616C142.314 112.785 142.891 112.943 143.348 113.258C143.829 113.573 144.166 114.046 144.359 114.676L145.008 116.858C145.73 116.18 146.476 115.549 147.245 114.967C148.015 114.385 148.833 113.9 149.699 113.512C150.589 113.1 151.54 112.785 152.55 112.567C153.584 112.324 154.703 112.203 155.906 112.203C157.951 112.203 159.755 112.567 161.319 113.294C162.907 113.997 164.242 114.991 165.324 116.277C166.407 117.537 167.225 119.053 167.778 120.823C168.332 122.569 168.608 124.472 168.608 126.533V150.501H157.422V126.533C157.422 124.69 157.001 123.26 156.159 122.241C155.317 121.199 154.078 120.677 152.442 120.677C151.215 120.677 150.06 120.944 148.977 121.477C147.895 122.011 146.86 122.726 145.874 123.623V150.501H134.688Z" fill="white" />
                        <path d="M128.122 113.297V150.5H116.086V113.297H128.122Z" fill="white" />
                        <path d="M125.933 162.541C125.933 164.958 123.974 166.918 121.557 166.918C119.139 166.918 117.18 164.958 117.18 162.541C117.18 160.124 119.139 158.164 121.557 158.164C123.974 158.164 125.933 160.124 125.933 162.541Z" fill="white" />
                        <path d="M128.122 101.807C128.122 105.131 125.428 107.825 122.104 107.825C118.78 107.825 116.086 105.131 116.086 101.807C116.086 98.4835 118.78 95.7891 122.104 95.7891C125.428 95.7891 128.122 98.4835 128.122 101.807Z" fill="#FAFAFA" />
                        <path d="M128.125 101.81C128.125 98.4858 125.43 95.7914 122.106 95.7914C118.783 95.7914 116.088 98.4858 116.088 101.81C116.088 105.133 118.783 107.828 122.106 107.828C125.43 107.828 128.125 105.133 128.125 101.81ZM133.596 101.81C133.596 108.155 128.452 113.299 122.106 113.299C115.761 113.299 110.617 108.155 110.617 101.81C110.617 95.4642 115.761 90.3203 122.106 90.3203C128.452 90.3203 133.596 95.4642 133.596 101.81Z" fill="#6A30E2" />
                        <path d="M145.082 162.541C145.082 164.958 143.122 166.918 140.705 166.918C138.288 166.918 136.328 164.958 136.328 162.541C136.328 160.124 138.288 158.164 140.705 158.164C143.122 158.164 145.082 160.124 145.082 162.541Z" fill="white" />
                        <path d="M167.512 162.541C167.512 164.958 165.552 166.918 163.135 166.918C160.717 166.918 158.758 164.958 158.758 162.541C158.758 160.124 160.717 158.164 163.135 158.164C165.552 158.164 167.512 160.124 167.512 162.541Z" fill="white" />
                        <defs>
                            <filter id="filter0_g_268_20416" x="0" y="0" width="283" height="283" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feTurbulence type="fractalNoise" baseFrequency="0.20000000298023224 0.20000000298023224" numOctaves="3" seed="4818" />
                                <feDisplacementMap in="shape" scale="40" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                                <feMerge result="effect1_texture_268_20416">
                                    <feMergeNode in="displacedImage" />
                                </feMerge>
                            </filter>
                            <linearGradient id="paint0_linear_268_20416" x1="141.5" y1="20" x2="141.5" y2="263" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#EDE4FF" stop-opacity="0.5" />
                                <stop offset="1" stop-color="#E2FDEC" stop-opacity="0.5" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_268_20416" x1="141.496" y1="39.4922" x2="141.496" y2="243.501" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#EDE4FF" stop-opacity="0.28" />
                                <stop offset="1" stop-color="#F2FAFE" stop-opacity="0.28" />
                            </linearGradient>
                            <linearGradient id="paint2_linear_268_20416" x1="141.498" y1="72.2187" x2="141.498" y2="210.777" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#EDE4FF" />
                                <stop offset="0.255818" stop-color="#DFE6FF" />
                                <stop offset="0.481036" stop-color="#FCFCDD" />
                                <stop offset="0.771639" stop-color="#DEFCE9" />
                                <stop offset="1" stop-color="#EDE4FF" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
            <h2 className={styles.heading} style={{
                transform: `scale(${scale})`,
                transition: 'transform 0.3s ease-out',
                transformOrigin: 'center center',
                marginTop: '1rem',
                fontSize: `${scale * 2.5}rem`,
            }}>{title}</h2>
        </div>
    )
}

export default StepHeader
