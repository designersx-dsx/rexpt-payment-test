// pages/index.js

import { useState } from "react";
import styles from "./TotalsCallsList.module.css";
import HeaderFilter from "../HeaderFilter/HeaderFilter";


const callsData = [
    { time: "12:06 pm", date: "28 May 2025", duration: "04 min", from: "+91 9874XXXX88", fromColor: "fromRed", name: "Ajay" },
    { time: "11:15 pm", date: "27 May 2025", duration: "24 sec", from: "+91 9874XXXX88", fromColor: "fromGreen", name: "Nitish" },
    { time: "10:06 am", date: "27 May 2025", duration: "15 min", from: "+91 9874XXXX88", fromColor: "fromYellow", name: "Gaurav" },
    { time: "05:06 pm", date: "25 May 2025", duration: "24 min", from: "+91 9874XXXX88", fromColor: "fromRed", name: "Moni" },
    { time: "09:06 am", date: "23 May 2025", duration: "19 min", from: "+91 9874XXXX88", fromColor: "fromGreen", name: "Nitish" },
    { time: "10:15 pm", date: "23 May 2025", duration: "07 min", from: "+91 9874XXXX88", fromColor: "fromYellow", name: "Vinoc" },
    { time: "04:06 am", date: "22 May 2025", duration: "18 sec", from: "+91 9874XXXX88", fromColor: "fromRed", name: "Shrey" },
    { time: "12:30 pm", date: "22 May 2025", duration: "12 min", from: "+91 9874XXXX88", fromColor: "fromGreen", name: "Sahil" },
];

const options = [
    {
        id: 1,
        label: 'All',
        imageUrl: 'svg/ThreOpbtn.svg'
    },
    {
        id: 2,
        label: 'Positive',
        imageUrl: 'svg/greendot.svg'
    },
    {
        id: 3,
        label: 'Neutral',
        imageUrl: 'svg/yellodot.svg'
    },
    {
        id: 3,
        label: 'Negative',
        imageUrl: 'svg/reddot.svg'
    }
];


const callsPerPage = 6;


export default function Home() {

    const [selected, setSelected] = useState(options[0]);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(callsData.length / callsPerPage);

    // Slice callsData to show only the current page's calls
    const indexOfLastCall = currentPage * callsPerPage;
    const indexOfFirstCall = indexOfLastCall - callsPerPage;
    const currentCalls = callsData.slice(indexOfFirstCall, indexOfLastCall);
    const [isOpen, setIsOpen] = useState(false);

    // Change page handler
    const handlePageChange = (pageNum) => {
        if (pageNum < 1 || pageNum > totalPages) return;
        setCurrentPage(pageNum);
    };



    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Header */}
<HeaderFilter/>

              
                {/* Date and Agent */}


                {/* Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th>Date & time</th>
                                <th>Duration</th>
                                <th>From</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {currentCalls.map((call, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className={styles.callDateTime}>
                                            <div>{call.time}</div>
                                            <div className={styles.callDate}>{call.date}</div>
                                        </div>
                                    </td>
                                    <td>{call.duration}</td>
                                    <td>
                                        <p className={`${styles.fromNumber} ${styles[call.fromColor]}`}>{call.from}</p>

                                    </td>
                                    <td className={styles.CallName}>{call.name}</td>
                                    <td><div className={styles.actionIcons}>
                                        <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19.8254 17.0938L16.9809 14.2493C15.9707 13.2391 14.2427 13.6378 13.8173 14.9671C13.5249 15.8709 12.4881 16.4026 11.5842 16.1899C9.5638 15.6848 6.79901 13.0264 6.29391 10.8996C6.00148 9.99576 6.58634 8.95896 7.51679 8.66653C8.84601 8.26777 9.24478 6.53979 8.23458 5.50299L5.39004 2.65845C4.56592 1.94067 3.36962 1.94067 2.65184 2.65845L0.711169 4.59911C-1.2295 6.61953 0.923848 12.0162 5.68247 16.8014C10.4411 21.5866 15.8377 23.8197 17.8847 21.7727L19.8254 19.832C20.5432 19.0345 20.5432 17.8116 19.8254 17.0938Z" fill="#B5A0F3" />
                                            <path d="M22.749 19.2471H21.5527V17.7584H22.749C23.4668 17.7584 24.0517 17.1736 24.0517 16.4558V2.79137C24.0517 2.07359 23.4668 1.48872 22.749 1.48872H14.6673C13.9496 1.48872 13.3647 2.07359 13.3647 2.79137V13.691H11.876V2.79137C11.876 1.24947 13.1254 0 14.6673 0H22.749C24.2909 0 25.5404 1.24947 25.5404 2.79137V16.4558C25.5404 17.9977 24.2909 19.2471 22.749 19.2471Z" fill="#5F33E1" />
                                            <path d="M21.9531 4.12109H15.626V5.60982H21.9531V4.12109Z" fill="#5F33E1" />
                                            <path d="M21.9531 7.7627H15.626V9.25142H21.9531V7.7627Z" fill="#5F33E1" />
                                            <path d="M21.9531 11.4053H15.626V12.894H21.9531V11.4053Z" fill="#5F33E1" />
                                        </svg>

                                     


                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div>
                <div className={styles.pagination}>
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
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

                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                    </button>
                </div>
                </div>
            </div>
        </div>
    );
}
