import React, { useState } from 'react';
import AppButton from '../../components/ui/AppButton';

export default function WalletBalance({ balance, onOpenFund, onOpenCreate }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="bg-gradient-to-br from-[#4b6cb7] to-[#8a2be2] pt-6 pb-6 px-5 rounded-b-[2.5rem] shadow-md">
      
      {/* Top Brand Header with Logo Placeholder */}
      <div className="flex items-center gap-3 mb-5 mt-1">
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
          {/* Placeholder graphics token matching design assets context */}
          <div className="w-7 h-7 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg opacity-80 flex items-center justify-center text-[10px] text-white font-black">BC</div>
        </div>
        <h1 className="text-white text-2xl font-bold tracking-tight">BlueCards</h1>
      </div>
      
      {/* Wallet Balance Display Card */}
      <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 mb-5 border border-white/10">
        <p className="text-white/80 text-xs font-medium mb-1 tracking-wide uppercase">Wallet Balance</p>
        <div className="flex items-center gap-3">
          <h1 className="text-white text-4xl font-bold tracking-tight">
            ${balance.toFixed(2)}
          </h1>
          <button 
            onClick={handleRefresh}
            className={`text-white/80 hover:text-white transition-all focus:outline-none ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex gap-3">
        <AppButton variant="primary" onClick={onOpenFund}>
          <span className="text-xs">💰</span> Fund Wallet
        </AppButton>
        <AppButton variant="glass" onClick={onOpenCreate}>
          + Create Card
        </AppButton>
      </div>
    </div>
  );
}