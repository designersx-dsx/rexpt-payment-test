import React, { useState } from 'react';
import styles from './Step2.module.css';

const Step2 = ({ onNext, onBack }) => {
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');

  const voices = [
    { name: 'Blaze', desc: 'Assertive tone' },
    { name: 'Echo', desc: 'Robotic voice' },
    { name: 'Sage', desc: 'Calm and wise' },
    { name: 'Echo2', desc: 'Robotic voice' },
    { name: 'Sage3', desc: 'Calm and wise' },
    { name: 'Echo3', desc: 'Robotic voice' },
  ];

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
        {voices.map((voice, index) => (
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
        ))}
      </div>
    </div>
  );
};

export default Step2;
