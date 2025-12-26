
import React, { useState, useEffect } from 'react';
import Snowfall from './components/Snowfall';
import PuzzleGame from './components/PuzzleGame';
import { FAMILY, DIFFICULTIES, TRANSLATIONS } from './constants';
import { generateChristmasWish } from './services/geminiService';

const App: React.FC = () => {
  const [language, setLanguage] = useState<'ca' | 'es' | null>(null);
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [customWish, setCustomWish] = useState<string>('');
  const [loadingWish, setLoadingWish] = useState(false);
  const [copyStatus, setCopyStatus] = useState<boolean>(false);

  // Obtenim els textos de l'idioma seleccionat (per defecte 'ca' si no hi ha res triat)
  const t = TRANSLATIONS[language || 'ca'];

  useEffect(() => {
    if (isSolved && language) {
      setLoadingWish(true);
      generateChristmasWish(language).then(wish => {
        setCustomWish(wish);
        setLoadingWish(false);
      });
    }
  }, [isSolved, language]);

  const handleReset = () => {
    setDifficulty(null);
    setIsSolved(false);
    setCustomWish('');
    setCopyStatus(false);
  };

  const handleFullReset = () => {
    setLanguage(null);
    setDifficulty(null);
    setIsSolved(false);
    setCustomWish('');
    setCopyStatus(false);
  };

  const handleShare = async () => {
    const title = t.title;
    const text = `${t.family}: ${customWish}`;
    let shareUrl = window.location.href;

    // Validem si l'URL és vàlid per a la Web Share API (normalment requereix http/https)
    try {
      const urlObj = new URL(shareUrl);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        shareUrl = ''; // Si no és un URL web estàndard, no l'incloem
      }
    } catch (e) {
      shareUrl = '';
    }

    const shareData: ShareData = {
      title,
      text,
      ...(shareUrl ? { url: shareUrl } : {})
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // No registrem error si l'usuari cancel·la l'acció
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback: Copiar al porta-retalls
      try {
        const textToCopy = shareUrl ? `${text}\n\n${shareUrl}` : text;
        await navigator.clipboard.writeText(textToCopy);
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-700 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      <Snowfall />

      <header className="mb-8 text-center z-20">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-lg tracking-tight px-4">
          {t.title}
        </h1>
        <p className="text-xl md:text-2xl text-yellow-300 font-bold drop-shadow-md">
          {t.family}
        </p>
      </header>

      <main className="w-full max-w-2xl bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-3xl shadow-2xl z-20 transition-all duration-500">
        
        {language === null ? (
          // PANTALLA 1: Selecció d'idioma
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl font-bold text-red-800 mb-8 text-center">
              {TRANSLATIONS.ca.chooseLang} / {TRANSLATIONS.es.chooseLang}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              <button
                onClick={() => setLanguage('ca')}
                className="bg-red-700 hover:bg-red-800 text-white font-bold py-6 px-8 rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">Català</span>
                <span className="text-xs opacity-70">Benvinguts</span>
              </button>
              <button
                onClick={() => setLanguage('es')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-6 px-8 rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">Castellano</span>
                <span className="text-xs opacity-70">Bienvenidos</span>
              </button>
            </div>
          </div>
        ) : difficulty === null ? (
          // PANTALLA 2: Selecció de dificultat
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-full flex justify-start mb-4">
               <button onClick={handleFullReset} className="text-red-700 text-sm font-bold flex items-center">
                 <i className="fas fa-globe mr-2"></i> {language === 'ca' ? 'Canviar idioma' : 'Cambiar idioma'}
               </button>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-8 text-center">
              {t.chooseDiff}
            </h2>
            <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.size)}
                  className="group bg-white border-2 border-red-100 hover:border-red-500 p-4 rounded-2xl transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1 text-left"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="block font-black text-red-700 text-lg uppercase">{d.label[language]}</span>
                      <span className="text-slate-500 text-sm">{d.description[language]}</span>
                    </div>
                    <i className="fas fa-chevron-right text-red-200 group-hover:text-red-500 transition"></i>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : !isSolved ? (
          // PANTALLA 3: El Joc
          <div className="flex flex-col items-center animate-in fade-in duration-500">
            <div className="flex justify-between w-full mb-6 items-center border-b border-red-50 pb-4">
              <button 
                onClick={handleReset}
                className="text-red-700 hover:text-red-900 font-bold text-sm flex items-center"
              >
                <i className="fas fa-arrow-left mr-2"></i> {t.back}
              </button>
              <span className="bg-red-100 text-red-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                {t.level} {difficulty}x{difficulty}
              </span>
            </div>
            <PuzzleGame size={difficulty} onSolve={() => setIsSolved(true)} />
            <p className="mt-4 text-xs text-slate-400 italic">{t.puzzleFooter}</p>
          </div>
        ) : (
          // PANTALLA 4: Resultat / Felicitació
          <div className="animate-in fade-in duration-1000 flex flex-col items-center text-center">
            <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {FAMILY.map((member) => (
                <div key={member.name} className="flex flex-col items-center group">
                  <div className={`w-12 h-12 md:w-16 md:h-16 ${member.color} rounded-full flex items-center justify-center text-white text-xl md:text-2xl shadow-lg transform transition group-hover:scale-110 group-hover:rotate-12`}>
                    <i className={`fas ${member.icon}`}></i>
                  </div>
                  <span className="mt-2 font-bold text-red-800 text-sm md:text-base">{member.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-none mt-1">
                    {language === 'ca' ? member.role.split(' / ')[0] : member.role.split(' / ')[1]}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-red-50 border-2 border-red-200 p-6 md:p-8 rounded-2xl mb-8 relative w-full shadow-inner">
              <i className="fas fa-star absolute -top-4 -left-4 text-4xl text-yellow-400"></i>
              {loadingWish ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
                  <p className="text-red-700 italic">{t.loading}</p>
                </div>
              ) : (
                <p className="text-xl md:text-2xl text-red-900 leading-relaxed font-serif italic">
                  "{customWish}"
                </p>
              )}
              <i className="fas fa-crown absolute -bottom-4 -right-4 text-4xl text-yellow-500"></i>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md flex items-center"
                >
                  <i className="fas fa-redo mr-2"></i> {t.playAgain}
                </button>
                <button
                   onClick={handleShare}
                   disabled={loadingWish}
                   className={`${loadingWish ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-bold py-3 px-6 rounded-xl transition shadow-md flex items-center gap-2 relative`}
                >
                  <i className={`fas ${copyStatus ? 'fa-check' : 'fa-share-alt'}`}></i> 
                  {copyStatus ? (language === 'ca' ? 'Copiat!' : '¡Copiado!') : t.share}
                </button>
              </div>
              <p className="text-slate-400 text-[10px] md:text-xs mt-4 max-w-sm">
                {t.welcome2026} 🍼
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 text-white/60 text-sm z-20 flex flex-col items-center gap-1 mb-8">
        <p>&copy; 2025 Família Iturralde Matencio</p>
        <p>{t.footer}</p>
      </footer>
    </div>
  );
};

export default App;
