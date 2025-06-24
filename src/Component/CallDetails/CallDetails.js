import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../CallDetails/CallDetails.module.css";
import Loader2 from "../Loader2/Loader2";
import DetailModal from "../DetailModal/DetailModal";

const CallDetails = () => {
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const [callData, setCallData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(0);
  const [messagesPerReveal, setMessagesPerReveal] = useState(0);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const agentData = JSON.parse(
    sessionStorage.getItem("dashboard-session-storage")
  );
  const { callId } = useParams();
  const agents = agentData?.state?.agents || [];
  const navigate = useNavigate();
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };
  const handleAudioProgress = () => {
    const audio = audioRef.current;
    if (audio) {
      const progress = (audio.currentTime / audio.duration) * 100;
      setAudioProgress(progress);
      setCurrentTime(audio.currentTime);
    }
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    const seekTime = (event.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""
      }${seconds}`;
  };

  useEffect(() => {
    if (!callId) return;

    const fetchCallDetails = async () => {
      try {
        const res = await axios.get(
          `https://api.retellai.com/v2/get-call/${callId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
            },
          }
        );
        setCallData(res.data);
      } catch (err) {
        console.error("Error fetching call details:", err);
        setError("Could not load call details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCallDetails();
  }, [callId]);

  useEffect(() => {
    if (callData && callData.transcript_object) {
      const transcriptLength = callData.transcript_object.length;
      setMessagesPerReveal(Math.ceil(transcriptLength / 4));
    }
  }, [callData]);

  useEffect(() => {
    setVisibleCount(messagesPerReveal);
  }, [messagesPerReveal]);

  if (!callId) return <p>No call selected.</p>;
  if (loading) return <Loader2 />;
  if (error) return <p>{error}</p>;

  const transcript = callData.transcript_object || [];
  const formattedDate = new Date(callData.end_timestamp).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
  const formattedTime = new Date(callData.end_timestamp).toLocaleTimeString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
  let data = callData.call_analysis?.custom_analysis_data;
  let name = data["_detailed _call _summery"];
  
const convertMsToMinSec = (durationMs) => {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes} Min ${seconds} Sec`;
};

  return (
    <div className={styles.CallDetailsMain}>
      <div className={styles.forSticky}>
        <header className={styles.header}>
          <div className={styles.profileBack}>
            <svg
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer" }}
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* fcsadffdsfds */}
              {/* hfhbgdhgfh */}
              <rect width="50" height="50" rx="25" fill="#F9F9F9" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M21.293 25.7071C20.9025 25.3166 20.9025 24.6834 21.293 24.2929L26.9499 18.636C27.3404 18.2455 27.9736 18.2455 28.3641 18.636C28.7546 19.0266 28.7546 19.6597 28.3641 20.0503L23.4144 25L28.3641 29.9497C28.7546 30.3403 28.7546 30.9734 28.3641 31.364C27.9736 31.7545 27.3404 31.7545 26.9499 31.364L21.293 25.7071Z"
                fill="#0A0A0A"
                fill-opacity="0.9"
              />
            </svg>

            <h4 className={styles.headerTitle}>Total Calls</h4>
          </div>
          {/* <div className={styles.profileSection}></div> */}
          <div className={styles.notifiMain}>
            {/* <div className={styles.notificationIcon} >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.88656 14.1957C7.69638 13.772 7.41205 13.3973 7.05521 13.1C6.69836 12.8028 6.27841 12.5908 5.8273 12.4803V4.77773C5.8273 4.5795 5.74855 4.38938 5.60838 4.2492C5.4682 4.10902 5.27808 4.03027 5.07984 4.03027C4.8816 4.03027 4.69148 4.10902 4.55131 4.2492C4.41113 4.38938 4.33238 4.5795 4.33238 4.77773V12.4766C4.15347 12.5223 3.97851 12.5823 3.80916 12.656C3.22679 12.9197 2.74094 13.3581 2.41899 13.9105C2.09705 14.4628 1.95498 15.1016 2.01249 15.7383C2.07 16.375 2.32424 16.978 2.73993 17.4637C3.15563 17.9494 3.71218 18.2937 4.33238 18.4488V21.2219C4.33238 21.4201 4.41113 21.6102 4.55131 21.7504C4.69148 21.8906 4.8816 21.9693 5.07984 21.9693C5.27808 21.9693 5.4682 21.8906 5.60838 21.7504C5.74855 21.6102 5.8273 21.4201 5.8273 21.2219V18.4525C6.31138 18.3343 6.75921 18.0995 7.13179 17.7686C7.50438 17.4377 7.79043 17.0207 7.96504 16.554C8.10905 16.1754 8.17627 15.7718 8.1628 15.367C8.14933 14.9621 8.05542 14.564 7.88656 14.1957ZM6.56729 16.027C6.4752 16.2715 6.32426 16.4894 6.12782 16.6616C5.93138 16.8337 5.69551 16.9548 5.44112 17.014C5.18672 17.0733 4.92163 17.0688 4.66935 17.0012C4.41707 16.9335 4.18537 16.8046 3.99478 16.626C3.80419 16.4474 3.66059 16.2245 3.5767 15.9772C3.49281 15.7298 3.47123 15.4656 3.51385 15.2079C3.55648 14.9502 3.662 14.7069 3.82108 14.4998C3.98015 14.2926 4.18786 14.1278 4.42581 14.0201C4.62971 13.9261 4.85161 13.8777 5.07611 13.8781C5.38203 13.878 5.68148 13.9661 5.93865 14.1318C6.19581 14.2975 6.39979 14.5338 6.52618 14.8124C6.61443 15.0015 6.66417 15.2063 6.67251 15.4148C6.68085 15.6234 6.64762 15.8315 6.57477 16.027H6.56729Z" fill="#0A0A0A" />
                                <path d="M21.7147 14.1957C21.5245 13.772 21.2402 13.3973 20.8833 13.1C20.5265 12.8028 20.1065 12.5908 19.6554 12.4803V4.77773C19.6554 4.5795 19.5767 4.38938 19.4365 4.2492C19.2963 4.10902 19.1062 4.03027 18.908 4.03027C18.7097 4.03027 18.5196 4.10902 18.3794 4.2492C18.2393 4.38938 18.1605 4.5795 18.1605 4.77773V12.4766C17.9816 12.5223 17.8066 12.5823 17.6373 12.656C17.0549 12.9197 16.5691 13.3581 16.2471 13.9105C15.9252 14.4628 15.7831 15.1016 15.8406 15.7383C15.8981 16.375 16.1524 16.978 16.5681 17.4637C16.9838 17.9494 17.5403 18.2937 18.1605 18.4488V21.2219C18.1605 21.4201 18.2393 21.6102 18.3794 21.7504C18.5196 21.8906 18.7097 21.9693 18.908 21.9693C19.1062 21.9693 19.2963 21.8906 19.4365 21.7504C19.5767 21.6102 19.6554 21.4201 19.6554 21.2219V18.4525C20.1395 18.3343 20.5873 18.0995 20.9599 17.7686C21.3325 17.4377 21.6186 17.0207 21.7932 16.554C21.9372 16.1754 22.0044 15.7718 21.9909 15.367C21.9775 14.9621 21.8835 14.564 21.7147 14.1957ZM20.3954 16.027C20.3033 16.2715 20.1524 16.4894 19.9559 16.6616C19.7595 16.8337 19.5236 16.9548 19.2692 17.014C19.0148 17.0733 18.7498 17.0688 18.4975 17.0012C18.2452 16.9335 18.0135 16.8046 17.8229 16.626C17.6323 16.4474 17.4887 16.2245 17.4048 15.9772C17.3209 15.7298 17.2994 15.4656 17.342 15.2079C17.3846 14.9502 17.4901 14.7069 17.6492 14.4998C17.8083 14.2926 18.016 14.1278 18.2539 14.0201C18.4579 13.9265 18.6798 13.878 18.9042 13.8781C19.2102 13.878 19.5096 13.9661 19.7668 14.1318C20.0239 14.2975 20.2279 14.5338 20.3543 14.8124C20.4413 15.002 20.4898 15.2071 20.4969 15.4156C20.5039 15.6241 20.4694 15.832 20.3954 16.027Z" fill="#0A0A0A" />
                                <path d="M13.0815 7.76758C12.9694 7.72647 12.8572 7.69283 12.7414 7.66294V4.77773C12.7414 4.5795 12.6626 4.38938 12.5225 4.2492C12.3823 4.10902 12.1922 4.03027 11.9939 4.03027C11.7957 4.03027 11.6056 4.10902 11.4654 4.2492C11.3252 4.38938 11.2465 4.5795 11.2465 4.77773V7.67415C10.8091 7.78456 10.4012 7.98949 10.0516 8.27452C9.70191 8.55955 9.41897 8.91774 9.22266 9.32389C9.02636 9.73005 8.92145 10.1743 8.91532 10.6254C8.9092 11.0764 9.00201 11.5233 9.18721 11.9347C9.35294 12.304 9.59019 12.6368 9.88526 12.9139C10.1803 13.191 10.5274 13.407 10.9064 13.5492C11.0185 13.5903 11.1344 13.6239 11.2465 13.6538V21.2219C11.2465 21.4201 11.3252 21.6102 11.4654 21.7504C11.6056 21.8906 11.7957 21.9693 11.9939 21.9693C12.1922 21.9693 12.3823 21.8906 12.5225 21.7504C12.6626 21.6102 12.7414 21.4201 12.7414 21.2219V13.6501C12.9211 13.6072 13.0964 13.5471 13.2646 13.4707C13.8245 13.222 14.2975 12.812 14.6231 12.293C14.9486 11.7741 15.1121 11.1698 15.0924 10.5575C15.0727 9.9452 14.8709 9.35267 14.5127 8.85569C14.1545 8.3587 13.6562 7.97985 13.0815 7.76758ZM13.4926 11.2246C13.3817 11.5186 13.1862 11.7732 12.9306 11.956C12.675 12.1388 12.371 12.2418 12.0569 12.2518C11.7429 12.2618 11.4329 12.1784 11.1662 12.0122C10.8995 11.846 10.6881 11.6044 10.5588 11.318C10.4495 11.0762 10.4026 10.8108 10.4223 10.5462C10.442 10.2816 10.5276 10.0261 10.6715 9.80305C10.8153 9.58005 11.0127 9.39663 11.2457 9.26956C11.4787 9.1425 11.7398 9.07582 12.0051 9.07564C12.1965 9.07578 12.3863 9.10995 12.5657 9.17654C12.7591 9.25118 12.9359 9.3632 13.086 9.5062C13.236 9.64921 13.3564 9.82039 13.4403 10.01C13.5291 10.1988 13.5795 10.4035 13.5885 10.612C13.5975 10.8205 13.5649 11.0288 13.4926 11.2246Z" fill="#0A0A0A" />
                            </svg>

                        </div> */}
          </div>
        </header>
        <div className={styles.agentCard}>
          <div className={styles.details}>
            <p>Caller Name</p>
            <p>Sentiment</p>
          </div>
          <div className={styles.detail2}>
            <div className={styles.userName}>
              <h2>{name || "Unknown"}</h2>
            </div>
            <div
              className={`${styles.status} ${callData.call_analysis?.user_sentiment === "Positive"
                ? styles.green
                : callData.call_analysis?.user_sentiment === "Neutral"
                  ? styles.yellow
                  : styles.red
                }`}
            >
              <p>{callData.call_analysis?.user_sentiment || "N/A"}</p>
            </div>
          </div>
          <hr className={styles.hrline} />
          <div className={styles.details3}>
            <div className={styles.Part1}>
              <p>{formattedDate}</p>
              <strong>{formattedTime}</strong>
            </div>
            <div className={styles.Part2}>
              <p>Attended by</p>
              <strong>
                {callData?.agent_id
                  ? agents.find((a) => a.agent_id === callData.agent_id)
                    ?.agentName || "Unknown Agent"
                  : "Loading..."}
              </strong>
            </div>

            <div className={styles.Part3}>
              <p>Durations</p>

              <strong>{convertMsToMinSec(callData.duration_ms)}</strong>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className={styles.DataMain}>
          <div className={styles.dataTitle}>
            <h2>Data Collected</h2>
          </div>
          <div className={styles.dataCard}>
            <div className={styles.PhoneNumber}>
              <p>Phone number</p>
              <b>-</b>
            </div>
            <div className={styles.EmailAddress}>
              <p>Email address</p>
              <b>-</b>
            </div>
            <div className={styles.Address}>
              <p>Address (if collected)</p>
              <b>-</b>
            </div>
            <div className={styles.Reason}>
              <p>Reason</p>
              <b>-</b>
            </div>
          </div>
          <div className={styles.moredetailsDiv}>
            <div className={styles.dataTitle}>
              <h2>More Details</h2>
            </div>
            <div></div>
            <div className={styles.channel}>
              <p className={styles.Ptext}>Channel</p>
              <div className={styles.PhoneDiv}>
                <p>{callData.call_type}</p>
              </div>
            </div>
            <div className={styles.channel}>
              <p className={styles.Ptext}>Caller’s Type</p>
              <div>
                <strong>Customer</strong>
              </div>
            </div>
            <div className={styles.channel}>
              <p className={styles.Ptext}>Call Recording</p>
              <div className={styles.audioPlayer}>
                <div onClick={toggleAudio} className={styles.playPauseBtn}>
                  {isPlaying ? (
                    // Pause Icon
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 50 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="25" cy="25" r="25" fill="#EBE2FF" />
                      <rect
                        x="18"
                        y="17"
                        width="5"
                        height="18"
                        rx="2"
                        fill="#6524EB"
                      />
                      <rect
                        x="27"
                        y="17"
                        width="5"
                        height="18"
                        rx="2"
                        fill="#6524EB"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 50 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="25" cy="25" r="25" fill="#EBE2FF" />
                      <polygon points="20,17 35,25 20,33" fill="#6524EB" />
                    </svg>
                  )}
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioProgress}
                  onChange={handleSeek}
                  className={styles.audioSeek}
                />
                <div className={styles.audioTime}>
                  <span>{formatTime(currentTime)}</span> /{" "}
                  <span>{formatTime(audioRef.current?.duration || 0)}</span>
                </div>
                <audio
                  ref={audioRef}
                  src={callData.recording_url}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={handleAudioProgress}
                />
              </div>
            </div>
          </div>
          <div className={styles.summaryDiv}>
            <div className={styles.dataTitle}>
              <h2>Chat Details</h2>
            </div>
            <div className={styles.ChatBox}>
              {transcript.find((msg) => msg.role === "agent") && (
                <div className={styles.messageLeft}>
                  <div className={styles.bubbleLeft}>
                    {transcript.find((msg) => msg.role === "agent").content}
                  </div>
                  <span className={styles.time}>Agent</span>
                </div>
              )}

              {transcript.find((msg) => msg.role === "user") && (
                <div className={styles.messageRight}>
                  <div className={styles.bubbleRight}>
                    {transcript.find((msg) => msg.role === "user").content}
                  </div>
                  <span className={styles.time}>User</span>
                </div>
              )}

              <div
                className={styles.chatBtn}
                onClick={() => setChatModalOpen(true)}
              >
                <p>View Full Chat</p>
              </div>
            </div>

            <DetailModal
              isOpen={isChatModalOpen}
              onClose={() => setChatModalOpen(false)}
              height="80dvh"
            >
              <div className={styles.titlediv}>
                <h1>Chat View</h1>
              </div>
              <div className={styles.ChatBox2}>
                {transcript.map((entry, index) => (
                  <div key={index} className={styles.messageWrapper}>
                    {entry.role === "agent" ? (
                      <>
                        <div className={styles.messageLeftWrapper}>
                          <img
                            src="/svg/Rex1.svg"
                            alt="Agent"
                            className={styles.profileImage}
                          />
                          <div className={styles.messageLeft}>
                            <div className={styles.bubbleLeft}>{entry.content}</div>
                          </div>
                        </div>
                        <span className={styles.time}>Agent</span>
                      </>
                    ) : (
                      <>
                        <div className={styles.messageWrapper2}>
                          <div className={styles.messageRight}>
                            <div className={styles.bubbleRight}>{entry.content}</div>
                          </div>
                          <span className={styles.time}>You</span>
                        </div>

                      </>
                    )}
                  </div>
                ))}
              </div>


            </DetailModal>
          </div>
          <div className={styles.summaryDiv}>
            <div className={styles.dataTitle}>
              <h2>Call summary</h2>
            </div>
            <p className={styles.Ptext}>
              {callData.call_analysis?.call_summary || "No data"}
            </p>
          </div>

          {/* <div className={styles.summaryDiv}>
            <div className={styles.dataTitle}>
              <h2>Chat Details</h2>
            </div>
            <div className={styles.chatDetails}>
              {transcript.slice(0, visibleCount).map((entry, index) => (
                <div
                  key={index}
                  className={
                    entry.role === "agent"
                      ? styles.agentMessage
                      : styles.userMessage
                  }
                >
                  <p>
                    <strong>
                      {entry.role === "agent" ? "Agent: " : "User: "}
                    </strong>
                    {entry.content}
                  </p>
                </div>
              ))}
            </div>
            {visibleCount < transcript.length && (
              <button
                onClick={showMoreMessages}
                className={styles.readMoreButton}
              >
                Read More
              </button>
            )}
          </div> */}
          {/* <div className={styles.summaryDiv}>
            <div className={styles.dataTitle}>
              <h2>Outcome(Analysis)</h2>
            </div>

            <p className={styles.Ptext}>
              Analysis: Customer satisfied with the information provided.{" "}
            </p>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default CallDetails;
