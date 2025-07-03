import React, { useEffect } from 'react';
import styles from './Thankyou.module.css';
import { useNavigate, useParams } from 'react-router-dom';

function Thankyou() {
  const navigate = useNavigate();
let params = useParams()
let key = params.id
console.log(key)
  useEffect(() => {
    const timer = setTimeout(() => {
        if(key==="create" ){
  navigate('/steps' ,   {
            state: {
                locationPath : '/checkout'
            }
        }); 
        }
        else if(key ==="update"){
 navigate('/dashboard'); 
        }
    
    }, 3000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>🎉 Thank You!</h1>
        <p className={styles.subtext}>Redirecting for agent creation...</p>
      </div>
    </div>
  );
}

export default Thankyou;
