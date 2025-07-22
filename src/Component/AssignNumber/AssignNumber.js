import React, { useState, useEffect, useRef } from 'react';
import styles from '../AssignNumber/AssignNumber.module.css';
import HeaderBar from '../HeaderBar/HeaderBar';
import Modal2 from '../Modal2/Modal2';
import AnimatedButton from '../AnimatedButton/AnimatedButton';
import { useLocation } from 'react-router-dom';
import { createNumberOrder, fetchAgentDetailById, fetchAvailablePhoneNumberByCountry, getAgentById, updateAgent } from '../../Store/apiStore';
import Loader2 from '../Loader2/Loader2';
import axios from 'axios';
import PopUp from '../Popup/Popup';
const AssignNumber = () => {
    const location = useLocation();
    const stateInputRef = useRef(null);
    const cityInputRef = useRef(null);
    const [stateNameFull, setStateNameFull] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedLangCode, setSelectedLangCode] = useState('us');
    const [countryCode, setCountryCode] = useState('US');
    const [stateCode, setStateCode] = useState('');
    const [cityName, setCityName] = useState('');
    const [search, setSearch] = useState('');
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [isRotating, setIsRotating] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [agent_id, setAgent_id] = useState("")
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const [voip_numbers, setVoip_numbers] = useState("")
    const debounceTimeoutRef = useRef(null);
    const requestVersion = useRef(0)
    const popupShownRef = useRef(false);
    const languages = [
        {
            name: "English (US)",
            locale: "en-US",
            countryCode: "US",
            countryName: "United States",
            flag: "/images/en-US.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "French (Canada)",
            locale: "fr-CA",
            countryCode: "CA",
            countryName: "Canada",
            flag: "/images/fr-CA.png",
            percentage: "—",
            stats: "—",
        },
        // {
        //     name: "English (UK)",
        //     locale: "en-GB",
        //     countryCode: "GB",
        //     countryName: "United Kingdom",
        //     flag: "/images/en-GB.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "English (Australia)",
        //     locale: "en-AU",
        //     countryCode: "AU",
        //     countryName: "Australia",
        //     flag: "/images/en-AU.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "English (New Zealand)",
        //     locale: "en-NZ",
        //     countryCode: "NZ",
        //     countryName: "New Zealand",
        //     flag: "/images/en-NZ.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "German",
        //     locale: "de-DE",
        //     countryCode: "DE",
        //     countryName: "Germany",
        //     flag: "/images/de-DE.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Dutch",
        //     locale: "nl-NL",
        //     countryCode: "NL",
        //     countryName: "Netherlands",
        //     flag: "/images/nl-NL.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Danish",
        //     locale: "da-DK",
        //     countryCode: "DK",
        //     countryName: "Denmark",
        //     flag: "/images/da-DK.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Finnish",
        //     locale: "fi-FI",
        //     countryCode: "FI",
        //     countryName: "Finland",
        //     flag: "/images/fi-FI.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Norwegian",
        //     locale: "no-NO",
        //     countryCode: "NO",
        //     countryName: "Norway",
        //     flag: "/images/no-NO.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Swedish",
        //     locale: "sv-SE",
        //     countryCode: "SE",
        //     countryName: "Sweden",
        //     flag: "/images/sv-SE.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Spanish (Spain)",
        //     locale: "es-ES",
        //     countryCode: "ES",
        //     countryName: "Spain",
        //     flag: "/images/es-ES.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "French (France)",
        //     locale: "fr-FR",
        //     countryCode: "FR",
        //     countryName: "France",
        //     flag: "/images/fr-FR.png",
        //     percentage: "—",
        //     stats: "—",
        // },

        // {
        //     name: "Italian",
        //     locale: "it-IT",
        //     countryCode: "IT",
        //     countryName: "Italy",
        //     flag: "/images/it-IT.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Portuguese (Portugal)",
        //     locale: "pt-PT",
        //     countryCode: "PT",
        //     countryName: "Portugal",
        //     flag: "/images/pt-PT.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Portuguese (Brazil)",
        //     locale: "pt-BR",
        //     countryCode: "BR",
        //     countryName: "Brazil",
        //     flag: "/images/pt-BR.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Catalan",
        //     locale: "ca-ES",
        //     countryCode: "ES",
        //     countryName: "Spain",
        //     flag: "/images/ca-ES.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Romanian",
        //     locale: "ro-RO",
        //     countryCode: "RO",
        //     countryName: "Romania",
        //     flag: "/images/ro-RO.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Polish",
        //     locale: "pl-PL",
        //     countryCode: "PL",
        //     countryName: "Poland",
        //     flag: "/images/pl-PL.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Russian",
        //     locale: "ru-RU",
        //     countryCode: "RU",
        //     countryName: "Russia",
        //     flag: "/images/ru-RU.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Bulgarian",
        //     locale: "bg-BG",
        //     countryCode: "BG",
        //     countryName: "Bulgaria",
        //     flag: "/images/bg-BG.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Slovak",
        //     locale: "sk-SK",
        //     countryCode: "SK",
        //     countryName: "Slovakia",
        //     flag: "/images/sk-SK.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Greek",
        //     locale: "el-GR",
        //     countryCode: "GR",
        //     countryName: "Greece",
        //     flag: "/images/el-GR.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Hungarian",
        //     locale: "hu-HU",
        //     countryCode: "HU",
        //     countryName: "Hungary",
        //     flag: "/images/hu-HU.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Japanese",
        //     locale: "ja-JP",
        //     countryCode: "JP",
        //     countryName: "Japan",
        //     flag: "/images/ja-JP.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Korean",
        //     locale: "ko-KR",
        //     countryCode: "KR",
        //     countryName: "South Korea",
        //     flag: "/images/ko-KR.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Chinese (Mandarin)",
        //     locale: "zh-CN",
        //     countryCode: "CN",
        //     countryName: "China",
        //     flag: "/images/zh-CN.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Vietnamese",
        //     locale: "vi-VN",
        //     countryCode: "VN",
        //     countryName: "Vietnam",
        //     flag: "/images/vi-VN.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Indonesian",
        //     locale: "id-ID",
        //     countryCode: "ID",
        //     countryName: "Indonesia",
        //     flag: "/images/id-ID.png",
        //     percentage: "—",
        //     stats: "—",
        // },
        // {
        //     name: "Turkish",
        //     locale: "tr-TR",
        //     countryCode: "TR",
        //     countryName: "Turkey",
        //     flag: "/images/tr-TR.png",
        //     percentage: "—",
        //     stats: "—",
        // },
    ];
    useEffect(() => {
        const fetchCountryCode = async () => {
            try {
                const res = await axios.get('https://ipwho.is/');
                const data = res?.data;
                if (data && data.country_code) {
                    //   setIpData(data);
                    console.log(data, "HEL")
                    //   setCountryCode(data.country_code.toLowerCase());
                }
            } catch (err) {
                console.error('Failed to fetch IP location:', err);
            }
        };
        fetchCountryCode();
    }, []);
    const selectedLang = languages.find((l) => l.countryCode === countryCode);
    const initAutocomplete = (el, setValue, types) => {
        if (!window.google?.maps?.places) return;
        const ac = new window.google.maps.places.Autocomplete(el, {
            types: [types],
            fields: ['address_components'],
        });
        ac.addListener('place_changed', () => {
            const place = ac.getPlace();
            (place.address_components || []).forEach((c) => {
                if (types === '(regions)' && c.types.includes('administrative_area_level_1')) {
                    setStateCode(c.short_name);
                    setStateNameFull(c.long_name); // for display

                } else if (types === '(regions)' && c.types.includes('locality')) {
                    setCityName(c.long_name);

                }
            });
        });
    };
    useEffect(() => {
        initAutocomplete(stateInputRef.current, setStateCode, '(regions)');
        initAutocomplete(cityInputRef.current, setCityName, '(regions)');
    }, []);
    useEffect(() => {
        setAgent_id(location.state?.agent?.agent_id)
        const businessDetails = location.state?.business
        const business = location.state?.agent?.business || businessDetails;
        if (business) {
            setCountryCode(business.country_code || 'US');
            setStateCode(business.state_code || '');
            setCityName(business.city || '');
            setStateNameFull(business.state)
        }
    }, [location]);
    const fetchNumbersWithFallback = async () => {
        // if (!countryCode || !stateCode) return;
        const currentVersion = ++requestVersion.current
        setLoading(true);
        setShowPopup(false)
        try {
            // First attempt: Country + State + City
            const res = await fetchAvailablePhoneNumberByCountry(countryCode, cityName, stateCode);
            if (requestVersion.current !== currentVersion) return;
            if (res?.success && res?.data?.length > 0) {
                setAvailableNumbers(res.data);
                console.log(" Got numbers using city+state+country");
            } else {
                // Fallback: Country + State (without city)
                console.log(" No data with city. Trying state only...");
                const fallbackRes = await fetchAvailablePhoneNumberByCountry(countryCode, "", stateCode);

                if (fallbackRes?.success && fallbackRes?.data?.length > 0) {
                    setTimeout(() => {
                        setCityName("")

                    }, 3000);
                    setAvailableNumbers(fallbackRes.data);
                    console.log(" Got numbers using state+country only");
                } else {

                    if (!popupShownRef.current) {
                        setShowPopup(true);
                        setPopupType("failed");
                        setPopupMessage(
                            "No numbers found for the selected state. Please select another state or try different location."
                        );
                        popupShownRef.current = true;
                    }
                    setAvailableNumbers([]);
                }
            }
        } catch (err) {
            console.error(" Error while fetching:", err);
            if (requestVersion.current === currentVersion) {
                setAvailableNumbers([]);
            }
        } finally {
            if (requestVersion.current === currentVersion) {
                setLoading(false);
            }
        }
    };
    useEffect(() => {
        fetchNumbersWithFallback();
    }, [countryCode, cityName, stateCode]);
    const filteredNumbers = availableNumbers.filter((i) =>
        i.phone_number.includes(search.trim())
    );
    const handleRefresh = async () => {
        setIsRotating(true);
        // Generate random digit (1 to 9) as string
        const getRandomDigit = () => Math.floor(Math.random() * 9 + 1).toString();
        const startsWith = getRandomDigit();
        const endsWith = getRandomDigit();
        try {
            // First: Try with city + state + country
            const res = await fetchAvailablePhoneNumberByCountry(countryCode, cityName, stateCode, startsWith, endsWith);
            if (res?.success) {
                setAvailableNumbers(res.data);
            } else {
                // Fallback: Try with state + country only  
                const fallbackRes = await fetchAvailablePhoneNumberByCountry(countryCode, cityName, stateCode);
                if (fallbackRes?.success && fallbackRes?.data?.length > 0) {
                    setAvailableNumbers(fallbackRes.data);
                } else {
                    setAvailableNumbers([]);
                    console.log(" No numbers found even with fallback.");
                }
            }
        } catch (error) {
            console.error(" Error in handleRefresh:", error);
            setAvailableNumbers([]);
        } finally {
            setIsRotating(false);
        }
    };
    const handleNumberClick = (num) => {
        setSelectedNumber(num);
        setModalOpen(true);
    };
    const handleBuyNumber = async () => {
        try {
            setLoading(true)
            const response = await createNumberOrder(selectedNumber, agent_id)
            console.log(response)
            await updateAgent(agent_id, { voip_numbers: [selectedNumber] });
            setShowPopup(true)
            setPopupType("success")
            setPopupMessage("Number assigned successfully")
            setLoading(false)
            fetchAgentDetailsById()

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            if (stateCode && countryCode) {
                fetchNumbersWithFallback();
            }
        }, 600); // Wait 600ms after the user stops typing
    }, [cityName, stateNameFull]);
    useEffect(() => {
        popupShownRef.current = false;
    }, [stateCode])
    const fetchAgentDetailsById = async () => {
        try {
            const response = await getAgentById(location.state?.agent?.agent_id);
            setVoip_numbers(response?.data?.voip_numbers)
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchAgentDetailsById()
    }, [])
    return (
        <div className={styles.AssignNumberMain}>
            <div className={styles.devHeadbar}>
                <HeaderBar title="Assign Number" />
                <div className={styles.dropdownWrapper}>
                    <div className={styles.dropdown} onClick={() => setOpen(!open)}>
                        <img src={`https://flagcdn.com/w80/${selectedLang.locale
                            ?.split("-")[1]
                            ?.toLowerCase()}.png`} alt={selectedLang.label} className={styles.flagIcon} />
                        <span className={styles.arrow}>
                            <img src="/svg/down-arrow.svg" alt="▼" />
                        </span>
                    </div>
                    {open && (
                        <ul className={styles.dropdownMenu}>
                            {languages.map((lang) => (
                                <li key={lang.countryCode} onClick={() => {
                                    setCountryCode(lang.countryCode);
                                    setSelectedLangCode(lang.countryCode);
                                    setCityName("");
                                    setStateCode("");
                                    setStateNameFull("");
                                    setSearch("");
                                    setAvailableNumbers([]);
                                    setOpen(false);

                                    fetchNumbersWithFallback();

                                }}>
                                    <img
                                        src={`https://flagcdn.com/w80/${lang.locale
                                            ?.split("-")[1]
                                            ?.toLowerCase()}.png`}
                                        alt={lang.name}
                                        className={styles.flagIcon}
                                    />
                                    <span>{lang.countryName}</span>
                                </li>
                            ))}

                        </ul>
                    )}
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.filters}>
                    <div className={styles.inputGroupSmall}>
                        <label className={styles.inputLabel}>State/Province</label>
                        <input
                            ref={stateInputRef}
                            type="text"
                            placeholder="State"
                            className={styles.inputBox}
                            value={stateNameFull}
                            onChange={(e) => setStateNameFull(e.target.value)}
                            onBlur={() => fetchNumbersWithFallback()}
                        />
                    </div>
                    <div className={styles.inputGroupLarge}>
                        <label className={styles.inputLabel}>City</label>
                        <input
                            ref={cityInputRef}
                            type="text"
                            placeholder="City"
                            className={styles.inputBox}
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            onBlur={() => fetchNumbersWithFallback()}
                        />
                    </div>
                </div>

                <div className={styles.searchSection}>
                    <input
                        type="text"
                        placeholder="Search number for Agent"
                        className={styles.searchInput}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        className={`${styles.refreshBtn} ${isRotating ? styles.rotate : ''}`}
                        onClick={handleRefresh}
                    >
                        <img src="/svg/refresh-svg.svg" alt="Refresh" />
                    </button>
                </div>

                <div className={styles.numberList}>
                    {loading ? <><Loader2 /></> : filteredNumbers.length ? (
                        filteredNumbers.map((item) => (
                            <label
                                key={item.phone_number}
                                className={styles.phoneItem}
                                onClick={() => handleNumberClick(item.phone_number)}
                            >
                                <input
                                    type="radio"
                                    name="agentNumber"
                                    value={item.phone_number}
                                    checked={selectedNumber === item.phone_number}
                                    onChange={() => setSelectedNumber(item.phone_number)}
                                />
                                <span className={styles.customRadio}></span>
                                <span className={styles.numbers}>{item.phone_number}</span>
                            </label>
                        ))
                    ) : (
                        <div className={styles.noData}>No data found</div>
                    )}
                </div>

                <Modal2 isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>Confirm Phone Number</h2>
                        <p className={styles.assignText}>
                            You have chosen to <br />
                            assign{' '}
                            <span className={styles.phoneNumber}>{selectedNumber}</span> to your:
                        </p>
                        <div className={styles.infoRow}>
                            <img src="/svg/green-check.svg" alt="check" />
                            <span>
                                <strong>Agent Name:</strong> {location.state?.agent?.agentName}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <img src="/svg/green-check.svg" alt="check" />
                            <span>
                                <strong>Business:</strong>{location.state?.agent?.business?.businessName}
                            </span>
                        </div>
                        <div className={styles.disclaimerBox}>
                            <img src="/svg/warning-svg.svg" alt="warning" />
                            <span>
                                <strong>Disclaimer:</strong> You will not be able to change this phone
                                number in current billing cycle.
                            </span>
                        </div>
                        <div className={styles.assignBtn}>
                            <AnimatedButton disabled={!!voip_numbers} isLoading={loading} label="Assign Number" onClick={handleBuyNumber} position={{ position: 'relative' }} />
                        </div>
                    </div>
                </Modal2>
            </div>

            {showPopup && (
                <PopUp
                    type={popupType}
                    onClose={() => setShowPopup(false)}
                    message={popupMessage}
                    renderHTML={true}
                />
            )}
        </div>
    );
};

export default AssignNumber;
