import React, { useEffect, useState } from 'react';
import styles from '../BusinessLocation/BusinessLocation.module.css';
import { useNavigate } from 'react-router-dom';
import PopUp from '../Popup/Popup';
import axios from 'axios';
import { API_BASE_URL } from '../../Store/apiStore';
import decodeToken from '../../lib/decodeToken';
import { getData } from 'country-list';
import ReactCountryFlag from "react-country-flag";
import Loader from '../Loader/Loader';
import { useAgentCreator } from '../../hooks/useAgentCreator';
const BusinessLocation = () => {
  const countries = getData();
  const navigate = useNavigate();
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [loading, setLoading] = useState(false)
  // Inline validation error states
  const [stateError, setStateError] = useState('');
  const [cityError, setCityError] = useState('');
  const [address1Error, setAddress1Error] = useState('');
  const [address2Error, setAddress2Error] = useState('');

  // Submission flags
  const [stateSubmitted, setStateSubmitted] = useState(false);
  const [citySubmitted, setCitySubmitted] = useState(false);
  const [address1Submitted, setAddress1Submitted] = useState(false);
  const [address2Submitted, setAddress2Submitted] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('error');
  const sessionBusinessiD = sessionStorage.getItem("bId")
  const businessId1 = sessionBusinessiD?.businessId;
  const businessId = sessionBusinessiD || sessionBusinessiD?.businessId;
  const token = localStorage.getItem('token');
  const decodeTokenData = decodeToken(token);
  const userId = decodeTokenData?.id;

  const [countryCode, setCountryCode] = useState('');
  const [ipData, setIpData] = useState({});
  const stepEditingMode = localStorage.getItem('UpdationModeStepWise')
  const EditingMode = localStorage.getItem('UpdationMode')
  const setHasFetched = true
  const { handleCreateAgent } = useAgentCreator({
    stepValidator: () => "BusinessLocation", // or custom validation
    setLoading,
    setPopupMessage,
    setPopupType,
    setShowPopup,
    navigate,
    setHasFetched,
  });
  // console.log('loading',loading)
  useEffect(() => {
    const businessLocation = JSON.parse(sessionStorage.getItem('businessLocation'));
    if (businessLocation) {
      setState(businessLocation.state || '');
      setCity(businessLocation.city || '');
      setAddress1(businessLocation.address1 || '');
      setAddress2(businessLocation.address2 || '');
    }
  }, []);

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const res = await axios.get('https://ipwho.is/');
        const data = res?.data;
        if (data && data.country_code) {
          setIpData(data);
          setCountryCode(data.country_code.toLowerCase());
        }
      } catch (err) {
        console.error('Failed to fetch IP location:', err);
      }
    };
    fetchCountryCode();
  }, []);

  const containsEmoji = (text) => {
    return /[\p{Emoji_Presentation}\u200d]/u.test(text);
  };

  const validateState = (value) => {
    if (!value.trim()) return 'State is required.';
    if (containsEmoji(value)) return 'Emojis are not allowed in state.';
    // if (/[^a-zA-Z\s.-]/.test(value)) return 'State contains invalid characters.';
    return '';
  };

  const validateCity = (value) => {
    if (!value.trim()) return 'City is required.';
    if (containsEmoji(value)) return 'Emojis are not allowed in city.';
    // if (/[^a-zA-Z\s.-]/.test(value)) return 'City contains invalid characters.';
    return '';
  };

  const validateAddress = (value, fieldName) => {
    if (!value.trim()) return `${fieldName} is required.`;
    if (containsEmoji(value)) return `Emojis are not allowed in ${fieldName.toLowerCase()}.`;
    if (/[^a-zA-Z0-9\s,.\-#/]/.test(value))
      // return `${fieldName} contains invalid characters.`;
      return '';
  };
  const handleStateChange = (e) => {
    const val = e.target.value;
    setState(val);
    if (stateSubmitted) setStateError(validateState(val));
    else setStateError('');
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    setCity(val);
    if (citySubmitted) setCityError(validateCity(val));
    else setCityError('');
  };

  const handleAddress1Change = (e) => {
    const val = e.target.value;
    setAddress1(val);
    if (address1Submitted) setAddress1Error(validateAddress(val, 'Address line 1'));
    else setAddress1Error('');
  };

  const handleAddress2Change = (e) => {
    const val = e.target.value;
    setAddress2(val);
  };
  const handleContinue = async () => {
    setStateSubmitted(true);
    setCitySubmitted(true);
    setAddress1Submitted(true);
    setAddress2Submitted(true);

    const sError = validateState(state);
    const cError = validateCity(city);
    const a1Error = validateAddress(address1, 'Address line 1');
    // const a2Error = validateAddress(address2, 'Address line 2');

    setStateError(sError);
    setCityError(cError);
    setAddress1Error(a1Error);
    // setAddress2Error(a2Error);

    if (sError || cError || a1Error) return;

    sessionStorage.setItem(
      'businessLocation',
      JSON.stringify({
        country: selected?.name || ipData?.country_name || 'United States',
        state: state.trim(),
        city: city.trim(),
        address1: address1.trim(),
        address2: address2.trim(),
      })
    );
    try {
      setLoading(true);

      const locationData = JSON.parse(sessionStorage.getItem('businessLocation'));
      const businessDetails = JSON.parse(sessionStorage.getItem('businessDetails'));
      // const customServices = sessionStorage.getItem('selectedCustomServices') || []; 
      const businesServices = JSON.parse(sessionStorage.getItem('businesServices'))
      const rawCustomServices = JSON.parse(sessionStorage.getItem('selectedCustomServices')) || [];
      const cleanedCustomServices = rawCustomServices
        .map(item => item?.service?.trim())
        .filter(Boolean)
        .map(service => ({ service }));


      let response;
      if (localStorage.getItem('UpdationMode') != "ON") {
        response = await axios.post(`${API_BASE_URL}/businessDetails/create`, {
          userId,
          businessName: businessDetails?.businessName,
          businessSize: businessDetails.businessSize,
          businessType: businessDetails.businessType,
          buisnessEmail: businessDetails?.email,
          // buisnessService: [...businessDetails?.selectedService, ...customServices],  
          buisnessService: cleanServiceArray(),
          customServices: cleanedCustomServices,
          address1: locationData.address1,
          address2: locationData.address2,
          city: locationData.city,
          state: locationData.state,
          country: locationData.country,
          zip: locationData.zip,
        });
      } else {
        response = await axios.patch(`${API_BASE_URL}/businessDetails/updateBusinessDetailsByUserIDandBuisnessID/${userId}?businessId=${sessionBusinessiD}`, {
          businessName: businessDetails?.businessName,
          businessSize: businessDetails.businessSize,
          businessType: businessDetails.businessType,
          buisnessEmail: businessDetails?.email,
          // buisnessService: [...businessDetails?.selectedService, ...customServices], 
          buisnessService: cleanServiceArray(),
          customServices: cleanedCustomServices,
          address1: locationData.address1,
          address2: locationData.address2,
          city: locationData.city,
          state: locationData.state,
          country: locationData.country,
          zip: locationData.zip,
        });
      }

      const id = response.data.businessId;
      // console.log('Response from the server:', response);

      sessionStorage.setItem(
        'businessId',
        JSON.stringify({
          businessId: id,
        })
      );

      setPopupType('success');
      setPopupMessage('Business details added successfully');
      setShowPopup(true);

      setTimeout(() => {
        navigate('/about-business');
      }, 2000);
    } catch (error) {
      setPopupType('failed');
      setPopupMessage('An error occurred while adding business details.');
      setShowPopup(true);
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };
  const [selected, setSelected] = useState(countries[0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (search) {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
      setOpen(false);
    }
  }, [search, countries]);

  const handleSelect = (country) => {
    setSelected(country);
    setSearch(country.name); // Autofill input with selected country name
    setOpen(false);
  };
  useEffect(() => {
    if (countryCode) {
      const sel = countries.find((country) => country?.code?.toLowerCase() === countryCode);
      if (sel) {
        setSelected(sel);
        setSearch(sel.name); // Autofill search input with country name

      }
    }
  }, [countryCode]);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    sessionStorage.setItem(
      'businessLocation',
      JSON.stringify({
        country: selected?.name || ipData?.country_name,
        state: state.trim(),
        city: city.trim(),
        address1: address1.trim(),
        address2: address2.trim(),
      })
    );

    setTimeout(() => {
      handleCreateAgent();
    }, 800)
    setLoading(false)

  };

  return (
    <div>
      <div className={styles.container}>
        <h2 className={styles.title}>{EditingMode ? 'Edit: Business Location Details' : 'Business Location Details'}</h2>


        {/* <div className={styles.countryInput}>
          <div className={styles.countryDiv}>
            <img
              src={`https://flagcdn.com/${countryCode}.svg`}
              alt={`${ipData?.country} Flag`}
              className={styles.flag}
            />
          </div>
          <span>{ipData?.country}</span>
        </div> */}

        {/* Ankush Code Start */}
        {/* <label className={styles.label}>Country</label>

        <div
          className={styles.dropdown}
          onClick={() => setOpen(!open)}
          tabIndex={0}
          onBlur={() => setOpen(false)}
        >
          <div className={styles.selected}>
            <div className={styles.selectedInfo}>
    
              <ReactCountryFlag countryCode={selected.code} svg style={{ width: '2em', height: '2em' }} className={styles.flag} />
      
              <span>{selected.name}</span>
            </div>
            <span className={styles.arrow}>{open ? <img src='svg/drop-Arrow.svg' /> : <img src='svg/up-arrow.svg' alt='' />}</span>
          </div>

          {open && (
            <ul className={styles.options}>
              {countries.map((country) => (
                <li
                  key={country.code}
                  onClick={() => handleSelect(country)}
                  className={styles.option}
                >
       
                  <ReactCountryFlag countryCode={country.code} svg style={{ width: '2em', height: '2em' }} className={styles.flag}/>
                  <span>{country.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div> */}
        <label className={styles.label}>Country<span className={styles.requiredField}> *</span></label>
        <div className={styles.dropdown} tabIndex={0}>
          <div className={styles.selected}>
            <div className={styles.selectedInfo}>
              {selected && (
                <ReactCountryFlag
                  countryCode={selected.code}
                  svg
                  style={{ width: '2em', height: '2em' }}
                  className={styles.flag}
                />
              )}
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
                placeholder="Type country or initials"
                className={styles.input2}
                onClick={() => setOpen(true)} // Open dropdown on input click
              />
            </div>
          </div>
          {open && (
            <ul className={styles.options}>
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <li
                    key={country.code}
                    onClick={() => handleSelect(country)}
                    className={styles.option}
                  >
                    <ReactCountryFlag
                      countryCode={country.code}
                      svg
                      style={{ width: '2em', height: '2em' }}
                      className={styles.flag}
                    />
                    <span>{country.name}</span>
                  </li>
                ))
              ) : (
                <li className={styles.option}>No countries found</li>
              )}
            </ul>
          )}
        </div>
        {/* Ankush Code end */}
        <div className={styles.labReq} >
          <div className={styles.Dblock} >
            <label className={styles.label}>State<span className={styles.requiredField}> *</span></label>
            <input
              type="text"
              placeholder="State"
              className={`${styles.input} ${stateError ? styles.inputError : ''}`}
              value={state}
              onChange={handleStateChange}
            /></div>

          {stateError && <p className={styles.inlineError}>{stateError}</p>}
        </div>
        <div className={styles.labReq} >
          <div className={styles.Dblock} >
            <label className={styles.label}>City <span className={styles.requiredField}> *</span></label>
            <input
              type="text"
              placeholder="City"
              className={`${styles.input} ${cityError ? styles.inputError : ''}`}
              value={city}
              onChange={handleCityChange}
            />
          </div>
          {cityError && <p className={styles.inlineError}>{cityError}</p>}
        </div>
        <div className={styles.labReq} >
          <div className={styles.Dblock} >

            <label className={styles.label}>Address line 1 <span className={styles.requiredField}> *</span></label>
            <input
              type="text"
              placeholder="First Address"
              className={`${styles.input} ${address1Error ? styles.inputError : ''}`}
              value={address1}
              onChange={handleAddress1Change}
            />
          </div>
          {address1Error && <p className={styles.inlineError}>{address1Error}</p>}
        </div>
        <div className={styles.labReq} >
          <div className={styles.Dblock} >

            <label className={styles.label}>Address line 2</label>
            <input
              type="text"
              placeholder="Second Address"
              className={`${styles.input} ${address2Error ? styles.inputError : ''}`}
              value={address2}
              onChange={handleAddress2Change}
            />  </div>
          {address2Error && <p className={styles.inlineError}>{address2Error}</p>}
        </div>
        {stepEditingMode != 'ON' ?
          <div>
            <div type="submit" onClick={handleContinue}>
              <div className={styles.btnTheme}>
                <img src="svg/svg-theme.svg" alt="" />
                <p>{loading ? <Loader size={20} /> : 'Continue'}</p>
              </div>
            </div>
          </div>
          :
          <div>
            <div type="submit" onClick={handleSaveEdit}>
              <div className={styles.btnTheme}>
                <img src="svg/svg-theme.svg" alt="" />
                <p>{loading ? <Loader size={20} /> : 'Save Edits'}</p>
              </div>
            </div>
          </div>
        }
      </div>

      {showPopup && (
        <PopUp type={popupType} message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default BusinessLocation;

const cleanServiceArray = () => {
  try {

    let raw
    if (localStorage.getItem('UpdationMode') != "ON") {
      raw = sessionStorage.getItem('businessDetails')
    } else {
      raw = raw = sessionStorage.getItem('businessDetails')
    }
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.selectedService)) {
      return parsed.selectedService;
    } else if (typeof parsed?.selectedService === 'object' && Array.isArray(parsed.selectedService.selectedService)) {
      return parsed.selectedService.selectedService;
    }
    return [];
  } catch {
    return [];
  }
}
