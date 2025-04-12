import { useEffect } from "react";
import PropTypes from "prop-types";

const Alert = ({ type, message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000); // Auto-hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const isError = type === "error";

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center space-x-4 max-w-lg px-6 py-4 rounded-lg shadow-lg transition-opacity duration-500 text-lg ${
        isError ? "bg-red-500 text-white" : "bg-green-500 text-white"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {isError ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        )}
      </svg>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="cursor-pointer p-2 rounded-full hover:bg-white hover:text-gray-700"
        aria-label="Close alert"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M15.8333 5.34166L5.34166 15.8333M5.34166 5.34166L15.8333 15.8333"
            stroke="#393a37"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(["error", "success"]).isRequired,
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Alert;
