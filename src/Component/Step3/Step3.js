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
  const [agentName, setAgentName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [agentNameError, setAgentNameError] = useState('');
  const [scale, setScale] = useState(1);
  const [gender, setGender] = useState(''); // default
  const [availableAvatars, setAvailableAvatars] = useState(avatars['male']);
  const agentGender = sessionStorage.getItem('agentGender')
  const [selectedAvatar, setSelectedAvatar] = useState(sessionStorage.getItem('avatar')||null);
  const EditingMode = localStorage.getItem("UpdationMode");
   const updationMode = localStorage.getItem("UpdationMode") == "ON" ||"";
  const storedAvatarImg = sessionStorage.getItem('avatar') ||"";

  console.log('agentGender',agentName)
useEffect(() => {
 

  if (updationMode) {
    const matchedAvatarIndex = (avatars[agentGender] || []).findIndex(av => av?.img === storedAvatarImg);

    if (matchedAvatarIndex !== -1) {
      const matchedAvatar = avatars[agentGender][matchedAvatarIndex];
      setSelectedAvatar(matchedAvatar);
      setAvatar(matchedAvatar?.img);
      console.log('---s--s-s-s'.selectedAvatar?.img,matchedAvatar?.img)
      sliderRef.current?.slickGoTo(matchedAvatarIndex); 
    }
    const storedName = localStorage.getItem('agentName');
    if (storedName) {
      setAgentName(storedName);
      sessionStorage.setItem('agentName', storedName);
    }

    const storedAgentName=localStorage.getItem("agentName")
    if(storedAgentName){
      setAgentName(storedName);
      sessionStorage.setItem('agentName', storedName);
      sessionStorage.setItem('VoiceAgentName',storedName);
    }
  }
}, [agentGender,avatars]);

  
  const handleAvatarChange = (avatar) => {
    // setSelectedAvatar((prev) => (prev === avatar ? null : avatar));
    setAvatar(avatar?.img);
    setSelectedAvatar(avatar);
    sessionStorage.setItem('avatar', avatar?.img);
  };
  //  console.log('avatar',selectedAvatar)
  useEffect(() => {

    if(updationMode){
         setGender(agentGender);
          setAvatar(selectedAvatar);
    }else{
         if (agentGender && avatars[agentGender]) {
          const genderAvatars = avatars[agentGender];
          const firstAvatar = genderAvatars[0]?.img || null;
          console.log('inside if')
          setGender(agentGender);
          setAvailableAvatars(genderAvatars);
          setAvatar(firstAvatar);
          sessionStorage.setItem('avatar', firstAvatar);
        } else {
          // Fallback: use 'Male' as default if agentGender is invalid
          const defaultGender = 'Male';
          const defaultAvatars = avatars[defaultGender];
          const firstAvatar = defaultAvatars[0]?.img || null;
          console.log('inside else')
          setGender(defaultGender);
          setAvailableAvatars(defaultAvatars);
          setAvatar(firstAvatar);
          sessionStorage.setItem('avatar', firstAvatar);
        }
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

    if(localStorage.getItem("UpdationMode") == "ON"){
      console.log('inside if on')
      setAgentName(localStorage.getItem('agentName'))
      // setAgentName(sessionStorage.getItem('VoiceAgentName'))

    }else {
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
      
      <div className={styles.sliderContainer}>
        <h2 className={styles.heading}>{EditingMode?'Edit: Receptionist Avatar':'Receptionist Avatar'}</h2>

        <Slider ref={sliderRef} {...settings}>
          {avatars[gender]?.map((avatar, index) => (
            <div key={index} className={styles.slide} id="slideradio">
              <label className={styles.avatarLabel}>
                <input
                  type="checkbox"
                  name="avatar"
                  value={index}
                  // checked={selectedAvatar === avatar}
                    checked={selectedAvatar?.img === avatar.img}
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
