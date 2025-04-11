import React, { useState } from "react";
import { ContactModal } from "./ContactModal";

export function FloatingContactButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-[#07b0ef] text-black rounded-full p-3 shadow-lg hover:bg-[#05a0d5] transition-all transform hover:scale-110 z-40"
        aria-label="Contact Support"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          {/* Add futuristic/robotic elements */}
          <circle cx="12" cy="12" r="1" fill="currentColor"></circle>
          <line x1="8" y1="9" x2="8" y2="9.01"></line>
          <line x1="16" y1="9" x2="16" y2="9.01"></line>
          <path d="M9 15l3 1 3-1"></path>
        </svg>
      </button>
      
      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        showHistory={true}
      />
    </>
  );
}