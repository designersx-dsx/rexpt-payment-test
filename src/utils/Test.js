import React from 'react'
// const shareCode = async (code) => {
//   // Ensure code is defined
//   if (!code) {
//     return;
//   }

//   const shareUrl = `https://rexpt.in?referral=${encodeURIComponent(code)}`;

//   if (navigator.share) {
//     try {
//       await navigator.share({
//         url: shareUrl, // Use resolved shareUrl
//       });
//     } catch (error) {
//       console.error('Error sharing:', error);
//       await navigator.clipboard.writeText(shareUrl);
//     }
//   } else {
//     // Fallback for unsupported browsers
//     try {
//       await navigator.clipboard.writeText(shareUrl);
//     } catch (err) {
//       console.error('Copy failed:', err);
//     }
//   }
// };

const shareCode = async (code) => {
  if (!code) {
    console.error('No referral code provided');
    return;
  }

  // Use localhost for dev, replace with production URL (e.g., https://rexpt.in) later
  const shareUrl = `http://localhost:3000?referral=${encodeURIComponent(code)}`;

  if (navigator.share) {
    try {
      await navigator.share({
        url: shareUrl, // Clean URL with query parameter
      });
      console.log('Share URL:', shareUrl); // Debug
    } catch (error) {
      console.error('Error sharing:', error);
      await navigator.clipboard.writeText(shareUrl);
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }
};

const openGmail = () => {
  window.location.href = 'googlegmail://';
};
function Test() {
  return (
    <div>
       <button onClick={() => window.location.href = 'mailto:'}>Open mail</button>
        <button  onClick={() => window.location.href = 'googlegmail://'}>Open gmail</button>
        <button onClick={()=>shareCode('AJAYK_812312')}>Share Code</button>
    </div>
  )
}

export default Test

