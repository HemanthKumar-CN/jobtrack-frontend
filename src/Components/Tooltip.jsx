// components/Tooltip.js
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Tooltip = ({ children, text }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY - 32, // position above
          left: rect.left + rect.width / 2,
        });
      }
    };
    if (visible) {
      handleMouseMove();
      window.addEventListener("scroll", handleMouseMove, true);
    }
    return () => window.removeEventListener("scroll", handleMouseMove, true);
  }, [visible]);

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="inline-block cursor-pointer relative"
      >
        {children}
      </div>
      {visible &&
        createPortal(
          <div
            className="absolute z-50 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-md whitespace-nowrap transform -translate-x-1/2"
            style={{ top: coords.top, left: coords.left, position: "absolute" }}
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  );
};

export default Tooltip;
