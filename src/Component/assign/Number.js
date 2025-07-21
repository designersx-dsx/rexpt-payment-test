import React, { useState, useEffect, useRef } from "react";
import "./Number.css";
import { useLocation } from "react-router-dom";
import { fetchAvailablePhoneNumberByCountry } from "../../Store/apiStore";

const Number = () => {
    const location = useLocation();
    const [selectedNumber, setSelectedNumber] = useState("");
    const [search, setSearch] = useState("");
    const [country_code, setCountry_code] = useState("");
    const [locality, setLocality] = useState("");
    const [administrative_area, setAdministrative_area] = useState("");
    const [availableNumbers, setAvailableNumbers] = useState([]);

    const stateInputRef = useRef(null);
    const cityInputRef = useRef(null);

    // Extract business details and set fields
    useEffect(() => {
        const businessDetails = location?.state?.agent?.business;
        const country = businessDetails?.country_code || "";
        const state = businessDetails?.state_code || "";
        const city = businessDetails?.city || "";

        setCountry_code(country);
        setLocality(state);
        setAdministrative_area(city);

        if (country && state && city) {
            fetchAvailablePhoneNumberByCountry(country_code, locality, administrative_area)
                .then((res) => {
                    setAvailableNumbers(res.data);
                    console.log(res.data, "numbers");
                })
                .catch((error) => {
                    console.error("Failed to fetch phone numbers:", error);
                });
        }
    }, [location]);

    // Init Autocomplete on state and city inputs
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.google?.maps?.places) {
                if (stateInputRef.current && cityInputRef.current) {
                    initAddressAutocomplete(stateInputRef.current, setLocality, "administrative_area_level_1");
                    initAddressAutocomplete(cityInputRef.current, setAdministrative_area, "locality");
                    clearInterval(interval);
                }
            }
        }, 300);
    }, []);

 const initAddressAutocomplete = (inputElement, setStateCode, setStateName, setCountryCode) => {
    const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
        types: ["(regions)"],
        fields: ["address_components", "formatted_address"],
    });

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const components = place.address_components || [];

        let stateCode = "";
        let stateName = "";
        let countryCode = "";

        components.forEach(component => {
            if (component.types.includes("administrative_area_level_1")) {
                stateCode = component.short_name;   // e.g., "OH"
                stateName = component.long_name;    // e.g., "Ohio"
            }

            if (component.types.includes("country")) {
                countryCode = component.short_name; // e.g., "US"
            }
        });

        if (setStateCode) setStateCode(stateCode);     // OH
        if (setStateName) setStateName(stateName);     // Ohio → this becomes your locality
        if (setCountryCode) setCountryCode(countryCode); // US
    });
};



    const filteredNumbers = availableNumbers.filter((item) =>
        item.phone_number.includes(search)
    );
    useEffect(() => {
        if (country_code || locality || administrative_area) {
            const delayDebounce = setTimeout(() => {
                fetchAvailablePhoneNumberByCountry(country_code, locality, administrative_area)
                    .then((res) => {
                        setAvailableNumbers(res.data);
                        console.log("Auto-fetched numbers:", res.data);
                    })
                    .catch((error) => {
                        console.error("Auto-fetch failed:", error);
                    });
            }, 300); // debounce to avoid rapid requests

            return () => clearTimeout(delayDebounce);
        }
    }, [locality, administrative_area, country_code]);

    return (
        <div className="container">
            {/* Header */}
            <div className="header">
                <h2>Assign Number</h2>
                <div className="country-select">
                    <span className="country-flag">🇺🇸</span>
                    <button className="dropdown-btn">▼</button>
                </div>
            </div>

            {/* Filters */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="State"
                    value={locality}
                    ref={stateInputRef}
                    onChange={(e) => setLocality(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={administrative_area}
                    ref={cityInputRef}
                    onChange={(e) => setAdministrative_area(e.target.value)}
                />
            </div>

            {/* Search and Refresh */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search number for Agent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="refresh-btn"
                    onClick={() => {
                        fetchAvailablePhoneNumberByCountry(country_code, locality, administrative_area)
                            .then((res) => {
                                setAvailableNumbers(res.data);
                            })
                            .catch((error) => {
                                console.error("Refresh failed:", error);
                            });
                    }}
                >
                    Refresh
                </button>
            </div>

            {/* Phone list */}
            <div className="phone-list">
                {filteredNumbers.map((item) => (
                    <label key={item.phone_number} className="phone-item">
                        <span>{item.phone_number}</span>
                        <input
                            type="radio"
                            name="phone"
                            checked={selectedNumber === item.phone_number}
                            onChange={() => setSelectedNumber(item.phone_number)}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
};

export default Number;
