// pages/index.js
import { useEffect, useState } from "react";
import styles from "./TotalsCallsList.module.css";
import HeaderFilter from "../HeaderFilter/HeaderFilter";
import axios from "axios";
import { API_BASE_URL } from "../../Store/apiStore";
import Loader from "../Loader/Loader";
import Loader2 from "../Loader2/Loader2";

const options = [
    { id: 1, label: "All", imageUrl: "svg/ThreOpbtn.svg" },
    { id: 2, label: "Positive", imageUrl: "svg/greendot.svg" },
    { id: 3, label: "Neutral", imageUrl: "svg/yellodot.svg" },
    { id: 4, label: "Negative", imageUrl: "svg/reddot.svg" },
];

const callsPerPage = 6;

export default function Home() {
    const agentId = sessionStorage.getItem("agentId");
    const [data, setData] = useState([]);
    const [selectedSentiment, setSelectedSentiment] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false)
    const fetchAgents = JSON.parse(sessionStorage.getItem("dashboard-session-storage"))
    console.log(fetchAgents, "HELO")
    useEffect(() => {
        fetchCallHistory();
    }, []);

    const fetchCallHistory = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${API_BASE_URL}/agent/getAgentCallHistory/${agentId}`);
            setData(response.data.filteredCalls || []);
            setLoading(false)
        } catch (error) {
            console.error("Error fetching call history:", error);
        } finally {
            setLoading(false)
        }
    };

    const convertMsToMinSec = (durationMs) => {
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        return `${minutes} min ${seconds} sec`;
    };

    const getDateTimeFromTimestamp = (timestamp) => {
        const dateObj = new Date(timestamp);
        const date = dateObj.toLocaleDateString();
        const time = dateObj.toLocaleTimeString();
        return { date, time };
    };
    const filteredData = selectedSentiment === "All"
        ? data
        : data.filter((call) => call.user_sentiment === selectedSentiment);

    const totalPages = Math.ceil(filteredData.length / callsPerPage);
    const indexOfLastCall = currentPage * callsPerPage;
    const indexOfFirstCall = indexOfLastCall - callsPerPage;
    const currentCalls = filteredData.slice(indexOfFirstCall, indexOfLastCall);

    const handlePageChange = (pageNum) => {
        if (pageNum < 1 || pageNum > totalPages) return;
        setCurrentPage(pageNum);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <HeaderFilter options={options}
                    selectedSentiment={selectedSentiment}
                    onFilter={(label) => {
                        setSelectedSentiment(label);
                        setCurrentPage(1);
                    }}
                    isAgents={
                        fetchAgents.state.agents
                    }
                            // onAgentChange={handleAgentChange}

                />


                {/* Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th>Date & Time</th>
                                <th>Duration</th>
                                <th>From</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {loading ? <Loader2 /> : currentCalls.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center" }}>No data found</td>
                                </tr>
                            ) : (
                                currentCalls.map((call, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className={styles.callDateTime}>
                                                <div>{getDateTimeFromTimestamp(call.end_timestamp).time}</div>
                                                <div className={styles.callDate}>{getDateTimeFromTimestamp(call.end_timestamp).date}</div>
                                            </div>
                                        </td>
                                        <td>{convertMsToMinSec(call.duration_ms)}</td>
                                        <td>
                                            <p className={`${styles.fromNumber} ${styles[call.fromColor]}`}>{call.call_type}</p>
                                        </td>
                                        <td className={styles.CallName}>-</td>
                                        <td>
                                            <div className={styles.actionIcons}>
                                                {/* Add your icons here */}
                                                <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M19.8254 17.0938L16.9809 14.2493C15.9707 13.2391 14.2427 13.6378 13.8173 14.9671C13.5249 15.8709 12.4881 16.4026 11.5842 16.1899C9.5638 15.6848 6.79901 13.0264 6.29391 10.8996C6.00148 9.99576 6.58634 8.95896 7.51679 8.66653C8.84601 8.26777 9.24478 6.53979 8.23458 5.50299L5.39004 2.65845C4.56592 1.94067 3.36962 1.94067 2.65184 2.65845L0.711169 4.59911C-1.2295 6.61953 0.923848 12.0162 5.68247 16.8014C10.4411 21.5866 15.8377 23.8197 17.8847 21.7727L19.8254 19.832C20.5432 19.0345 20.5432 17.8116 19.8254 17.0938Z" fill="#B5A0F3" />
                                                    <path d="M22.749 19.2471H21.5527V17.7584H22.749C23.4668 17.7584 24.0517 17.1736 24.0517 16.4558V2.79137C24.0517 2.07359 23.4668 1.48872 22.749 1.48872H14.6673C13.9496 1.48872 13.3647 2.07359 13.3647 2.79137V13.691H11.876V2.79137C11.876 1.24947 13.1254 0 14.6673 0H22.749C24.2909 0 25.5404 1.24947 25.5404 2.79137V16.4558C25.5404 17.9977 24.2909 19.2471 22.749 19.2471Z" fill="#5F33E1" />
                                                    <path d="M21.9531 4.12109H15.626V5.60982H21.9531V4.12109Z" fill="#5F33E1" />
                                                    <path d="M21.9531 7.7627H15.626V9.25142H21.9531V7.7627Z" fill="#5F33E1" />
                                                    <path d="M21.9531 11.4053H15.626V12.894H21.9531V11.4053Z" fill="#5F33E1" />
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className={styles.pagination}>
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        &lt;
                    </button>

                    {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={currentPage === pageNum ? styles.pageButtonActive : ""}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
}
