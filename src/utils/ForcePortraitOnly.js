import React, { useEffect, useState } from 'react';

const ForcePortraitOnly = () => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isApiUnsupported, setIsApiUnsupported] = useState(false);

  const checkOrientation = () => {
    // Use Screen Orientation API if available, else fall back to window dimensions
    if (window.screen.orientation) {
      setIsLandscape(window.screen.orientation.type.includes('landscape'));
    } else {
      setIsLandscape(window.innerWidth > window.innerHeight);
    }
  };

  useEffect(() => {
    // Attempt to lock orientation to portrait
    if (window.screen.orientation && window.screen.orientation.lock) {
      window.screen.orientation
        .lock('portrait')
        .then(() => {
          checkOrientation();
        })
        .catch((err) => {
          console.warn('Orientation lock failed:', err);
          setIsApiUnsupported(true);
          checkOrientation();
        });
    } else {
      setIsApiUnsupported(true);
      checkOrientation();
    }

    // Add event listeners for dynamic updates
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      if (window.screen.orientation && window.screen.orientation.unlock) {
        window.screen.orientation.unlock();
      }
    };
  }, []);

  // Show warning only if API is unsupported and device is in landscape mode
  if (isApiUnsupported && isLandscape) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          color: '#fff',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '18px',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          style={{ marginBottom: '10px' }}
        >
          <path d="M4 12h16M12 4v16" />
          <path d="M8 16c0-2.2 1.8-4 4-4s4 1.8 4 4" />
        </svg>
        Please rotate your device to portrait mode to continue.
        <br />
        <small>If locked, disable your device's orientation lock in settings.</small>
      </div>
    );
  }

  return null;
};

export default ForcePortraitOnly;