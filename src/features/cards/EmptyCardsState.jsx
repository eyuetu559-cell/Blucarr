import React from 'react';
import Button from '../../components/ui/AppButton';

export default function EmptyCardsState({ onCreateCard }) {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      {/* Custom styled Credit Card icon from image_bfeb86.png */}
      <div className="w-20 h-16 bg-[#ffbc00] rounded-lg border-2 border-black relative mb-4 shadow-sm flex items-center justify-center">
        <div className="w-16 h-4 bg-white/50 rounded-sm absolute top-3"></div>
        <div className="w-6 h-4 bg-black/20 rounded-sm absolute bottom-3 left-2"></div>
      </div>
      
      <p className="text-[#a0a0a5] text-[17px] mb-6 font-medium">No cards yet</p>
      
      <div className="w-full max-w-[260px]">
        <Button variant="action" onClick={onCreateCard}>
          Create Your First Card
        </Button>
      </div>
    </div>
  );
}
