import React from 'react';

export default function InboxButton() {
  // Function to handle the external redirect safely
  const handleOpenTelegram = () => {
    window.open('https://telegram.me/Blucardet', '_blank');
  };

  return (
    <button
      onClick={handleOpenTelegram}
      className="fixed bottom-14 right-4 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-full py-2.5 px-4 flex items-center gap-3 hover:bg-gray-50 transition-transform active:scale-95 z-40"
    >
      {/* Telegram Blue Circle Icon */}
      <div className="w-8 h-8 bg-[#0088cc] rounded-full flex items-center justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="ml-[-2px] mt-[1px]" /* Slight optical adjustment for the paper airplane */
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </div>
      
      {/* Text */}
      <span className="text-gray-700 font-medium text-sm pr-1">Inbox</span>
    </button>
  );
}
