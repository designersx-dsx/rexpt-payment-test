// import React from 'react'
// // const shareCode = async (code) => {
// //   // Ensure code is defined
// //   if (!code) {
// //     return;
// //   }

// //   const shareUrl = `https://rexpt.in?referral=${encodeURIComponent(code)}`;

// //   if (navigator.share) {
// //     try {
// //       await navigator.share({
// //         url: shareUrl, // Use resolved shareUrl
// //       });
// //     } catch (error) {
// //       console.error('Error sharing:', error);
// //       await navigator.clipboard.writeText(shareUrl);
// //     }
// //   } else {
// //     // Fallback for unsupported browsers
// //     try {
// //       await navigator.clipboard.writeText(shareUrl);
// //     } catch (err) {
// //       console.error('Copy failed:', err);
// //     }
// //   }
// // };

// const shareCode = async (code) => {
//   if (!code) {
//     console.error('No referral code provided');
//     return;
//   }

//   // Use localhost for dev, replace with production URL (e.g., https://rexpt.in) later
//   const shareUrl = `http://localhost:3000?referral=${encodeURIComponent(code)}`;

//   if (navigator.share) {
//     try {
//       await navigator.share({
//         url: shareUrl, // Clean URL with query parameter
//       });
//       console.log('Share URL:', shareUrl); // Debug
//     } catch (error) {
//       console.error('Error sharing:', error);
//       await navigator.clipboard.writeText(shareUrl);
//     }
//   } else {
//     try {
//       await navigator.clipboard.writeText(shareUrl);
//     } catch (err) {
//       console.error('Copy failed:', err);
//     }
//   }
// };

// const openGmail = () => {
//   window.location.href = 'googlegmail://';
// };
// function Test() {
//   return (
//     <div>
//        <button onClick={() => window.location.href = 'mailto:'}>Open mail</button>
//         <button  onClick={() => window.location.href = 'https://mail.google.com/mail/u/0/#inbox'}>Open gmail</button>
//         <button onClick={()=>shareCode('AJAYK_812312')}>Share Code</button>
//     </div>
//   )
// }

// export default Test

// import React, { useState } from 'react';

// function Test() {
//   // Assume user ka email input se mila hai (ya backend se)
//   const [userEmail, setUserEmail] = useState(''); // Example: user ka email yahan store hoga
//   const isGmail = userEmail.toLowerCase().endsWith('@gmail.com');
  
//   // OS detection
//   const userAgent = navigator.userAgent.toLowerCase();
//   const isAndroid = userAgent.includes('android');
//   const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');

//   const openGmail = () => {
//     const gmailAppLink = 'googlegmail:///'; // Gmail app deeplink
//     const gmailWebLink = 'https://mail.google.com/mail/u/0/#inbox'; // Gmail web inbox

//     if (isAndroid) {
//       // Try Gmail app
//       const iframe = document.createElement('iframe');
//       iframe.style.display = 'none';
//       iframe.src = gmailAppLink;
//       document.body.appendChild(iframe);

//       setTimeout(() => {
//         window.location.href = gmailWebLink; // Fallback to web if app doesn't open
//         document.body.removeChild(iframe);
//       }, 1000);
//     } else {
//       // Non-Android devices ke liye web link
//       window.location.href = gmailWebLink;
//     }
//   };

//   const openDefaultEmail = () => {
//     window.location.href = 'mailto:'; // Default email app kholega
//   };

//   return (
//     <div>
//       <h3>Enter Your Email</h3>
//       <input
//         type="email"
//         value={userEmail}
//         onChange={(e) => setUserEmail(e.target.value)}
//         placeholder="Enter your email"
//       />
//       <div style={{ marginTop: '20px' }}>
//         {/* Gmail button sirf tab dikhega jab email @gmail.com hai aur device Android hai */}
//         {isGmail && isAndroid ? (
//           <button onClick={openGmail}>Open Gmail</button>
//         ) : (
//           <div>
//             <button onClick={openGmail}>Open Gmail (Web)</button>
//             <button onClick={openDefaultEmail}>Open Default Email App</button>
//             <a href="https://outlook.live.com/mail/0/inbox" target="_blank">
//               <button>Open Outlook</button>
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Test;
import React, { useState } from 'react';

function Test() {
  // User ka email input se
  const [userEmail, setUserEmail] = useState('');
  const isGmail = userEmail.toLowerCase().endsWith('@gmail.com');

  // OS detection
  const userAgent = navigator.userAgent.toLowerCase();
  console.log(userAgent)
  const isAndroid = userAgent.includes('android');
  const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');

  const openGmail = () => {
    const gmailAppLink = 'googlegmail:///'; // Gmail app deeplink
    const gmailWebLink = 'https://mail.google.com/mail/u/0/#inbox'; // Gmail web inbox

    if (isAndroid) {
      // Try Gmail app
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = gmailAppLink;
      document.body.appendChild(iframe);

      setTimeout(() => {
        window.location.href = gmailWebLink ; // Fallback to web if app doesn't open
        document.body.removeChild(iframe);
      }, 1000);
    } else {
      // Non-Android devices ke liye web link
      window.location.href = gmailWebLink;
    }
  };

  const openAppleMail = () => {
    const appleMailLink = 'message://'; // iOS native Mail app deeplink
    const gmailWebLink = 'https://mail.google.com/mail/u/0/#inbox'; // Fallback to Gmail web

    if (isIOS) {
      // Try Apple Mail app
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = appleMailLink;
      document.body.appendChild(iframe);

      setTimeout(() => {
        window.location.href = gmailWebLink; // Fallback to web if app doesn't open
        document.body.removeChild(iframe);
      }, 1000);
    } else {
      // Non-iOS devices ke liye web link
      window.location.href = gmailWebLink;
    }
  };

  const openDefaultEmail = () => {
    window.location.href = 'mailto:'; // Default email app kholega (compose screen)
  };

  return (
    <div>
      <h3>Enter Your Email</h3>
      <input
        type="email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <div style={{ marginTop: '20px' }}>
        {isGmail && isAndroid ? (
          // Gmail button for Android + @gmail.com
          <button onClick={openGmail}>Open Gmail</button>
        ) :  isIOS ? (
          // Apple Mail button for iOS + @gmail.com
          <button onClick={openAppleMail}>Open Apple Mail</button>
        ) : (
          // Fallback options for other cases
          <div>
            <button onClick={openGmail}>Open Gmail (Web)</button>
            <button onClick={openDefaultEmail}>Open Default Email App</button>
            <a href="https://outlook.live.com/mail/0/inbox" target="_blank">
              <button>Open Outlook</button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Test;