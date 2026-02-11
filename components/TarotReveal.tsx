import React from 'react';
import { FortuneData } from '../types';

interface TarotRevealProps {
  data: FortuneData | null;
  isVisible: boolean;
  onReset: () => void;
}

// Запасная мистическая иконка, если картинка не сгенерировалась
const MysticalIcon = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 opacity-90 drop-shadow-md">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#b38a22" strokeWidth="1.5" strokeDasharray="5 5" />
    <circle cx="50" cy="50" r="35" fill="none" stroke="#b38a22" strokeWidth="1" />
    <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="#b38a22" strokeWidth="1" />
    <path d="M 18 18 L 82 82 M 18 82 L 82 18" stroke="#b38a22" strokeWidth="1" />
    <circle cx="50" cy="50" r="14" fill="#d4af37" />
    <path d="M 50 36 A 14 14 0 1 1 36 50 A 20 20 0 0 0 50 36" fill="#fcf6e8" />
  </svg>
);

const TarotReveal: React.FC<TarotRevealProps> = ({ data, isVisible, onReset }) => {
  if (!isVisible || !data) return null;

  return (
    <div key={data.cardName} className="absolute inset-0 z-30 flex flex-col items-center justify-center w-full px-4 pointer-events-auto">
      
      {/* 3D-Переворот самой карты */}
      <div className="animate-flip-in flex-shrink-0 w-[200px] h-[340px] relative rounded-xl bg-[#fdfaf2] border-[3px] border-[#d4af37] shadow-[0_20px_50px_rgba(0,0,0,0.8),_0_0_40px_rgba(212,175,55,0.3)] flex flex-col p-2 z-20 mb-6">
         <div className="w-full h-full border border-[#b38a22] flex flex-col p-2 relative bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]">
             
             {/* Область для сгенерированного изображения */}
             <div className="flex-grow w-full relative mb-3 overflow-hidden rounded-sm border border-[#b38a22]/60 bg-[#1a0b2e] flex items-center justify-center shadow-inner">
                {data.imageUrl ? (
                  <img src={data.imageUrl} alt={data.cardName} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <MysticalIcon />
                )}
             </div>
             
             {/* Разделитель */}
             <div className="w-full border-t border-[#b38a22] mb-2"></div>
             
             {/* Название Карты */}
             <div className="w-full h-10 flex items-center justify-center px-1 overflow-hidden">
                <span className="text-[#3a2808] font-serif-custom text-sm font-bold text-center uppercase tracking-widest leading-tight drop-shadow-sm">
                  {data.cardName}
                </span>
             </div>
         </div>
      </div>

      {/* Выплывающее снизу предсказание */}
      <div className="animate-fade-up w-full max-w-sm flex flex-col items-center p-6 rounded-2xl bg-[#1a0b2e]/80 border border-fuchsia-400/30 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.3)] z-10">
         <p className="font-serif-custom text-xl md:text-2xl text-purple-50 font-semibold text-center leading-relaxed drop-shadow-md transform-gpu">
           "{data.text}"
         </p>
         
         <button 
           onClick={onReset}
           className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-purple-800 via-fuchsia-700 to-purple-800 text-white font-bold text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(192,132,252,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 border border-fuchsia-300/40 transform-gpu"
         >
           Тянуть еще
         </button>
      </div>

    </div>
  );
};

export default TarotReveal;
