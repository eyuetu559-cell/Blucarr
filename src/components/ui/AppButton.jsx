import React from 'react';

export default function AppButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className = '' 
}) {
  const baseClasses = "flex justify-center items-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none active:scale-[0.97] touch-manipulation w-full";
  
  // Slimmer padding matching the updated user screens
  const sizeClasses = "py-2.5 px-4 text-sm min-h-[40px]";

  const variants = {
    primary: "bg-[#5cb85c] hover:bg-[#4cae4c] text-white shadow-sm",
    glass: "bg-white/20 hover:bg-white/30 text-white border border-white/10 backdrop-blur-sm",
    action: "bg-[#7952b3] hover:bg-[#66409e] text-white shadow-md"
  };

  const disabledClasses = disabled ? "opacity-60 cursor-not-allowed active:scale-100" : "";

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variants[variant]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}