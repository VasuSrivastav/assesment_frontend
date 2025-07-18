import React, { useEffect, useState } from "react";

const Toaster = ({ title, type, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const borderTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(borderTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 30);

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(borderTimer);
    };
  }, [onClose]);

  const getToastStyles = () => {
    const baseStyles = {
      success: {
        background: "#1B4332",
        border: "#0cec7c",
        text: "#ffffff",
      },
      error: {
        background: "#991B1B",
        border: "#DC2626",
        text: "#ffffff",
      },
      wait: {
        background: "#854D0E",
        border: "#DAD700",
        text: "#ffffff",
      },
    };
    return baseStyles[type] || baseStyles.success;
  };

  const styles = getToastStyles();

  return (
    <div className="fixed z-[100] top-8 right-4">
      <div
        className="min-w-[300px] rounded-lg shadow-lg overflow-hidden"
        style={{
          backgroundColor: styles.background,
          boxShadow: `0 0 15px ${styles.border}40`,
        }}
      >
        {/* Main content */}
        <div className="px-4 py-3 relative">
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            style={{
              animation: "shimmer 2s infinite",
              backgroundSize: "200% 100%",
            }}
          />

          {/* Text content */}
          <div
            className="relative z-10 font-medium tracking-wide"
            style={{ color: styles.text }}
          >
            {title}
          </div>

          {/* Progress bar */}
          <div
            className="absolute bottom-0 left-0 h-0.5 transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              backgroundColor: styles.border,
              boxShadow: `0 0 8px ${styles.border}`,
            }}
          />
        </div>
      </div>

      <style jsx="true">{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Toaster;
