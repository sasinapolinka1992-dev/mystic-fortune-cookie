import React from 'react';

interface PredictionPaperProps {
  text: string;
  isVisible: boolean;
  onReset: () => void;
}

const PredictionPaper: React.FC<PredictionPaperProps> = ({ text, isVisible, onReset }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center w-full max-w-[95%] px-4 animate-reveal">
      
      {/* The Magical Parchment */}
      <div className="relative w-full max-w-sm bg-gradient-to-br from-[#fef3c7] to-[#fde68a] rounded-sm shadow-[0_20px_50px_rgba(88,28,135,0.6)] p-8 md:p-10 transform -rotate-1">
        
        {/* Ancient decorative borders */}
        <div className="absolute inset-2 border-2 border-purple-900/20 pointer-events-none"></div>
        <div className="absolute inset-3 border border-purple-900/10 pointer-events-none"></div>
        
        {/* Corner Ornaments */}
        <div className="absolute top-4 left-4 text-purple-900/30 text-lg leading-none">✥</div>
        <div className="absolute top-4 right-4 text-purple-900/30 text-lg leading-none">✥</div>
        <div className="absolute bottom-4 left-4 text-purple-900/30 text-lg leading-none">✥</div>
        <div className="absolute bottom-4 right-4 text-purple-900/30 text-lg leading-none">✥</div>
        
        {/* Fortune Text */}
        <p className="font-serif-custom text-2xl md:text-3xl text-purple-950 font-bold text-center leading-relaxed mt-2 mb-2 relative z-10 drop-shadow-sm">
          "{text}"
        </p>
        
        {/* Mystical symbols at bottom */}
        <div className="mt-8 flex justify-center items-center gap-3 opacity-60">
           <div className="h-px w-12 bg-purple-900/30"></div>
           <span className="text-purple-900 text-sm">✦</span>
           <div className="h-px w-12 bg-purple-900/30"></div>
        </div>
      </div>

      {/* Try Again Button - Cosmic Style */}
      <button 
        onClick={onReset}
        className="mt-14 px-10 py-4 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-700 text-white font-bold text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(192,132,252,0.5)] hover:shadow-[0_0_50px_rgba(217,70,239,0.8)] transition-all duration-300 hover:scale-105 active:scale-95 border border-fuchsia-300/30 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
        <span className="relative z-10">Узнать будущее</span>
      </button>

    </div>
  );
};

export default PredictionPaper;
