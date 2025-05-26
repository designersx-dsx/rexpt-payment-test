import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import styles from '../Step3/Step3.module.css';
import Slider from 'react-slick';


const avatars = [
  { img: 'images/avtar1.png' },
  { img: 'images/avtar2.png' },
  { img: 'images/avtar3.png' },
  { img: 'images/avtar4.png' },
   { img: 'images/avtar5.png' },
];

const Step3 = forwardRef(({ onNext, onBack, onValidationError }, ref) => {
  const sliderRef = useRef(null);
  const [agentName, setAganentName] = useState('');
  const [avatar, setAvatar] = useState(null)
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, 
  };

  useEffect(() => {
    sessionStorage.setItem("agentName", agentName);
  }, [agentName])

  const handleAvatarChange = (avatar) => {
    setAvatar(avatar?.img)
    sessionStorage.setItem("avatar", avatar.img);
  }
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!agentName.trim()) {
        onValidationError?.({
          type: "failed",
          message: "Please enter agent name!"
        });

        return false;
      }
      if (!avatar) {
        onValidationError?.({
          type: "failed",
          message: "Please select an avatar!"
        });
        return false;
      }
      return true;
    },
  }));
  return (
    <>
   
       <div className={styles.agentInputBox}>
          <label className={styles.agentLabel}>Name Your Virtual Agent</label>
          <input
            type="text"
            name="agentName"
            onChange={(e) => setAganentName(e.target.value)}
            className={styles.agentInput}
            placeholder="Ex- Smith, Nova"
          />
        </div>
      <div className={styles.sliderContainer}>
       
        <h2 className={styles.heading}>Choose Avatar</h2>

        <Slider ref={sliderRef} {...settings}>
          {avatars.map((avatar, index) => (
            <div key={index} className={styles.slide}>
              <input
                type="radio"
                name="avatar"
                value={index}
                onChange={() => handleAvatarChange(avatar)}
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
          <div className={styles.arrowRight} onClick={() => {
            sliderRef.current.slickNext()
          }}>
            <img src="images/sliderright.png" alt="Next" />
          </div>
        </div>

      </div>
    </>

  );
});

export default Step3;
