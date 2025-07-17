import React from 'react'
import styles from '../MySubscription/MySubscription.module.css'

const MySubscription = ({ agents }) => {
    console.log('agentdsdsdsds', agents)
    if (!agents || agents.length === 0) {
        return (
            <div className={styles.cardWrapper}>
                <h3 className={styles.heading}>My Subscriptions</h3>
                <p className={styles.noData}>No subscriptions found.</p>
            </div>
        );
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    const currencyMap = {
        USD: "$",
        INR: "₹",
        EUR: "€",
        GBP: "£",
        AUD: "A$",
        CAD: "C$",
    };

    function formatCurrency(amount, currency) {
        const currencyMap = {
            USD: "$",
            INR: "₹",
            EUR: "€",
            GBP: "£",
            AUD: "A$",
            CAD: "C$",
        };

        const symbol = currencyMap[currency?.toUpperCase()] || "";
        const formattedAmount = Number(amount).toLocaleString();

        return `${currency?.toUpperCase() || "USD"} ${symbol}${formattedAmount}`;
    }

    function parseMetadata(metadata) {
        try {
            return typeof metadata === "string" ? JSON.parse(metadata) : metadata;
        } catch (e) {
            console.error("Failed to parse metadata:", e);
            return {};
        }
    }


    return (

        <div className={styles.cardWrapper}>
            <h3 className={styles.heading}>My Subscriptions</h3>
            {agents?.map((agent) => (
                <div className={styles.MySubscriptionInfo}>
                    <div className={styles.row}>
                        <div className={styles.idDiv}>
                            <p className={styles.label1}>Agent Code:</p>
                            <p className={styles.valueBold}>{agent.agentCode ? agent.agentCode : "Na"}</p>
                        </div>
                        {/* <div className={styles.statusDiv}>
                        <div className={styles.Dot}></div>
                        <div className={styles.status}>{agent.isDeactivated === 0 ? "Active" : "Deactivated"}</div>
                    </div> */}
                        <div className={styles.statusDiv}>
                            <div
                                className={`${styles.Dot} ${agent.isDeactivated === 0 ? styles.activeDot : styles.deactivatedDot
                                    }`}
                            ></div>
                            <div
                                className={`${styles.status} ${agent.isDeactivated === 0 ? styles.activeStatus : styles.deactivatedStatus
                                    }`}
                            >
                                {agent.isDeactivated === 0 ? "Active" : "Inactive"}
                            </div>
                        </div>

                    </div>

                    <div className={styles.row2}>
                        <span className={styles.label}>Agent Name</span>
                        <span className={styles.value}>{agent?.agentName ? agent.agentName : "NA"}</span>
                    </div>
                    <div className={styles.row2}>
                        <span className={styles.label}>Business Name</span>
                        <span className={styles.value}>{agent?.business?.businessName ? agent?.business?.businessName : "NA"}</span>
                    </div>
                    <div className={styles.row2}>
                        <span className={styles.label}>Plan Activated</span>
                        <span className={styles.plan}> {agent?.latestSubscription?.plan_name ? agent?.latestSubscription?.plan_name : "Free"}</span>
                    </div>
                    <div className={styles.row2}>
                        <span className={styles.label}>Minutes Remaining</span>
                        <span className={styles.value}>{agent?.mins_left ? Math.floor(agent.mins_left / 60) : "NA"}</span>
                    </div>
                    <div className={styles.row2}>
                        <span className={styles.label}>Initial Purchase Date</span>
                        <span className={styles.value}>{agent?.latestSubscription?.current_period_start ? formatDate(agent?.latestSubscription?.current_period_start) : "Na"}</span>
                    </div>
                    <div className={styles.row2}>
                        <span className={styles.label}>Next Billing Date</span>
                        <span className={styles.valuebilling}>{agent?.latestSubscription?.next_renewal_date ? formatDate(agent?.latestSubscription?.next_renewal_date) : "Na"}</span>
                    </div>

                    <div className={styles.row2}>
                        <span className={styles.label}>Frequency & Price</span>

                        {agent?.latestSubscription && (
                            <span className={styles.frequencyprice}>
                                {formatCurrency(
                                    parseMetadata(agent.latestSubscription.metadata)?.original_plan_amount,
                                    agent.latestSubscription.plan_currency
                                )}{" "}
                                / {agent.latestSubscription.interval}
                            </span>
                        )}
                    </div>
                    <div className={styles.row2}>
                        <span className={styles.label}>Billed Date & Price:</span>

                        {agent?.latestSubscription && (
                            <span className={styles.frequencyprice}>
                                {formatCurrency(
                                    agent.latestSubscription.plan_unit_amount,
                                    agent.latestSubscription.plan_currency
                                )}{" "}
                                on {formatDate(agent.latestSubscription.current_period_start)}
                            </span>
                        )}
                    </div>







                </div>
            ))}
        </div>

    )
}

export default MySubscription
