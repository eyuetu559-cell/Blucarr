import React from 'react';

export default function VirtualCard({ card }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-transform active:scale-[0.99]">
      <div className="flex items-center gap-4">
        <div className="w-12 h-8 bg-gradient-to-br from-[#4b6cb7] to-[#8a2be2] rounded-md shadow-sm relative overflow-hidden">
          <div className="absolute top-1.5 left-1.5 w-3 h-2 bg-[#ffbc00]/80 rounded-sm"></div>
        </div>
        <div>
          <p className="font-bold text-gray-800 text-[15px]">Virtual Card</p>
          <p className="text-sm text-gray-500 tracking-wider">**** **** **** {card.last4}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-[#5cb85c] bg-[#5cb85c]/10 px-2.5 py-1 rounded-md text-xs font-bold block uppercase tracking-wide">
          Active
        </span>
      </div>
    </div>
  );
}