// utils/initNotificationSocket.js
import { io } from "socket.io-client";
import { useNotificationStore } from "../Store/notificationStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

let socketInstance = null;

export const initNotificationSocket = (userId,navigate) => {


  if (socketInstance) return socketInstance; // ✅ Already connected

  // socketInstance = io(1${process.env.REACT_APP_API_BASE_URL}`, {
  //   transports: ["websocket"],
  // });
  const baseUrl = process.env.REACT_APP_API_BASE_URL
    ? process.env.REACT_APP_API_BASE_URL.split("/api")[0]
    : "http://localhost:2512";
 socketInstance = io(baseUrl, {
    transports: ["websocket"],
    // Specify the path if your Socket.IO server uses a custom path like /api/socket.io
    // path: "/api/socket.io", // Uncomment and adjust if needed
  });

  socketInstance.on("connect", () => {
    console.log("🔗 Socket Connected:", socketInstance.id);
    socketInstance.emit("register", userId);
  });

  socketInstance.on("notification", (message) => {
    console.log("📩 Notification received:", message);
    useNotificationStore.getState().addNotification(message);
          const handleToastClick = () => {
        if (message.clickAction) {
          navigate(message.clickAction);
        }
      };
    // toast.info(`${message.title || "Notification"}: ${message.message}`, {
    //   position: "top-right",
    //   autoClose: 3000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   theme: "light",
    // });
       const commonOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    };

    const toastContent = (
      <div className="max-w-sm break-words">
        <b><h4 className="font-semibold text-gray-800">{message.title || "Notification"}</h4></b>
        <p className="text-sm text-gray-600 truncate">{message.message}</p>
      </div>
    );

    if (message.type == "alert") {
      toast.error(toastContent, {
        ...commonOptions,
        onClick: handleToastClick,
        className: "max-w-sm p-4 bg-red-50 border border-red-200 shadow-lg rounded-lg",
      });
    } else {
      toast.info(toastContent, {
        ...commonOptions,
        onClick: handleToastClick,
        className: "max-w-sm p-4 bg-white shadow-lg rounded-lg",
      });
    }
  });

  socketInstance.on("disconnect", () => {
    console.log("❌ Socket Disconnected");
  });

  return socketInstance;
};
