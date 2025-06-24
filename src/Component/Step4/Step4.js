import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import styles from '../Step4/Step4.module.css'
import PopUp from '../Popup/Popup';
import AgentCreationLoader from '../Popup/AgentCreationLoader';
const roles = [
    {
        title: 'General Receptionist',
        description: 'Ready to handle all Inbound calls',
        icon: 'svg/general-receptionist.svg',
    },
    {
        title: 'Inbound LEAD Qualifier',
        description: 'Handle inbound sales queries',
        icon: 'svg/sales receptionist.svg',
    },
    // {
    //     title: 'Technical Support Agent',
    //     description: 'Product/Service Tech support',
    //     icon: 'svg/technical-receptionist.svg',
    // },
];
const Step4 = forwardRef(({ onNext, onBack, onValidationError, loading, setLoading, detectRoleTypeChange }, ref) => {
    const [selectedRole, setSelectedRole] = useState('');
    useEffect(() => {
        const updationMode = localStorage.getItem("UpdationMode") === "ON";
        const storedAgentRole = localStorage.getItem('agentRole');

        if (updationMode) {
            setSelectedRole(storedAgentRole)
        } else {
            setSelectedRole(storedAgentRole)
        }
    }, [])

    useEffect(() => {
        sessionStorage.setItem('agentRole', selectedRole)
    }, [selectedRole])
    useImperativeHandle(ref, () => ({
        validate: () => {
            if (!selectedRole.trim()) {
                onValidationError?.({
                    type: "failed",
                    message: "Please select a type!"
                });
                return false;
            }

            return true;
        },
    }));
    return (
        <>
            <div className={`${styles.container} ${loading ? styles.blocked : ''}`}>
                {

                    roles.map((role, index) => (
                        <label
                            key={index}
                            className={`${styles.card} ${selectedRole === role.title ? styles.selected : ''
                                }`}
                        >
                            <div className={styles.iconBox}>
                                <img src={role.icon} alt={role.title} className={styles.icon} />
                            </div>
                            <div className={styles.info}>
                                <p className={styles.title}>{role.title}</p>
                                <p className={styles.description}>{role.description}</p>
                            </div>
                            <input
                                type="radio"
                                name="receptionist"
                                value={role.title}
                                checked={selectedRole === role.title}
                                onChange={() => {
                                    setSelectedRole(role.title)
                                    detectRoleTypeChange(role.title);
                                }}
                                className={styles.radio}
                            />
                            <span className={styles.customRadio}></span>
                        </label>
                    ))}

            </div>
        </>

    )
})

export default Step4
