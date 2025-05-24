import React from 'react'
import styles from '../Step3/Step3.module.css'
import Slider from 'react-slick';

const avatars = [
  { img: 'images/avtar1.png' },
  { img: 'images/avtar1.png' },
  { img: 'images/avtar1.png' },
];

const NextArrow = ({ onClick }) => (
  <div className={styles.arrowRight} onClick={onClick}>
    <img src='images/sliderRight.png' alt="Previous" />

  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className={styles.arrowLeft} onClick={onClick}>
        <img src='images/sliderleft.png' alt="Next" />
  </div>
);
const Step3 = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
   <div className={styles.sliderContainer}>
      <h2 className={styles.heading}>Choose Avtar</h2>
      <Slider {...settings}>
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
    </div>
  )
}

export default Step3
