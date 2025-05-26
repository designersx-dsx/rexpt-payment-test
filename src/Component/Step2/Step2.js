import React, { useEffect, useState,useRef } from 'react';
import styles from './Step2.module.css';
import { getRetellVoices } from '../../Store/apiStore';

const Step2 = ({ onNext, onBack }) => {
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [listVoices,setListVoices]=useState([]);
  const [filteredVoices,setFilteredVoices]=useState([]);
  const audioRefs = useRef([]);                 // array of <audio> elements
  const [playingIdx, setPlayingIdx] = useState(null);  // which card is playing?

  const voices = [
    { name: 'Blaze', desc: 'Assertive tone' },
    { name: 'Echo', desc: 'Robotic voice' },
    { name: 'Sage', desc: 'Calm and wise' },
    { name: 'Echo2', desc: 'Robotic voice' },
    { name: 'Sage3', desc: 'Calm and wise' },
    { name: 'Echo3', desc: 'Robotic voice' },
  ];

    useEffect(()=>{
      const fetchRetellVoiceList = async () => {
    try {
      const voiceResponses = await getRetellVoices();
      console.log("Voices:", voiceResponses.data);
      setListVoices(voiceResponses.data);
    } catch (error) {
      console.error("Error fetching voices:", error);
    }
  };
  fetchRetellVoiceList();
  },[])

console.log('selectedGender',selectedGender,selectedVoice)

useEffect(() => {
  console.log(selectedGender,listVoices)
  if (listVoices && selectedGender) {
    const filtered = listVoices.filter((voice) =>
      voice.provider=="elevenlabs" && voice.gender === selectedGender?.toLocaleLowerCase()
    );

    // You probably want to do something with `filtered` here, like:
    console.log("Filtered voices:", filtered);
    // or set it to state
    setFilteredVoices(filtered);
  }
}, [selectedGender,listVoices]);

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

  return (
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
                <img src="images/male-icon.png" alt="Male Icon" />
              ) : (
                <img src="images/female-icon.png" alt="Female Icon" />
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

      <h2 className={styles.sectionTitle}>Agent Voice</h2>
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
            className={`${styles.voiceCard} ${
              selectedVoice.voice_name === voice.voice_name ? styles.active : ''
            }`}>
            <input
              type="radio"
              name="voice"
              value={voice.voice_name}
              checked={selectedVoice.voice_name === voice.voice_name}
              onChange={() => {
                setSelectedVoice(voice);
                playAudio(idx); // ← NEW: play selected audio
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
  );
};

export default Step2;
