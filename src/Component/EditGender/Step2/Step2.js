import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
} from "react";
import styles from "./Step2.module.css";
// import { getRetellVoices } from "../../Store/apiStore";
import { getRetellVoices } from "../../../Store/apiStore";
import PopUp from "../../Popup/Popup";
const Step2 = ({ onValidationChange ,originalGender, originalVoice }) => {
  const [selectedGender, setSelectedGender] = useState("");
    const [prevAgentGender,setprevAgentGender]=useState("")
  const [selectedVoice, setSelectedVoice] = useState("");
  const [listVoices, setListVoices] = useState([]);
  const [filteredVoices, setFilteredVoices] = useState([]);
  const audioRefs = useRef([]);
  const [playingIdx, setPlayingIdx] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [scale, setScale] = useState(1);
  const [isGenderChanging, setIsGenderChanging] = useState(false);
  const [isVoiceDirty, setIsVoiceDirty] = useState(false);

const handleGenderChange = (gender) => {
  if (gender !== selectedGender) { // ✅ Only if actual change
    setSelectedGender(gender);
    // setSelectedVoice(null);
    // sessionStorage.removeItem('agentVoice');
    // sessionStorage.removeItem('agentVoiceAccent');
    // sessionStorage.removeItem('VoiceAgentName');
    setIsVoiceDirty(false);
    setIsGenderChanging(true);

    const dirty = gender.toLowerCase() != originalGender?.toLowerCase();
  // console.log(originalGender,gender,dirty)

    // 🪝 Tell parent gender changed & no voice selected
    onValidationChange?.({
      genderChanged: true,
      voiceSelected: false, // 🔥 Force false here
      isDirty: dirty, 
    });
  }
};



  useEffect(() => {
    if (localStorage.getItem("UpdationModeStepWise") === "ON" && listVoices.length > 0) {
      const storedGender = localStorage.getItem("agentGender");
      if (storedGender) {
        const formattedGender =
          storedGender.charAt(0).toUpperCase() + storedGender.slice(1).toLowerCase();
        setSelectedGender(formattedGender);
        sessionStorage.setItem('prevAgentGender', formattedGender);

      }

      const storedVoiceId = localStorage.getItem("agentVoice");
      if (storedVoiceId) {
        const matchingVoice = listVoices.find((v) => v.voice_id === storedVoiceId);
        if (matchingVoice) {
          setSelectedVoice(matchingVoice);
        }
      }
    }
  }, [listVoices]);

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
  }, []);

  useEffect(() => {
    if (
      selectedVoice &&
      selectedVoice.voice_id &&
      selectedVoice.voice_name &&
      selectedVoice.accent &&     !isGenderChanging // Block if gender is being changed

    ) {
      sessionStorage.setItem("agentVoice", selectedVoice.voice_id);
      sessionStorage.setItem("agentVoiceAccent", selectedVoice.accent);
      sessionStorage.setItem("VoiceAgentName", selectedVoice?.voice_name?.replace(/\s*\(.*?\)/, ""));
    }
  }, [selectedVoice]);

  useEffect(() => {
    if (listVoices && selectedGender) {
      const filtered = listVoices.filter(
        (voice) =>
          voice.provider == "elevenlabs" &&
          voice.gender === selectedGender?.toLocaleLowerCase()
      );
      setFilteredVoices(filtered);
      sessionStorage.setItem("agentGender", selectedGender);
      
    }
  }, [selectedGender, listVoices]);

  useEffect(() => {
  if (isGenderChanging) {
    setTimeout(() => {
      setIsGenderChanging(false);
    }, 500); // Give it 500ms delay for safety
  }
}, [isGenderChanging]);

  const togglePlay = (idx) => {
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

  const playAudio = (idx) => {
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
  useEffect(() => {
    if (listVoices.length > 0) {
      const storedGender = sessionStorage.getItem("agentGender");
      const storedVoiceId = sessionStorage.getItem("agentVoice");

      if (storedGender) {
        setSelectedGender(
          storedGender.charAt(0).toUpperCase() + storedGender.slice(1).toLowerCase()
        );
      }

      if (storedVoiceId) {
        const voice = listVoices.find((v) => v.voice_id === storedVoiceId);
        if (voice) {
          setSelectedVoice(voice);
        }
      }
    }
  }, [listVoices]);

  // useImperativeHandle(ref, () => ({
  //   validate: () => {
  //     if (!selectedGender) {
  //       onValidationError?.({
  //         type: "failed",
  //         message: "Please select a gender!",
  //       });
  //       return false;
  //     }
  //     if (!selectedVoice || !selectedVoice.voice_name) {
  //       onValidationError?.({
  //         type: "failed",
  //         message: "Please select a voice!",
  //       });
  //       return false;
  //     }
  //     onStepChange?.(7);
  //     return true;
  //   },
  // }));

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      let newScale = 1 - Math.min(scrollY / 400, 0.3);
      if (newScale < 0.7) newScale = 0.7;
      setScale(newScale);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  //user not refresh
  // useEffect(() => {
  //   const blockKeyboardRefresh = (e) => {
  //     if (
  //       e.key === "F5" ||
  //       (e.ctrlKey && e.key === "r") ||
  //       (e.metaKey && e.key === "r") // For Mac ⌘+R
  //     ) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //     }
  //   };

  //   const blockMouseRefresh = (e) => {
  //     // Block middle-click (mouse button 1) or right-click (mouse button 2)
  //     if (e.button === 1 || e.button === 2) {
  //       e.preventDefault();
  //     }
  //   };

  //   const handleBeforeUnload = (e) => {
  //     e.preventDefault();
  //     e.returnValue = ""; // Required to trigger confirmation prompt
  //   };

  //   // Block browser refresh & warn
  //   window.addEventListener("keydown", blockKeyboardRefresh);
  //   window.addEventListener("mousedown", blockMouseRefresh);
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   window.addEventListener("contextmenu", (e) => e.preventDefault()); // Disable right-click

  //   return () => {
  //     window.removeEventListener("keydown", blockKeyboardRefresh);
  //     window.removeEventListener("mousedown", blockMouseRefresh);
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     window.removeEventListener("contextmenu", (e) => e.preventDefault());
  //   };
  // }, []);
  return (
    <>
      <div className={styles.container}>
        {/* <div className={styles.logoWrapper}>
        <img src="/images/stepmask.png" alt="Logo" className={styles.logo} />
      </div>

      <h2 className={styles.sectionTitle}>Agent Gender</h2> */}
        <div className={styles.genderContainer}>
          {["Male", "Female"].map((gender) => (
            <label
              key={gender}
              className={`${styles.genderCard} ${selectedGender === gender ? styles.active : ""
                }`}
            >
              <span className={styles.icon}>
                {gender === "Male" ? (
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
                onChange={() => {
                  // setSelectedGender(gender);
                  //   sessionStorage.setItem('prevAgentGender',gender);
                  //    sessionStorage.setItem('agentVoice','');
                  //    setSelectedVoice(null);
                  handleGenderChange(gender)
                    }
                    }
                className={styles.radioInput}
              />
            </label>
          ))}
        </div>

        {selectedGender && <h2
          className={styles.sectionTitle}
        >
          Select Voice
        </h2>}
        <p className={styles.sectionmPara}>Select a voice for your agent as per your liking</p>
        <div className={styles.voiceGrid}>
          {filteredVoices.map((voice, idx) => (
            <label
              key={voice.voice_id ?? idx}
              className={`${styles.voiceCard} ${selectedVoice?.voice_name?.replace(/\s*\(.*?\)/, "") === voice?.voice_name?.replace(/\s*\(.*?\)/, "")
                ? styles.active
                : ""
                }`}
            >
              <input
                type="radio"
                name="voice"
                value={voice.voice_name}
                checked={selectedVoice?.voice_name?.replace(/\s*\(.*?\)/, "") === voice?.voice_name?.replace(/\s*\(.*?\)/, "")}
                onChange={() => {
                  setSelectedVoice(voice);
                  playAudio(idx); // play when selected
                  setIsVoiceDirty(true);

                  const dirty = voice.voice_id != originalVoice;
                    // console.log(originalVoice,voice.voice_id,dirty)

                  onValidationChange?.({
                  genderChanged: false, // gender already selected
                  voiceSelected: true,  // voice just selected
                  isDirty: dirty, 
                });                  
                }}
                className={styles.radioInput}
              />
              <div
                className={styles.playIcon}
                onClick={(e) => {
                  e.preventDefault();
                  togglePlay(idx);
                  setSelectedVoice(voice);
                }}
                title="Preview"
              >
                <img
                  src={
                    playingIdx === idx
                      ? "svg/Pause-icon.svg"
                      : "svg/Play-icon.svg"
                  }
                  alt={playingIdx === idx ? "Play" : "Pause"}
                />
              </div>
              {/* Hidden audio element */}
              <audio
                ref={(el) => (audioRefs.current[idx] = el)}
                style={{ display: "none" }}
              >
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
        <PopUp
          type={popupType}
          onClose={() => setShowPopup(false)}
          message={popupMessage}
        />
      )}
    </>
  );
};

export default Step2;
