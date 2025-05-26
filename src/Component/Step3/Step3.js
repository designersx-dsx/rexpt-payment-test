import React, { useRef } from 'react';
import styles from '../Step3/Step3.module.css';
import Slider from 'react-slick';

const avatars = [
  { img: 'images/avtar1.png' },
  { img: 'images/avtar2.png' },
  { img: 'images/avtar3.png' },
  { img: 'images/avtar4.png' },
];

const Step3 = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // hide default arrows since we use custom ones
  };

  return (
    <div className={styles.sliderContainer}>
      <h2 className={styles.heading}>Choose Avatar</h2>

      <Slider ref={sliderRef} {...settings}>
        {avatars.map((avatar, index) => (
          <div key={index} className={styles.slide}>
            <input
              type="radio"
              name="avatar"
              value={index}
              className={styles.radioButton}
            />
            <img
              src={avatar.img}
              alt={`Avatar ${index + 1}`}
              className={styles.avatarImage}
            />
          </div>
        ))}
      </Slider>

      <div className={styles.customBtn}>
        <div className={styles.arrowLeft} onClick={() => sliderRef.current.slickPrev()}>
          <img src="images/sliderleft.png" alt="Previous" />
        </div>
        <div className={styles.arrowRight} onClick={() => sliderRef.current.slickNext()}>
          <img src="images/sliderright.png" alt="Next" />
        </div>
      </div>
    </div>
  );
};

export default Step3;
