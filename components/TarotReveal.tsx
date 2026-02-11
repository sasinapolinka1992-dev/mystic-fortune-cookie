import React from 'react';
import { AppState } from '../types';

interface TarotDeckVisualProps {
  state: AppState;
  onClick: () => void;
}

// Потрясающая SVG рубашка для карты Таро
const CardBackSVG = () => (
  <svg viewBox="0 0 160 280" className="w-full h-full rounded-xl overflow-hidden bg-[#150e28] border border-[#d4af37]/50 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]">
    {/* Внутренняя золотая рамка */}
    <rect x="8" y="8" width="144" height="264" rx="4" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" opacity="0.8"/>
    {/* Геометрический ромб */}
    <path d="M 80 20 L 140 140 L 80 260 L 20 140 Z" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.9"/>
    {/* Центральные круги */}
    <circle cx="80" cy="140" r="35" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.9"/>
    <circle cx="80" cy="140" r="28" fill="none" stroke="#d4af37" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6"/>
    {/* Мистический глаз */}
    <path d="M 55 140 Q 80 115 105 140 Q 80 165 55 140" fill="rgba(212,175,55,0.1)" stroke="#d4af37" strokeWidth="1.5"/>
    <circle cx="80" cy="140" r="10" fill="#d4af37"/>
    {/* Луны */}
    <path d="M 80 40 A 15 15 0 1 1 65 55 A 20 20 0 0 0 80 40" fill="#d4af37" opacity="0.8"/>
    <path d="M 80 240 A 15 15 0 1 1 95 225 A 20 20 0 0 0 80 240" fill="#d4af37" opacity="0.8"/>
    {/* Звезды */}
    <circle cx="40" cy="60" r="1.5" fill="#fff" opacity="0.7"/>
    <circle cx="120" cy="60" r="1.5" fill="#fff" opacity="0.7"/>
    <circle cx="40" cy="220" r="1.5" fill="#fff" opacity="0.7"/>
    <circle cx="120" cy="220" r="1.5" fill="#fff" opacity="0.7"/>
  </svg>
);

const TarotDeckVisual: React.FC<TarotDeckVisualProps> = ({ state, onClick }) => {
  const isIdle = state === AppState.IDLE;
  const isShuffling = state === AppState.SHUFFLING;

  // Добавлен transform-style: preserve-3d для корректного отображения 3D вращения
  const baseCardStyle = "absolute top-0 left-0 w-[160px] h-[280px] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.6)] transform origin-center transition-transform duration-300";

  return (
    <div 
      className={`relative cursor-pointer w-[160px] h-[280px] ${isIdle ? 'hover:scale-105 animate-float' : ''}`}
      onClick={isIdle ? onClick : undefined}
      style={{ perspective: '1000px' }}
    >
      {/* Магическое свечение вокруг колоды */}
      <div className={`absolute -inset-10 rounded-full bg-purple-600/20 blur-[60px] animate-pulse-glow transition-opacity duration-1000 ${isIdle ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* 3 карты для эффекта веера и левитации */}
      
      {/* Левая карта */}
      <div 
        className={`${baseCardStyle} ${isIdle ? 'rotate-[-3deg] -translate-x-1 translate-y-1' : ''} ${isShuffling ? 'animate-mystic-left' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
         <CardBackSVG />
      </div>

      {/* Правая карта */}
      <div 
        className={`${baseCardStyle} ${isIdle ? 'rotate-[4deg] translate-x-1' : ''} ${isShuffling ? 'animate-mystic-right' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
         <CardBackSVG />
      </div>

      {/* Верхняя/Центральная карта (Главная левитирующая) */}
      <div 
        className={`${baseCardStyle} card-glow ${isIdle ? 'rotate-0' : ''} ${isShuffling ? 'animate-mystic-center' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
         <CardBackSVG />
      </div>

      {/* Текст-подсказка */}
      {isIdle && (
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-max text-center text-purple-300/90 text-sm tracking-[0.2em] font-bold uppercase animate-pulse drop-shadow-[0_0_8px_rgba(216,180,254,0.9)]">
          Коснись колоды
        </div>
      )}
    </div>
  );
};

export default TarotDeckVisual;
