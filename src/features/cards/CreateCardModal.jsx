import React, { useState } from 'react';

export default function CreateCardModal({ isOpen, onClose, balance, onCreateSuccess }) {
  const [brand, setBrand] = useState('mastercard');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const cardAmountNum = parseFloat(amount) || 0;
  const flatFee = 2.00;
  const totalRequired = cardAmountNum > 0 ? cardAmountNum + flatFee : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '' || cardAmountNum <= 0) return;
    
    if (balance < totalRequired) {
      alert("Insufficient wallet balance for this creation request.");
      return;
    }

    onCreateSuccess(cardAmountNum, totalRequired);
    onClose();
    setName('');
    setAmount('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end justify-center">
      <div className="w-full max-w-md bg-white rounded-t-[2rem] p-6 animate-slide-up max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Create New Card</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Brand Grid Selection Toggle Row */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Card Brand</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBrand('mastercard')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${brand === 'mastercard' ? 'border-blue-500 bg-blue-50/20 font-bold' : 'border-gray-200 grayscale opacity-60'}`}
              >
                <span className="text-xl">💳</span>
                <span className="text-xs text-gray-700">MasterCard</span>
              </button>
              <button
                type="button"
                onClick={() => setBrand('visa')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${brand === 'visa' ? 'border-blue-500 bg-blue-50/20 font-bold' : 'border-gray-200 grayscale opacity-60'}`}
              >
                <span className="text-xl">💳</span>
                <span className="text-xs text-gray-700">Visa</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cardholder Name</label>
            <input 
              type="text" 
              placeholder="Enter cardholder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Amount (USD)</label>
            <input 
              type="number" 
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-gray-800"
              required
            />
          </div>

          {/* Summary Breakdown Accounting Table */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Card Amount:</span>
              <span className="font-bold text-gray-800">${cardAmountNum.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Creation Fee (Flat):</span>
              <span className="font-bold text-gray-800">${flatFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2.5 flex justify-between font-medium">
              <span>Total Creation Fee:</span>
              <span className="font-bold text-gray-800">${flatFee.toFixed(2)}</span>
            </div>
            <div className="bg-blue-50/60 p-3 rounded-lg flex justify-between items-center text-sm font-bold text-blue-900 mt-2">
              <span>Total Amount Required:</span>
              <span>${totalRequired.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-[#7952b3] hover:bg-[#66409e] text-white font-bold rounded-xl shadow-md transition-all mt-2">
            Confirm & Generate Card
          </button>
        </form>
      </div>
    </div>
  );
}