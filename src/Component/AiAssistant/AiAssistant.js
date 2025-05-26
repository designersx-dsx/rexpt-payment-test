import React from 'react'
import styles from "../AiAssistant/AiAssistant.module.css"

const AiAssistant = () => {
      const text = "Go ahead, I’m listening...";
    return (
        <div>
            <div className={styles.Header}>
                <div className={styles.back}>
                    <img src='images/backimg.png' alt='backimg' />
                </div>
                <div className={styles.title}>Ai Assistant</div>
                <div className={styles.more}><img src='images/more.png' alt='more' /></div>
            </div>

           <p className={styles.waveText}>
      {[...text].map((char, index) => (
        <span
          key={index}
          className={styles.waveLetter}
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </p>
            <div>
                <img src='images/voicewave.png' alt='voicewave' />
            </div>


        </div>
    )
}

export default AiAssistant
