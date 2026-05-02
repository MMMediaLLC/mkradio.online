
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Radio, Info } from 'lucide-react';
import PlayerControls from './components/PlayerControls';
import Visualizer from './components/Visualizer';
import { SONGS_PLAYLIST, TRANSLATIONS } from './constants';
import { Song, Language } from './types';

const STREAM_URL = "/radio";
const SONG_ROTATION_INTERVAL = 40000;
const BG_ROTATION_INTERVAL = 60000;
const FADE_DURATION = 5000;

const BACKGROUNDS = [
  "https://gostivarpress.mk/wp-content/uploads/2024/11/sv.varvara-s-15.jpg",
  "https://gostivarpress.mk/wp-content/uploads/2024/11/sv.varvara-s-5-1024x683.jpg",
  "https://gostivarpress.mk/wp-content/uploads/2024/11/sv.varvara-s-1.jpg",
  "https://gostivarpress.mk/wp-content/uploads/2024/03/1-1.jpg",
  "/images/мкрадио%20(1).jpg",
  "/images/мкрадио%20(2).jpg",
  "/images/мкрадио%20(3).jpg",
  "/images/мкрадио%20(4).jpg",
  "/images/мкрадио%20(5).jpg",
  "/images/мкрадио%20(6).jpg",
  "/images/мкрадио%20(7).jpg",
  "/images/мкрадио%20(8).jpg",
  "/images/мкрадио%20(9).jpg"
];

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lang, setLang] = useState<Language>('mk');
  const [currentSong, setCurrentSong] = useState<Song>(() => SONGS_PLAYLIST[Math.floor(Math.random() * SONGS_PLAYLIST.length)]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bgIndex, setBgIndex] = useState(() => Math.floor(Math.random() * BACKGROUNDS.length));
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const audio = new Audio();
    audio.src = STREAM_URL;
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.src = STREAM_URL;
      audioRef.current.load();
      audioRef.current.play().catch(error => {
        console.error("Грешка при пуштање:", error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, [isPlaying]);

  useEffect(() => {
    const bgTimer = setInterval(() => {
      setBgIndex((prev) => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * BACKGROUNDS.length);
        } while (nextIndex === prev && BACKGROUNDS.length > 1);
        return nextIndex;
      });
    }, BG_ROTATION_INTERVAL);
    return () => clearInterval(bgTimer);
  }, []);

  const cycleSongs = useCallback(() => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * SONGS_PLAYLIST.length);
      } while (SONGS_PLAYLIST.length > 1 && SONGS_PLAYLIST[randomIndex].titleMk === currentSong.titleMk);

      setCurrentSong(SONGS_PLAYLIST[randomIndex]);
      setIsTransitioning(false);
    }, FADE_DURATION / 2);
  }, [currentSong]);

  useEffect(() => {
    let timer: number | undefined;
    if (isPlaying) {
      timer = window.setInterval(cycleSongs, SONG_ROTATION_INTERVAL); 
    }
    return () => clearInterval(timer);
  }, [isPlaying, cycleSongs]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const getLocalizedValue = (field: 'title' | 'artist' | 'description') => {
    const suffix = lang.charAt(0).toUpperCase() + lang.slice(1);
    const key = `${field}${suffix}` as keyof Song;
    return currentSong[key];
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-between overflow-x-hidden px-6 bg-black">
      {BACKGROUNDS.map((bg, index) => (
        <div 
          key={bg}
          className="fixed inset-0 z-0 transition-opacity duration-[3000ms] ease-in-out pointer-events-none"
          style={{
            backgroundImage: `url("${bg}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: bgIndex === index ? 1 : 0,
            transform: 'translateZ(0)',
            willChange: 'opacity',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }}
        />
      ))}
      
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none" />

      <div className="absolute top-4 md:top-6 right-6 md:right-10 z-20">
        <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium">
          <button 
            onClick={() => setLang('mk')}
            className={`transition-all duration-300 ${lang === 'mk' ? 'text-white font-bold px-0.5' : 'text-stone-500 hover:text-stone-300'}`}
          >
            MK
          </button>
          <span className="text-white/10 select-none">|</span>
          <button 
            onClick={() => setLang('en')}
            className={`transition-all duration-300 ${lang === 'en' ? 'text-white font-bold px-0.5' : 'text-stone-500 hover:text-stone-300'}`}
          >
            EN
          </button>
          <span className="text-white/10 select-none">|</span>
          <button 
            onClick={() => setLang('ru')}
            className={`transition-all duration-300 ${lang === 'ru' ? 'text-white font-bold px-0.5' : 'text-stone-500 hover:text-stone-300'}`}
          >
            РУ
          </button>
        </div>
      </div>

      <header className="pt-14 md:pt-20 text-center w-full max-w-4xl z-10">
        <div className="flex justify-center mb-3 md:mb-4">
          <div className="w-12 h-[1px] bg-white/20 self-center"></div>
          <Radio className="mx-6 w-4 h-4 md:w-5 md:h-5 text-stone-400" />
          <div className="w-12 h-[1px] bg-white/20 self-center"></div>
        </div>
        <h1 className="font-serif text-2xl md:text-5xl lg:text-6xl font-light tracking-[0.05em] uppercase text-white mb-2 drop-shadow-lg px-4">
          {t.stationName}
        </h1>
        <p className="font-sans text-[9px] md:text-xs uppercase tracking-[0.35em] text-stone-300 font-medium opacity-90 px-4">
          {t.slogan}
        </p>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow pt-8 pb-2 md:pt-12 md:pb-4 w-full max-w-2xl text-center z-10">
        <div className={`mb-3 md:mb-4 flex items-center justify-center gap-2 transition-all duration-700 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-stone-600'}`}></span>
          <h2 className="text-stone-200 text-[9px] uppercase tracking-[0.3em] font-semibold">
            {isPlaying ? t.live : t.offline}
          </h2>
        </div>

        <div className="mb-4 md:mb-6">
          <PlayerControls isPlaying={isPlaying} togglePlay={togglePlay} />
        </div>

        <section className={`transition-all duration-[2000ms] w-full ${isPlaying ? 'opacity-100 translate-y-0' : 'opacity-10 translate-y-4'}`}>
          <div className="space-y-1 mb-1.5 md:mb-2 transition-opacity duration-1000" style={{ opacity: isTransitioning ? 0 : 1 }}>
            <h2 className="text-stone-400 text-[9px] uppercase tracking-[0.3em] mb-1 md:mb-2 block font-bold">
              {t.aboutSongLabel}
            </h2>
            <div className="min-h-[60px] md:min-h-[70px]">
              <p className="font-serif text-xl md:text-4xl text-white leading-tight">
                {isPlaying ? getLocalizedValue('title') : t.listenLive}
              </p>
              <p className="text-stone-200 font-light text-xs md:text-xl mt-1 md:mt-2">
                {isPlaying ? getLocalizedValue('artist') : t.folkMusic}
              </p>
            </div>
          </div>
          
          <Visualizer active={isPlaying && !isTransitioning} />

          <div className="mt-3 md:mt-4 w-full max-w-full flex flex-col items-center px-2">
            <div className="transition-opacity duration-1000 w-full" style={{ opacity: isTransitioning ? 0 : 1 }}>
              <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 mb-1 md:mb-2 block font-bold">{t.editorsNote}</span>
              <p className="italic text-stone-100 font-light text-[13px] md:text-base leading-normal md:leading-relaxed relative px-8 md:px-10 w-full max-w-full">
                <span className="absolute left-0 top-0 text-2xl md:text-3xl text-white/30 font-serif leading-none">“</span>
                {isPlaying ? getLocalizedValue('description') : t.defaultInsight}
                <span className="absolute right-0 bottom-0 text-2xl md:text-3xl text-white/30 font-serif leading-none">”</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <section className="mb-0 text-center w-full z-10 flex flex-col items-center">
        <div className="w-full max-w-md flex items-center justify-center gap-4 mb-4 opacity-40">
          <div className="flex-1 h-[1px] bg-white"></div>
          {/* Traditional geometric diamond motif */}
          <svg width="64" height="24" viewBox="0 0 64 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white fill-current">
            <path d="M32 0L44 12L32 24L20 12L32 0ZM32 6L26 12L32 18L38 12L32 6Z" />
            <path d="M12 4L20 12L12 20L4 12L12 4ZM12 8L8 12L12 16L16 12L12 8Z" />
            <path d="M52 4L60 12L52 20L44 12L52 4ZM52 8L48 12L52 16L56 12L52 8Z" />
          </svg>
          <div className="flex-1 h-[1px] bg-white"></div>
        </div>
        <div className="max-w-5xl px-8">
          <div className="flex items-center justify-center gap-2 mb-2 text-stone-400">
            <Info className="w-3.5 h-3.5" />
            <h3 className="text-[9px] uppercase tracking-widest font-bold">{t.aboutStation}</h3>
          </div>
          <p className="text-stone-300 text-xs md:text-sm leading-relaxed font-light">
            {t.missionDescription}
          </p>
        </div>
      </section>

      <footer className="pb-6 pt-0 w-full text-center z-10 px-4 flex flex-col items-center overflow-hidden">
        <div className="w-48 h-[1px] bg-white/20 mt-6 mb-3"></div>
        <div className="text-[8.5px] min-[390px]:text-[9px] sm:text-[11px] text-stone-400 font-medium tracking-normal sm:tracking-wide leading-relaxed">
          <span className="block whitespace-nowrap">© 2021 • {t.stationName} • {t.footerLine1}</span>
          <span className="block whitespace-nowrap">• {t.footerLine2}</span>
        </div>
      </footer>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] linen-texture z-[2]"></div>
    </div>
  );
};

export default App;
