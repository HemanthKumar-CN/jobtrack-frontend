import React from "react";

const FullScreenLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-50">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-[#008CC8] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-[#008CC8] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-[#008CC8] rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
