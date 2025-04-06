import { createContext, useState, useContext, useEffect } from "react";
import { FiX } from "react-icons/fi";

// Create Context
const ModalContext = createContext();

// Modal Provider Component
export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState(null);

  // Function to open modal with custom settings
  const openModal = ({
    title,
    message,
    onConfirm,
    confirmText,
    cancelText,
  }) => {
    setModalConfig({ title, message, onConfirm, confirmText, cancelText });
  };

  // Function to close modal
  const closeModal = () => setModalConfig(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
    };
    if (modalConfig) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalConfig]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {modalConfig && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
          <div className="bg-white/10 border border-white/20 backdrop-blur-lg shadow-lg rounded-2xl p-6 w-[90%] max-w-md text-center relative transition-all duration-300 ease-in-out transform scale-100 opacity-100">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
            >
              <FiX size={20} />
            </button>

            {/* Title */}
            <h2 className="text-lg font-semibold text-white">
              {modalConfig.title}
            </h2>

            {/* Message */}
            <p className="text-sm text-gray-300 mt-2">{modalConfig.message}</p>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-gray-700 cursor-pointer text-gray-200 hover:bg-gray-600 transition"
              >
                {modalConfig.cancelText || "Cancel"}
              </button>
              <button
                onClick={() => {
                  modalConfig.onConfirm();
                  closeModal();
                }}
                className="px-4 py-2 rounded-lg bg-red-500 cursor-pointer text-white hover:bg-red-600 transition"
              >
                {modalConfig.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

// Custom Hook for easy access
export const useModal = () => useContext(ModalContext);
