import React, { useState } from 'react';

export default function FundWalletModal({ isOpen, onClose, onAddFunds }) {
  const [amount, setAmount] = useState('');
  const [txId, setTxId] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText("0963242274");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    
    // 1. Trigger the orange processing popup
    setIsProcessing(true);

    // 2. Simulate the processing time, then close everything
    setTimeout(() => {
      setIsProcessing(false);
      
      // We pass 0 here so the balance does NOT increase immediately on the home page!
      if (onAddFunds) onAddFunds(0); 
      
      // Reset form states
      setAmount('');
      setTxId('');
      setReceipt(null);
      onClose();
    }, 2500); // 2.5 seconds of processing screen
  };

  return (
    <>
      {/* Orange Payment Processing Popup */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-orange-500 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-pulse">
            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-2xl font-black text-white tracking-wide">Payment Processing</h2>
            <p className="text-white/90 text-sm font-medium">Verifying your receipt...</p>
          </div>
        </div>
      )}

      {/* Main Modal (Fades slightly when processing) */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end justify-center ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}>
        <div className="w-full max-w-md bg-white rounded-t-[2rem] p-6 animate-slide-up max-h-[90vh] overflow-y-auto shadow-2xl">
          
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Fund Wallet</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200">
              ✕
            </button>
          </div>

          {/* Tab Header */}
          <div className="border-b border-gray-100 mb-5">
            <div className="inline-block pb-2 border-b-2 border-blue-600 font-semibold text-blue-600 text-sm">
              🏛️ Bank Transfer
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Payment Provider Card */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Payment Method</label>
              <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50/30 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800 text-base">TeleBirr</p>
                  <p className="text-xs text-gray-400">Min: 850 | Max: 200000</p>
                </div>
                <div className="w-5 h-5 rounded-full border-4 border-blue-500 bg-white"></div>
              </div>
            </div>

            {/* Bank Info Fields Box */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-3">Bank Details</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-gray-700">0963242274</span>
                  <button type="button" onClick={handleCopy} className="text-gray-400 hover:text-blue-600 transition-colors">
                    {copied ? '✅' : '📋'}
                  </button>
                </div>
              </div>
            </div>

            {/* Numeric Entry fields */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount (ብር)</label>
              <input 
                type="number" 
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Transaction ID (Optional)</label>
              <input 
                type="text" 
                placeholder="Enter transaction ID"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-gray-800"
              />
            </div>

            {/* Working Upload Receipt Field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Upload Receipt</label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-blue-50 transition-colors">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setReceipt(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                <div className="flex flex-col items-center justify-center gap-1">
                  {receipt ? (
                    <>
                      <span className="text-xl">📸</span>
                      <p className="text-xs font-bold text-blue-600 truncate max-w-full px-2">{receipt.name}</p>
                      <p className="text-[10px] text-gray-400">Click to change image</p>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">📤</span>
                      <p className="text-xs text-gray-500 font-medium">Click to select receipt image</p>
                      <p className="text-[10px] text-gray-400">PNG, JPG, JPEG</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-[#7952b3] hover:bg-[#66409e] text-white font-bold rounded-xl shadow-md transition-all mt-2">
              Submit Payment Verification
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
