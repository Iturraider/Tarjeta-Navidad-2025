
import React, { useEffect, useRef, useState } from 'react';

interface MusicPlayerProps {
  shouldPlay: boolean;
  label: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ shouldPlay, label }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Utilitzem una font de música nadalenca d'Archive.org que és molt estable i pública
  const musicUrl = "https://ia800504.us.archive.org/3/items/SilentNightByFranzGruber/SilentNight.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (shouldPlay) {
      audio.load();
      if (!isMuted) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            // Log simple sense objectes complexos
            console.warn("La reproducció d'àudio ha estat bloquejada o ha fallat.");
            setIsPlaying(false);
          });
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [shouldPlay, isMuted]);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      if (!nextMute && shouldPlay) {
        audioRef.current.play().catch(() => {
          console.warn("No s'ha pogut reprendre l'àudio.");
        });
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleAudioError = () => {
    // Evitem passar l'esdeveniment 'e' a console.error per evitar el "circular structure to JSON"
    console.error("Error carregant la font d'àudio principal.");
    
    if (audioRef.current && audioRef.current.src !== "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3") {
      audioRef.current.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      audioRef.current.load();
      if (shouldPlay && !isMuted) {
        audioRef.current.play().catch(() => console.warn("Error en la font de contingència."));
      }
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
        onError={handleAudioError}
      />
      <button
        onClick={toggleMute}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/50 transition-all transform hover:scale-110 active:scale-95 ${
          isMuted ? 'bg-slate-500 text-white' : 'bg-yellow-500 text-white animate-pulse'
        }`}
        aria-label={isMuted ? "Activa el so" : "Silencia el so"}
      >
        <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-xl`}></i>
      </button>
      {shouldPlay && !isMuted && isPlaying && (
        <div className="mt-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-red-800 shadow-lg animate-bounce flex items-center gap-2">
          <div className="flex gap-1">
             <div className="w-1 h-3 bg-red-500 animate-[bounce_1s_infinite]"></div>
             <div className="w-1 h-3 bg-red-500 animate-[bounce_1.2s_infinite]"></div>
             <div className="w-1 h-3 bg-red-500 animate-[bounce_0.8s_infinite]"></div>
          </div>
          {label}
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
