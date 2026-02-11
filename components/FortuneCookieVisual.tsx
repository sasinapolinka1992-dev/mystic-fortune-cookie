import React from 'react';
import { AppState } from '../types';

interface FortuneCookieVisualProps {
  state: AppState;
  onClick: () => void;
}

const FortuneCookieVisual: React.FC<FortuneCookieVisualProps> = ({ state, onClick }) => {
  const isIdle = state === AppState.IDLE;
  const isCracking = state === AppState.SHUFFLING || state === AppState.REVEALED;

  return (
    <div 
      className={`relative cursor-pointer transition-transform duration-500 ${isIdle ? 'hover:scale-110 animate-float' : ''}`}
      onClick={isIdle ? onClick : undefined}
      style={{ width: '280px', height: '280px' }}
    >
      {/* Усиленная мистическая фиолетовая аура */}
      <div className={`absolute inset-0 rounded-full bg-purple-600/40 blur-[70px] animate-pulse-glow transition-opacity duration-1000 ${isIdle ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute inset-4 rounded-full bg-fuchsia-500/30 blur-[40px] transition-opacity duration-1000 ${isIdle ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Магическая вспышка при разломе */}
      {state === AppState.SHUFFLING && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-12 h-12 bg-white rounded-full blur-md shadow-[0_0_100px_50px_rgba(232,121,249,1)] animate-flash"></div>
        </div>
      )}

      {/* Новое реалистичное печенье - форма "щипка" / крылья бабочки */}
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] z-10 relative">
        <defs>
          {/* Градиенты реалистичного хрустящего теста */}
          <linearGradient id="doughLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fae191" />  {/* Светлый блик сверху */}
            <stop offset="40%" stopColor="#e3a754" /> {/* Основной золотистый */}
            <stop offset="85%" stopColor="#b56727" /> {/* Тень складок */}
            <stop offset="100%" stopColor="#803e0d" /> {/* Глубокая тень в центре */}
          </linearGradient>
          
          <linearGradient id="doughRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fae191" />
            <stop offset="40%" stopColor="#e3a754" />
            <stop offset="85%" stopColor="#b56727" />
            <stop offset="100%" stopColor="#803e0d" />
          </linearGradient>

          <linearGradient id="doughInner" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#5c290b" />
            <stop offset="100%" stopColor="#240c01" />
          </linearGradient>
        </defs>

        {/* Тень на полу */}
        <ellipse cx="100" cy="160" rx="75" ry="12" fill="rgba(0,0,0,0.7)" filter="blur(6px)" className={`transition-opacity duration-500 ${isIdle ? 'opacity-100' : 'opacity-0'}`} />

        {/* --- ЛЕВАЯ ПОЛОВИНА --- */}
        <g className={`origin-[100px_140px] ${isCracking ? 'cookie-crack-left' : ''}`}>
          {/* Левая внутренняя полость (задняя стенка) */}
          <path 
            d="M 100 75 C 75 50, 30 65, 20 85 C 40 60, 75 65, 100 75 Z" 
            fill="url(#doughInner)" 
          />
          {/* Левое крыло (передняя створка) - с острым концом и прямым разломом */}
          <path 
            d="M 100 140 C 50 140, 10 120, 20 85 C 25 65, 50 60, 75 75 C 90 85, 95 110, 100 140 Z" 
            fill="url(#doughLeft)" 
            stroke="#5c290b" strokeWidth="0.5" strokeLinejoin="round"
          />
        </g>

        {/* --- ПРАВАЯ ПОЛОВИНА --- */}
        <g className={`origin-[100px_140px] ${isCracking ? 'cookie-crack-right' : ''}`}>
          {/* Правая внутренняя полость (задняя стенка) */}
          <path 
            d="M 100 75 C 125 50, 170 65, 180 85 C 160 60, 125 65, 100 75 Z" 
            fill="url(#doughInner)" 
          />
          
          {/* Торчащий белый листок с предсказанием */}
          <path 
            d="M 145 75 L 185 55 L 195 65 L 155 85 Z" 
            fill="#ffffff" 
            filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.4))"
            className={`transition-opacity duration-200 ${isIdle ? 'opacity-100' : 'opacity-0'}`}
          />
          
          {/* Правое крыло (передняя створка) */}
          <path 
            d="M 100 140 C 150 140, 190 120, 180 85 C 175 65, 150 60, 125 75 C 110 85, 105 110, 100 140 Z" 
            fill="url(#doughRight)" 
            stroke="#5c290b" strokeWidth="0.5" strokeLinejoin="round"
          />
          
          {/* Легкая тень-нахлест в центре, чтобы подчеркнуть глубину излома */}
          <path 
            d="M 100 140 C 105 110, 110 85, 125 75 C 120 85, 105 120, 100 140 Z" 
            fill="rgba(60,20,0,0.3)" 
            filter="blur(1px)"
          />
        </g>

      </svg>
      
      {/* Текст-подсказка */}
      {isIdle && (
        <div className="absolute -bottom-10 left-0 right-0 text-center text-purple-300/90 text-sm tracking-[0.2em] font-bold uppercase animate-pulse drop-shadow-[0_0_8px_rgba(216,180,254,0.9)]">
          Открой судьбу
        </div>
      )}
    </div>
  );
};

export default FortuneCookieVisual;