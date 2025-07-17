// import React, { useEffect, useRef, useState } from 'react';
// import './PreventPullToRefresh.css';
// import { useDashboardStore } from '../../Store/agentZustandStore';

// const PreventPullToRefresh = ({ children }) => {
//     const { agents, totalCalls, hasFetched, setDashboardData, setHasFetched } =
//         useDashboardStore();
//     const startYRef = useRef(0);
//     const isPullingRef = useRef(false);
//     const [pullDistance, setPullDistance] = useState(0);
//     const [showIcon, setShowIcon] = useState(false);
//     const containerRef = useRef(null);
//     const threshold = 80;

//     useEffect(() => {
//         const handleTouchStart = (e) => {
//             if (e.touches.length !== 1) return;

//             const scrollTop = containerRef.current?.scrollTop || 0;

//             if (scrollTop === 0) {
//                 // Only start pulling when scrolled to top
//                 startYRef.current = e.touches[0].clientY;
//                 isPullingRef.current = true;
//             }
//         };

//         const handleTouchMove = (e) => {
//             if (!isPullingRef.current) return;

//             const currentY = e.touches[0].clientY;
//             const distance = currentY - startYRef.current;

//             if (distance > 0) {
//                 e.preventDefault(); // Prevent browser native pull
//                 setPullDistance(Math.min(distance, 100));
//                 setShowIcon(true);
//             }
//         };

//         const handleTouchEnd = () => {
//             if (pullDistance >= threshold) {
//                 setHasFetched(false)
//             }
//             setPullDistance(0);
//             setShowIcon(false);
//             isPullingRef.current = false;
//         };

//         const container = containerRef.current;
//         container.addEventListener('touchstart', handleTouchStart, { passive: false });
//         container.addEventListener('touchmove', handleTouchMove, { passive: false });
//         container.addEventListener('touchend', handleTouchEnd);

//         return () => {
//             container.removeEventListener('touchstart', handleTouchStart);
//             container.removeEventListener('touchmove', handleTouchMove);
//             container.removeEventListener('touchend', handleTouchEnd);
//         };
//     }, [pullDistance]);

//     return (
//         <div className="custom-refresh-wrapper" ref={containerRef}>
//             <div
//                 className="refresh-indicator"
//                 style={{
//                     height: `${pullDistance}px`,
//                     opacity: showIcon ? 1 : 0,
//                     transition: 'height 0.2s ease, opacity 0.2s ease',
//                     position: 'relative',
//                 }}
//             >
//                 <div className="refresh-center-wrapper">
//                     {pullDistance >= threshold ? (
//                         <div className="loader-icon spinning">🔄</div>
//                     ) : (
//                         <div
//                             className="loader-icon"
//                             style={{ transform: `rotate(${pullDistance * 2}deg)` }}
//                         >
//                             ⬇️
//                         </div>
//                     )}
//                     <div className="refresh-text">
//                         {pullDistance >= threshold ? "Refreshing..." : "Pull to Refresh"}
//                     </div>
//                 </div>
//             </div>

//             <div className="content">{children}</div>
//         </div>


//     );
// };

// export default PreventPullToRefresh;
import React, { createContext, useEffect, useRef, useState } from 'react';
import './PreventPullToRefresh.css';
import { useDashboardStore } from '../../Store/agentZustandStore';
import { Loader, ArrowDown } from 'lucide-react';
export const RefreshContext = createContext(false)
const PreventPullToRefresh = ({ children, setRefreshKey }) => {
    console.log(setRefreshKey)
    const { agents, totalCalls, hasFetched, setDashboardData, setHasFetched } =
        useDashboardStore();

    const startYRef = useRef(0);
    const isPullingRef = useRef(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [showIcon, setShowIcon] = useState(false);
    const containerRef = useRef(null);
    const threshold = 80;
    const [isRefreshing, setIsRefreshing] = useState(false);
    console.log(isRefreshing,"HELLO")
    useEffect(() => {
        const handleTouchStart = (e) => {
            if (e.touches.length !== 1) return;

            const scrollTop = containerRef.current?.scrollTop || 0;

            if (scrollTop === 0) {
                // Only start pulling when scrolled to top
                startYRef.current = e.touches[0].clientY;
                isPullingRef.current = true;
            }
        };

        const handleTouchMove = (e) => {
            if (!isPullingRef.current) return;

            const currentY = e.touches[0].clientY;
            const distance = currentY - startYRef.current;

            if (distance > 0) {
                e.preventDefault(); // Prevent browser native pull
                setPullDistance(Math.min(distance, 100));
                setShowIcon(true);
            }
        };

    const handleTouchEnd = () => {
      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        setHasFetched(false);
        setTimeout(() => {
          setRefreshKey((prev) => prev + 1);
          setIsRefreshing(false);
        }, 100); // small delay for smoother transition
      }
      setPullDistance(0);
      setShowIcon(false);
      isPullingRef.current = false;
    };

        const container = containerRef.current;
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [pullDistance]);

    return (
        <>
            <RefreshContext.Provider value={isRefreshing}>
                <div
                    className="refresh-indicator"
                    style={{
                        height: `${pullDistance}px`,
                        opacity: showIcon ? 1 : 0,
                        transition: 'height 0.2s ease, opacity 0.2s ease',
                    }}
                >
                    <div className="refresh-center-wrapper">
                        {pullDistance >= threshold ? (
                            <div className="loader-icon spinning">
                                <Loader size={28} color="white" />
                            </div>
                        ) : (
                            <div
                                className="loader-icon"
                                style={{ transform: `rotate(${pullDistance * 2}deg)` }}
                            >
                                <ArrowDown size={28} color="white" />
                            </div>
                        )}
                        <div className="refresh-text">
                            {/* {pullDistance >= threshold ? "Refreshing..." : "Pull to Refresh"} */}
                        </div>
                    </div>
                </div>

                <div className="custom-refresh-wrapper" ref={containerRef}>
                    <div className="content">{children}</div>
                </div>
            </RefreshContext.Provider>
        </>
    );

};

export default PreventPullToRefresh;
