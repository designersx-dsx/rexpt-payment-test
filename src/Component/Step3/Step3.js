import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import styles from '../Step3/Step3.module.css';
import Slider from 'react-slick';

// const avatars = [
//   { img: 'images/avtar1.png' },
//   { img: 'images/avtar2.png' },
//   { img: 'images/avtar3.png' },
//   { img: 'images/avtar4.png' },
//   { img: 'images/avtar5.png' },
// ];

const avatars = {
  Male: [
    { img: 'images/Male-01.png' },
    { img: 'images/Male-02.png' },
    { img: 'images/Male-03.png' },
    { img: 'images/Male-04.png' },
    { img: 'images/Male-05.png' },

  ],
  Female: [
    { img: 'images/Female-01.png' },
    { img: 'images/Female-02.png' },
    { img: 'images/Female-03.png' },
    { img: 'images/Female-04.png' },
    { img: 'images/Female-05.png' },
    { img: 'images/Female-06.png' },

  ],
}
const Step3 = forwardRef(({ onNext, onBack, onValidationError }, ref) => {
  const sliderRef = useRef(null);
  const [agentName, setAgentName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [agentNameError, setAgentNameError] = useState('');
  const [scale, setScale] = useState(1);
  const [gender, setGender] = useState(''); // default
  const [availableAvatars, setAvailableAvatars] = useState(avatars['male']);
  const agentGender = sessionStorage.getItem('agentGender')
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleAvatarChange = (avatar) => {
    // agar current select yehi avatar hai, deselect kar do, warna select karo
    setSelectedAvatar((prev) => (prev === avatar ? null : avatar));
       

    setAvatar(avatar.img);
    sessionStorage.setItem('avatar', avatar.img);
    // console.log(avatar.img)
  };
  //  console.log('avatar',selectedAvatar)
  useEffect(() => {
    if (agentGender && avatars[agentGender]) {
      const genderAvatars = avatars[agentGender];
      const firstAvatar = genderAvatars[0]?.img || null;

      setGender(agentGender);
      setAvailableAvatars(genderAvatars);
      setAvatar(firstAvatar);
      sessionStorage.setItem('avatar', firstAvatar);
    } else {
      // Fallback: use 'Male' as default if agentGender is invalid
      const defaultGender = 'Male';
      const defaultAvatars = avatars[defaultGender];
      const firstAvatar = defaultAvatars[0]?.img || null;

      setGender(defaultGender);
      setAvailableAvatars(defaultAvatars);
      setAvatar(firstAvatar);
      sessionStorage.setItem('avatar', firstAvatar);
    }
  }, [agentGender]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  const agentnm = sessionStorage.getItem('VoiceAgentName');
  useEffect(() => {
    // console.log(agentnm)
    if (agentnm) {
      setAgentName(agentnm);
      sessionStorage.setItem('agentName', agentnm);
      // console.log(agentnm);
    }
  }, [agentnm]);



  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!agentName.trim()) {
        setAgentNameError("Please enter agent name!");
        return false;
      } else {
        setAgentNameError("");
      }

      if (!selectedAvatar) {
        onValidationError?.({
          type: "failed",
          message: "Please select an avatar!"
        });
        return false;
      }

      return true;
    },
  }));

  const handleAgentNameChange = (e) => {
    const val = e.target.value;
    // console.log(val)
    setAgentName(val);
    sessionStorage.setItem('agentName', val);
    if (val.trim()) {
      setAgentNameError('');
    }
  };
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
    <>
      <div className={styles.labReq} >
        <div className={styles.agentInputBox} id='sliderstep'>
          <label className={styles.agentLabel}>Name Your Virtual Agent</label>
          <div className={styles.Dblock} >
            <input
              type="text"
              name="agentName"
              onChange={handleAgentNameChange}
              className={styles.agentInput}
              placeholder="Ex- Smith, Nova"
              value={agentName}
            />
          </div>
        </div>
        {agentNameError && (
          <p className={styles.agenterror}>
            {agentNameError}
          </p>
        )}
      </div>
      <div className={styles.sliderContainer}>
        <h2 className={styles.heading}
          style={{
            transform: `scale(${scale})`,
            transition: 'transform 0.3s ease-out',
            transformOrigin: 'center center',
            marginTop: '1rem',
            fontSize: `${scale * 2.5}rem`,
          }}
        >Choose Avatar</h2>

        <Slider ref={sliderRef} {...settings}>
          {avatars[gender]?.map((avatar, index) => (
            <div key={index} className={styles.slide} id="slideradio">
              <label className={styles.avatarLabel}>
                <input
                  type="checkbox"
                  name="avatar"
                  value={index}
                  checked={selectedAvatar === avatar}
                  required
                  onChange={() => handleAvatarChange(avatar)}
                  className={styles.radioButton}
                />
                <img
                  src={avatar.img}
                  alt={`Avatar ${index + 1}`}
                  className={styles.avatarImage}
                />
              </label>
            </div>
          ))}
        </Slider>

        <div className={styles.customBtn}>
          <div className={styles.arrowLeft} onClick={() => sliderRef.current.slickPrev()}>
            <img src="svg/sliderleft.svg" alt="Previous" />
          </div>
          <div className={styles.arrowRight} onClick={() => sliderRef.current.slickNext()}>
            <img src="svg/sliderRight.svg" alt="Next" />
          </div>
        </div>
      </div>
    </>
  );
});

export default Step3;
