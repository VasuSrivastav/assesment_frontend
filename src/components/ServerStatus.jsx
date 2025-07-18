import { useState, useEffect } from "react";
import axios from "axios";
import Toaster from "./Toaster";
import { API_BASE_URL } from "../config/config";

const ServerStatus = () => {
  const [toast, setToast] = useState({ show: false, title: "", type: "" });
  const [serverStatus, setServerStatus] = useState("checking");

  const showToast = (title, type) => {
    setToast({ show: true, title, type });
  };

  const checkServer = async (attempt = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}`, {
        timeout: 5000,
      });
      if (response.status === 200) {
        setServerStatus("ready");
        showToast("Server is ready to use!", "success");
      }
    } catch (error) {
      if (attempt < 3) {
        showToast(`Attempting to connect to server... (${attempt}/3)`, "wait");
        setTimeout(() => checkServer(attempt + 1), 3000);
      } else {
        setServerStatus("sleeping");
        showToast("Server is in sleep mode", "error");
      }
    }
  };

  useEffect(() => {
    checkServer();
  }, []);

  if (serverStatus === "sleeping") {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        {toast.show && (
          <Toaster
            title={toast.title}
            type={toast.type}
            onClose={() => setToast({ show: false })}
          />
        )}
        <button
          onClick={() => window.open(API_BASE_URL, "_blank")}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg flex items-center gap-2 animate-pulse"
        >
          <span>Wake Server</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    toast.show && (
      <Toaster
        title={toast.title}
        type={toast.type}
        onClose={() => setToast({ show: false })}
      />
    )
  );
};

export default ServerStatus;
