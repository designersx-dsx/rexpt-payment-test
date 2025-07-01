import { useEffect, useState } from 'react';
import { getUserAgentLimitStatus } from '../Store/apiStore';
import decodeToken from '../lib/decodeToken';

const useCheckAgentCreationLimit = (userId) => {
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const [CheckingUserLimit, setCheckingUserLimit] = useState(false);


  // useEffect(() => {
  //   const checkLimit = async () => {
  //     try {
  //       const isExceeded = await getUserAgentLimitStatus(userId); // returns true/false
  //       setIsLimitExceeded(isExceeded?.limitExceeded);
  //       // console.log('isAgentCreationLimitExceeded:', isExceeded?.limitExceeded);
  //     } catch (error) {
  //       console.error("Error checking agent limit:", error);
  //       setIsLimitExceeded(false); // fallback behavior
  //     } finally {
  //       setCheckingUserLimit(false);
  //     }
  //   };
    
  //   checkLimit();
  // }, [userId]);
  

  return { isLimitExceeded, CheckingUserLimit };
};

export default useCheckAgentCreationLimit;
