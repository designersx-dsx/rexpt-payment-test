import React, { useRef, useState } from 'react';
import Slider from 'react-slick';
import styles from './Step.module.css';
import Step2 from '../Step2/Step2';
import Step3 from '../Step3/Step3';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Step = () => {
    const sliderRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedLang, setSelectedLang] = useState('');

    const languages = [
        { name: 'English', flag: '/images/english-flag.png', percentage: '28%', stats: '23/88' },
        { name: 'Spanish', flag: '/images/spanish.png', percentage: '56%', stats: '23/88' },
        { name: 'German', flag: '/images/german.png', percentage: '28%', stats: '23/88' },
        { name: 'Italian', flag: '/images/Italian.png', percentage: '56%', stats: '23/88' },
        { name: 'German', flag: '/images/german.png', percentage: '28%', stats: '23/88' },
        { name: 'Italian', flag: '/images/Italian.png', percentage: '56%', stats: '23/88' },
    ];

    const handleNext = () => {
        if (currentStep < 2) {
            sliderRef.current.slickNext();
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            sliderRef.current.slickPrev();
            setCurrentStep(prev => prev - 1);
        }
    };

    const renderDots = () => (
        <div className={styles.dotsContainer}>
            {[0, 1, 2].map(step => (
                <span
                    key={step}
                    className={`${styles.dot} ${currentStep === step ? styles.activeDot : ''}`}
                />
            ))}
        </div>
    );

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        swipe: false,
    };

    return (
        <div className={styles.container}>
            <Slider ref={sliderRef} {...settings}>
                {/* Step 1 */}
                <div>
                    <div className={styles.slideContent}>
                        <div className={styles.LogoDiv}>
                            <div className={styles.logo}>
                                <img src="/images/stepmask.png" alt="stepmask" />
                                <img src="/images/inlogo.png" alt="inlogo" className={styles.inlogo} />
                            </div>
                            <h2 className={styles.heading}>Agent Language <br /> Supported</h2>
                        </div>

                        <div className={styles.grid}>
                            {languages.map((lang, index) => (
                                <label
                                    key={index}
                                    className={`${styles.card} ${selectedLang === lang.name ? styles.active : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="language"
                                        value={lang.name}
                                        checked={selectedLang === lang.name}
                                        onChange={() => setSelectedLang(lang.name)}
                                        className={styles.radioInput}
                                    />
                                    <img src={lang.flag} alt={lang.name} className={styles.flag} />
                                    <p className={styles.langName}>{lang.name}</p>
                                    <p className={styles.stats}>{lang.percentage} · {lang.stats}</p>
                                    {selectedLang === lang.name && <span className={styles.langDot}></span>}
                                </label>
                            ))}
                        </div>


                        {renderDots()}

                        <div className={styles.footer}>
                            <div className={styles.nextBtn} onClick={handleNext}>
                                <img src="/images/nextBtn.png" alt="Next" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div>
                    <div className={styles.slideContent}>
                        <div className={styles.LogoDiv}>
                            <div className={styles.logo}>
                                <img src="/images/stepmask.png" alt="stepmask" />
                            </div>
                            <h2 className={styles.heading}>Agent Gender</h2>
                        </div>

                        <div className={styles.grid}>
                            <Step2 onNext={handleNext} onBack={handleBack} />
                        </div>

                        {renderDots()}

                        <div className={styles.footer}>
                            <div className={styles.backBtn} onClick={handleBack}>
                                <img src="/images/backBtn.png" alt="Back" />
                            </div>
                            <div className={styles.nextBtn} onClick={handleNext}>
                                <img src="/images/nextBtn.png" alt="Next" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div>
                    <div className={styles.slideContent}>
                        <div className={styles.LogoDiv}>
                            <div className={styles.logo}>
                                <img src="/images/stepmask.png" alt="stepmask" />
                            </div>

                            <h2 className={styles.heading}>Final Confirmation</h2>
                        </div>

                        <div className={styles.grid}>
                            <Step3 onNext={handleNext} onBack={handleBack} />
                        </div>

                        {renderDots()}

                        <div className={styles.footer}>
                            <div className={styles.backBtn} onClick={handleBack}>
                                <img src="/images/backBtn.png" alt="Back" />
                            </div>
                            <div className={styles.nextBtn}>
                                <img src="/images/nextBtn.png" alt="Next" />
                            </div>
                        </div>
                    </div>
                </div>
            </Slider>
        </div>
    );
};

export default Step;
