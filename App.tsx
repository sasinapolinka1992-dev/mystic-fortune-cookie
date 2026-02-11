import React, { useState, useEffect, useCallback } from 'react';
import { AppState, FortuneData } from './types';
import { fetchFortune } from './services/geminiService';
import TarotDeckVisual from './components/TarotDeckVisual';
import TarotReveal from './components/TarotReveal';
import Particles from './components/Particles';

// Объявляем глобальную переменную Telegram для TypeScript
declare global {
  interface Window {
    Telegram?: any;
  }
}

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INITIALLOADING);
  const [fortuneData, setFortuneData] = useState<FortuneData | null>(null);

  // Initial load and Telegram Setup
  useEffect(() => {
    // Настройка Telegram Web App
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand(); // Разворачиваем приложение на весь экран в Telegram
      
      // Подстраиваем верхнюю панель Telegram под наш мистический черный/темно-фиолетовый фон
      try {
        tg.setHeaderColor('#05010a');
        tg.setBackgroundColor('#05010a');
      } catch (e) {
        // Игнорируем ошибку, если версия Telegram клиента старая
        console.warn('Telegram API method not supported', e);
      }
    }

    const initialize = async () => {
      const data = await fetchFortune();
      setFortuneData(data);
      setAppState(AppState.IDLE);
    };

    initialize();
  }, []);

  const handleDrawCard = useCallback(() => {
    if (appState !== AppState.IDLE) return;

    setAppState(AppState.SHUFFLING);

    // Ждем 1.5 секунды пока проигрывается магическая левитация, затем открываем карту
    setTimeout(() => {
      setAppState(AppState.REVEALED);
    }, 1500); 

  }, [appState]);

  const handleReset = useCallback(async () => {
    // Немедленно прячем карту и показываем колоду
    setAppState(AppState.IDLE);
    
    // Легкая вибрация Haptic Feedback при сбросе
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    
    // Генерируем новую карту. Пока пользователь видит колоду, данные уже обновятся!
    const data = await fetchFortune();
    setFortuneData(data);
  }, []);

  // Haptic Feedback при клике на колоду
  const handleDeckClick = useCallback(() => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
    handleDrawCard();
  }, [handleDrawCard]);

  return (
    <div className="relative w-full min-h-[100dvh] magical-bg overflow-hidden font-sans flex items-center justify-center">
      
      {/* Background Particles (Stars & Magic Orbs) */}
      <Particles active={appState === AppState.REVEALED} />

      {/* Deep purple/magenta glowing space clouds in corners */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-indigo-900/40 rounded-full blur-[150px] pointer-events-none"></div>

      {/* MAIN CONTAINER */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
        
        {appState === AppState.INITIALLOADING && (
          <div className="flex flex-col items-center gap-6 animate-pulse z-10">
             <div className="relative w-16 h-16">
               <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-yellow-400 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
             </div>
             <div className="flex flex-col items-center text-center">
               <p className="text-indigo-300 text-sm tracking-[0.3em] font-semibold uppercase shadow-indigo-500/50 drop-shadow-md mb-2">
                 Подготовка колоды...
               </p>
               <p className="text-indigo-400/60 text-xs max-w-[220px]">
                 Тасуем уникальные карты вашей судьбы
               </p>
             </div>
          </div>
        )}

        {(appState === AppState.IDLE || appState === AppState.SHUFFLING || appState === AppState.REVEALED) && (
          <div className="relative w-full max-w-md h-full max-h-[700px] flex flex-col items-center justify-center">
             
             {/* The Deck Layer */}
             <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out z-10
               ${appState === AppState.REVEALED ? 'opacity-0 scale-50 translate-y-20 pointer-events-none' : 'opacity-100 scale-100'}
             `}>
                <TarotDeckVisual state={appState} onClick={handleDeckClick} />
             </div>

             {/* The Revealed Card & Fortune Layer */}
             <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-30
               ${appState === AppState.REVEALED ? 'pointer-events-auto' : ''}
             `}>
               <TarotReveal 
                 data={fortuneData} 
                 isVisible={appState === AppState.REVEALED} 
                 onReset={handleReset} 
               />
             </div>

          </div>
        )}
      </div>

    </div>
  );
};
