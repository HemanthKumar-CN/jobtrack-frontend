import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Delay removal for smooth animation
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const toastTypes = {
    success: {
      icon: <FaCheckCircle className="text-green-600" />,
      bg: "bg-green-100 border-green-600",
    },
    error: {
      icon: <FaTimesCircle className="text-red-600" />,
      bg: "bg-red-100 border-red-600",
    },
    warning: {
      icon: <FaExclamationCircle className="text-yellow-600" />,
      bg: "bg-yellow-100 border-yellow-600",
    },
    info: {
      icon: <FaExclamationCircle className="text-blue-600" />,
      bg: "bg-blue-100 border-blue-600",
    },
  };

  const { icon, bg } = toastTypes[type] || toastTypes.info;

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 
        border-l-4 ${bg} text-gray-800 transition-all duration-300 
        ${visible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
    >
      {icon}
      <span className="font-semibold">{message}</span>
    </div>
  );
};

export default Toast;
