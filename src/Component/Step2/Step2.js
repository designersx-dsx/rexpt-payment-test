import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import styles from './Step2.module.css';
import { getRetellVoices } from '../../Store/apiStore';
import PopUp from '../Popup/Popup';
const Step2 = forwardRef(({ onNext, onBack, onValidationError }, ref) => {
  const [selectedGender, setSelectedGender] = useState('Male');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [listVoices, setListVoices] = useState([]);
  const [filteredVoices, setFilteredVoices] = useState([]);
  const audioRefs = useRef([]);                 // array of <audio> elements
  const [playingIdx, setPlayingIdx] = useState(null);  // which card is playing?
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [scale, setScale] = useState(1);
  const voices = [
    { name: 'Blaze', desc: 'Assertive tone' },
    { name: 'Echo', desc: 'Robotic voice' },
    { name: 'Sage', desc: 'Calm and wise' },
    { name: 'Echo2', desc: 'Robotic voice' },
    { name: 'Sage3', desc: 'Calm and wise' },
    { name: 'Echo3', desc: 'Robotic voice' },
  ];

  useEffect(() => {
    const fetchRetellVoiceList = async () => {
      try {
        const voiceResponses = await getRetellVoices();

        setListVoices(voiceResponses.data);
      } catch (error) {
        console.error("Error fetching voices:", error);
      }
    };
    fetchRetellVoiceList();
  }, [])


  useEffect(() => {
    sessionStorage.setItem("agentVoice", selectedVoice?.voice_id);
    sessionStorage.setItem("agentVoiceAccent", selectedVoice?.accent);
  }, [selectedVoice])

  useEffect(() => {
    if (listVoices && selectedGender) {
      const filtered = listVoices.filter((voice) =>
        voice.provider == "elevenlabs" && voice.gender === selectedGender?.toLocaleLowerCase()
      );
      // console.log("Filtered voices:", filtered);
      setFilteredVoices(filtered);
      sessionStorage.setItem("agentGender", selectedGender);
    }
  }, [selectedGender, listVoices]);

  const togglePlay = idx => {
    const thisAudio = audioRefs.current[idx];
    if (!thisAudio) return;

    // if user taps the card that’s already playing → pause it
    if (playingIdx === idx) {
      thisAudio.pause();
      setPlayingIdx(null);
      return;
    }

    // pause whichever clip is currently playing
    if (playingIdx !== null) {
      const playingAudio = audioRefs.current[playingIdx];
      playingAudio?.pause();
      playingAudio.currentTime = 0;
    }

    // play the new clip
    thisAudio.play();
    setPlayingIdx(idx);

    // when it ends, clear the state so icons reset
    thisAudio.onended = () => setPlayingIdx(null);
  };

  const playAudio = idx => {
    const selectedAudio = audioRefs.current[idx];

    if (!selectedAudio) return;

    // Stop any currently playing audio
    if (playingIdx !== null && playingIdx !== idx) {
      const currentAudio = audioRefs.current[playingIdx];
      currentAudio?.pause();
      currentAudio.currentTime = 0;
    }

    // Play the selected one
    selectedAudio.play();
    setPlayingIdx(idx);

    selectedAudio.onended = () => setPlayingIdx(null);
  };
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!selectedGender) {
        onValidationError?.({
          type: "failed",
          message: "Please select a gender!"
        });
        return false;
      }
      if (!selectedVoice || !selectedVoice.voice_name) {
        onValidationError?.({
          type: "failed",
          message: "Please select a voice!"
        });
        return false;
      }
      return true;
    },

  }));

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

      <div className={styles.container}>

        {/* <div className={styles.logoWrapper}>
        <img src="/images/stepmask.png" alt="Logo" className={styles.logo} />
      </div>

      <h2 className={styles.sectionTitle}>Agent Gender</h2> */}
        <div className={styles.genderContainer}>
          {['Male', 'Female'].map((gender) => (
            <label
              key={gender}
              className={`${styles.genderCard} ${selectedGender === gender ? styles.active : ''}`}
            >

              <span className={styles.icon}>
                {gender === 'Male' ? (
                  <img src="svg/male-icon.svg" alt="Male Icon" />
                ) : (
                  <img src="svg/female-icon.svg" alt="Female Icon" />
                )}
              </span>
              <span>{gender}</span>
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={selectedGender === gender}
                onChange={() => setSelectedGender(gender)}
                className={styles.radioInput}
              />


            </label>
          ))}
        </div>

        <h2 className={styles.sectionTitle} style={{
          transform: `scale(${scale})`,
          transition: 'transform 0.3s ease-out',
          transformOrigin: 'center center',
          marginTop: '1rem',
          fontSize: `${scale * 2.5}rem`,
        }}>Agent Voice</h2>
        <div className={styles.voiceGrid}>
          {/* {voices.map((voice, index) => (
          <label
            key={index}
            className={`${styles.voiceCard} ${selectedVoice === voice.name ? styles.active : ''}`}
          >
            <input
              type="radio"
              name="voice"
              value={voice.name}
              checked={selectedVoice === voice.name}
              onChange={() => setSelectedVoice(voice.name)}
              className={styles.radioInput}
            />
            <div className={styles.playIcon}><img src='images/play-ico.png' alt='play-icon' /></div>
            <div>
              <p className={styles.voiceName}>{voice.name}</p>
              <p className={styles.voiceDesc}>{voice.desc}</p>
            </div>
          </label>
        ))} */}

          {filteredVoices.map((voice, idx) => (
            <label
              key={voice.voice_id ?? idx}
              className={`${styles.voiceCard} ${selectedVoice.voice_name === voice.voice_name ? styles.active : ''
                }`}>
              <input
                type="radio"
                name="voice"
                value={voice.voice_name}
                checked={selectedVoice.voice_name === voice.voice_name}
                onChange={() => {
                  setSelectedVoice(voice);
                  playAudio(idx);
                }}
                className={styles.radioInput}
              />
              <div
                className={styles.playIcon}
                onClick={() => togglePlay(idx)}
                title="Preview">
                <img
                  // src={
                  //   playingIdx === idx
                  //     ? 'images/pause-ico.png'
                  //     : 'images/play-ico.png'
                  // }
                  // src={'images/play-ico.png'}
                  src={voice?.avatar_url}
                  height={50}
                  width={50}
                  alt="play/pause"
                />
              </div>
              {/* Hidden audio element */}
              <audio
                ref={el => (audioRefs.current[idx] = el)}
                style={{ display: 'none' }}>
                <source src={voice.preview_audio_url} type="audio/mpeg" />
              </audio>

              <div>
                <p className={styles.voiceName}>{voice.voice_name}</p>
                <p className={styles.voiceDesc}>{voice.accent} Accent</p>
              </div>
            </label>
          ))}

        </div>

      </div>
      {showPopup && (
        <PopUp type={popupType} onClose={() => setShowPopup(false)} message={popupMessage} />
      )}

    </>
  );
});

export default Step2;
