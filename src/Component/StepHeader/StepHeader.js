import React, { useState, useEffect } from 'react'
import styles from '../StepHeader/StepHeader.module.css'
import Loader2 from '../Loader2/Loader2';
const StepHeader = ({ title }) => {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            let newScale = 1 - Math.min(scrollY / 400, 0.3);
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
                <div className={styles.RipplThree}>
                    <span className={styles.ripple}></span>
                    <span className={styles.ripple}></span>
                    <span className={styles.ripple}></span>
                </div>
                <div className={styles.logo}>
                    <svg width="205" height="205" viewBox="0 0 205 205" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="102.496" cy="102.496" r="101.504" fill="url(#paint0_linear_325_109)" stroke="white" />
                        <circle cx="102.496" cy="102.504" r="84.0974" fill="#FBFAFE" stroke="" />
                        <circle cx="102.498" cy="102.498" r="69.2794" fill="url(#paint1_linear_325_109)" />
                        <path d="M61.7656 67.7298C61.7656 63.4996 65.1949 60.0703 69.4251 60.0703H135.078C139.308 60.0703 142.738 63.4996 142.738 67.7298V129.495C142.738 133.725 139.308 137.154 135.078 137.154H110.156C108.321 137.154 106.548 137.813 105.158 139.01L89.5885 152.418C84.5281 156.776 76.8443 152.128 78.355 145.623V145.623C79.3606 141.293 76.0732 137.154 71.6281 137.154H69.4251C65.1949 137.154 61.7656 133.725 61.7656 129.495V67.7298Z" fill="#6524EB" />
                        <path d="M95.6875 111.501V73.785H102.616C103.314 73.785 103.891 73.9426 104.348 74.2579C104.829 74.5731 105.166 75.0459 105.359 75.6763L106.008 77.8585C106.73 77.1796 107.476 76.5492 108.245 75.9672C109.015 75.3853 109.833 74.9004 110.699 74.5124C111.589 74.1003 112.54 73.785 113.55 73.5668C114.584 73.3244 115.703 73.2031 116.906 73.2031C118.951 73.2031 120.755 73.5668 122.319 74.2942C123.907 74.9974 125.242 75.9915 126.324 77.2766C127.407 78.5374 128.225 80.0528 128.778 81.8228C129.332 83.5686 129.608 85.4719 129.608 87.5329V111.501H118.422V87.5329C118.422 85.6901 118.001 84.2596 117.159 83.2412C116.317 82.1986 115.078 81.6773 113.442 81.6773C112.215 81.6773 111.06 81.944 109.977 82.4775C108.895 83.0109 107.86 83.7262 106.874 84.6233V111.501H95.6875Z" fill="white" />
                        <path d="M89.1223 74.2969V111.5H77.0859V74.2969H89.1223Z" fill="white" />
                        <path d="M86.9334 123.541C86.9334 125.958 84.9738 127.918 82.5565 127.918C80.1393 127.918 78.1797 125.958 78.1797 123.541C78.1797 121.124 80.1393 119.164 82.5565 119.164C84.9738 119.164 86.9334 121.124 86.9334 123.541Z" fill="white" />
                        <path d="M89.1223 62.8072C89.1223 66.131 86.4279 68.8254 83.1041 68.8254C79.7804 68.8254 77.0859 66.131 77.0859 62.8072C77.0859 59.4835 79.7804 56.7891 83.1041 56.7891C86.4279 56.7891 89.1223 59.4835 89.1223 62.8072Z" fill="#FAFAFA" />
                        <path d="M89.1246 62.8096C89.1246 59.4858 86.4302 56.7914 83.1064 56.7914C79.7827 56.7914 77.0883 59.4858 77.0883 62.8096C77.0883 66.1333 79.7827 68.8278 83.1064 68.8278C86.4302 68.8278 89.1246 66.1333 89.1246 62.8096ZM94.5957 62.8096C94.5957 69.1549 89.4518 74.2988 83.1064 74.2988C76.7611 74.2988 71.6172 69.1549 71.6172 62.8096C71.6172 56.4642 76.7611 51.3203 83.1064 51.3203C89.4518 51.3203 94.5957 56.4642 94.5957 62.8096Z" fill="#6A30E2" />
                        <path d="M106.082 123.541C106.082 125.958 104.122 127.918 101.705 127.918C99.2877 127.918 97.3281 125.958 97.3281 123.541C97.3281 121.124 99.2877 119.164 101.705 119.164C104.122 119.164 106.082 121.124 106.082 123.541Z" fill="white" />
                        <path d="M128.512 123.541C128.512 125.958 126.552 127.918 124.135 127.918C121.717 127.918 119.758 125.958 119.758 123.541C119.758 121.124 121.717 119.164 124.135 119.164C126.552 119.164 128.512 121.124 128.512 123.541Z" fill="white" />
                        <defs>
                            <linearGradient id="paint0_linear_325_109" x1="102.496" y1="0.492187" x2="102.496" y2="204.501" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#EDE4FF" stop-opacity="0.28" />
                                <stop offset="1" stop-color="#F2FAFE" stop-opacity="0.28" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_325_109" x1="102.498" y1="33.2188" x2="102.498" y2="171.777" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#EDE4FF" />
                                <stop offset="0.255818" stop-color="#DFE6FF" />
                                <stop offset="0.481036" stop-color="#FCFCDD" />
                                <stop offset="0.771639" stop-color="#DEFCE9" />
                                <stop offset="1" stop-color="#EDE4FF" />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* heloo */}
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
