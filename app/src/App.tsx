import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, createContext, useContext } from 'react';

// Lazy load components for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));

// Audio Context
interface AudioContextType {
  audioEnabled: boolean;
  toggleAudio: () => void;
}

const AudioContext = createContext<AudioContextType>({
  audioEnabled: false,
  toggleAudio: () => {},
});

export const useAudio = () => useContext(AudioContext);

// Audio Provider
function AudioProvider({ children }: { children: React.ReactNode }) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.pause();
      } else {
        // Create oscillator for ambient sound
        try {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AudioContextClass();
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.frequency.value = 60;
          gainNode.gain.value = 0.05;
          
          oscillator.start();
          
          setTimeout(() => {
            oscillator.stop();
            ctx.close();
          }, 100);
        } catch {
          // Silent fail
        }
      }
      setAudioEnabled(!audioEnabled);
    }
  };

  return (
    <AudioContext.Provider value={{ audioEnabled, toggleAudio }}>
      {children}
    </AudioContext.Provider>
  );
}

// Navigation Component
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { audioEnabled, toggleAudio } = useAudio();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/portfolio', label: 'WORK' },
    { path: '/contact', label: 'CONTACT' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-6 right-6 z-50 hidden md:block">
        <div className="nav-pill rounded-full px-6 py-3 flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs font-medium tracking-widest transition-colors ${
                location.pathname === item.path ? 'text-cyan-400' : 'text-white/80 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="w-px h-4 bg-white/20" />
          <button
            onClick={toggleAudio}
            className="text-white/80 hover:text-white transition-colors"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="fixed top-6 right-6 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="nav-pill rounded-full p-3"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-light tracking-widest text-white/80 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  toggleAudio();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 text-white/80"
              >
                {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                <span>Sound {audioEnabled ? 'On' : 'Off'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  return null;
}

// Loading Screen
function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-cyan-400/30 rounded-full animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-t-2 border-cyan-400 rounded-full animate-spin" />
      </div>
    </div>
  );
}

// Main App Content
function AppContent() {
  const location = useLocation();
  const hideOverlays = location.pathname === '/portfolio';

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Noise overlay */}
      {!hideOverlays && <div className="noise-overlay" />}
      
      {/* Scanlines */}
      {!hideOverlays && <div className="scanlines" />}
      
      {/* Navigation */}
      <Navigation />
      <ScrollToTop />
      
      {/* Main Content */}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <HashRouter>
      <AudioProvider>
        <AppContent />
      </AudioProvider>
    </HashRouter>
  );
}

export default App;
