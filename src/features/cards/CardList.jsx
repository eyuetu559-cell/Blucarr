import React from 'react';
import EmptyCardsState from './EmptyCardsState';
import VirtualCard from './VirtualCard';

export default function CardList({ cards, onCreateCard }) {
  return (
    <div className="px-6 mt-8">
      <h2 className="text-xl font-bold text-[#2d2d2d] mb-6">Your Cards</h2>
      
      {cards.length === 0 ? (
        <EmptyCardsState onCreateCard={onCreateCard} />
      ) : (
        <div className="space-y-4">
          {cards.map(card => (
            <VirtualCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}