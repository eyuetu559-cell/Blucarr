import React, { useState } from 'react';
import WalletBalance from './features/wallet/WalletBalance';
import CardList from './features/cards/CardList';
import InboxButton from './components/ui/InboxButton';
import Footer from './components/layout/Footer';
import FundWalletModal from './features/wallet/FundWalletModal';
import CreateCardModal from './features/cards/CreateCardModal';

export default function App() {
  // Empty array states for all dynamic user loads initially
  const [balance, setBalance] = useState(0.00);
  const [cards, setCards] = useState([]);
  
  // Interactive Modal Trigger flags
  const [isFundOpen, setIsFundOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleFundWalletSuccess = (amountInUsd) => {
    setBalance(prev => prev + amountInUsd);
  };

  const handleCreateCardSuccess = (loadedAmount, totalDeduction) => {
    setBalance(prev => prev - totalDeduction);
    setCards(prev => [
      ...prev,
      {
        id: Date.now(),
        last4: Math.floor(1000 + Math.random() * 9000),
        balance: loadedAmount
      }
    ]);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f4f6f9] relative font-sans text-gray-800 pb-24 shadow-xl overflow-x-hidden">
      
      <WalletBalance 
        balance={balance} 
        onOpenFund={() => setIsFundOpen(true)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />
      
      <CardList 
        cards={cards} 
        onCreateCard={() => setIsCreateOpen(true)} 
      />
      
      <InboxButton />
      <Footer />

      {/* Slide up Bottom Sheet Overlays */}
      <FundWalletModal 
        isOpen={isFundOpen} 
        onClose={() => setIsFundOpen(false)} 
        onAddFunds={handleFundWalletSuccess}
      />

      <CreateCardModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        balance={balance}
        onCreateSuccess={handleCreateCardSuccess}
      />
    </div>
  );
}