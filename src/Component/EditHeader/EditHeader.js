import React from 'react';
import styles from '../EditHeader/EditHeader.module.css';
import { useNavigate,useLocation } from 'react-router-dom';

const EditHeader = ({ title, agentName, }) => {
  const navigate=useNavigate();
  const location = useLocation();

    const handleBack = () => {
    if (location.pathname === '/edit-agent') {
      if(sessionStorage.getItem('naviateFrom')=='dashboard'){
          navigate('/');
      }else{
              navigate('/agent-detail');

      }
    } else {
      navigate(-1);
    }
  };
    return (
        <div className={styles.forSticky} onClick={handleBack}>
            <div className={styles.title}>
                <img
                    src='/svg/back-svg.svg'
                    alt='back-svg'
                    className={styles.backIcon}
                />
                <h2 >
                    <span className={styles.back}></span> {title}: <b>{agentName}</b>
                </h2>
            </div>
        </div>
    );
};

export default EditHeader;
