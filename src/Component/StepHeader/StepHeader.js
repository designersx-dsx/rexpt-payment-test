import React from 'react'
import styles from '../StepHeader/StepHeader.module.css'

const StepHeader = ({ title }) => {
    return (
        <div className={styles.LogoDiv}>
            <div className={styles.logo}>
                <svg
                       className={styles.svgSpin}
                    width="283"
                    height="283"
                    viewBox="0 0 283 283"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g filter="url(#filter0_g_119_245)">
                        <circle
                            cx="141.5"
                            cy="141.5"
                            r="121.5"
                            fill="url(#paint0_linear_119_245)"
                           className={styles.aiGlow}
                        />
                    </g>
                    <circle cx="141.5" cy="141.5" r="101.504" fill="url(#paint1_linear_119_245)" stroke="white" />
                    <circle cx="141.5" cy="141.5" r="84.0974" fill="#FBFAFE" stroke="#F3EFFE" />
                    <circle cx="141.5" cy="141.5" r="69.2794" fill="url(#paint2_linear_119_245)" />
                    <defs>
                        <filter id="filter0_g_119_245" x="0" y="0" width="283" height="283" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feTurbulence type="fractalNoise" baseFrequency="0.2 0.2" numOctaves="3" seed="4818" />
                            <feDisplacementMap in="shape" scale="40" xChannelSelector="R" yChannelSelector="G" result="displacedImage" />
                            <feMerge>
                                <feMergeNode in="displacedImage" />
                            </feMerge>
                        </filter>
                        <linearGradient id="paint0_linear_119_245" x1="141.5" y1="20" x2="141.5" y2="263" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#EDE4FF" stopOpacity="0.5" />
                            <stop offset="1" stopColor="#E2FDEC" stopOpacity="0.5" />
                        </linearGradient>
                        <linearGradient id="paint1_linear_119_245" x1="141.5" y1="39.4956" x2="141.5" y2="243.504" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#EDE4FF" stopOpacity="0.28" />
                            <stop offset="1" stopColor="#F2FAFE" stopOpacity="0.28" />
                        </linearGradient>
                        <linearGradient id="paint2_linear_119_245" x1="141.5" y1="72.2207" x2="141.5" y2="210.779" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#EDE4FF" />
                            <stop offset="0.25" stopColor="#DFE6FF" />
                            <stop offset="0.48" stopColor="#FCFCDD" />
                            <stop offset="0.77" stopColor="#DEFCE9" />
                            <stop offset="1" stopColor="#EDE4FF" />
                        </linearGradient>
                    </defs>
                </svg>
                <img src="/images/inlogo.png" alt="inlogo" className={styles.inlogo} />
            </div>
            <h2 className={styles.heading}>{title}</h2>
        </div>
    )
}

export default StepHeader
