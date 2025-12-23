import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';
import PageTransition from '../layouts/PageTransition';

// --- GAMBAR BACKGROUND & ILUSTRASI CAPRICORN ---
const BG_IMAGE_URL = "https://images.unsplash.com/photo-1535202736780-3870854c776d?q=80&w=2070&auto=format&fit=crop";
const CAPRICORN_ART_URL = "https://cdn-icons-png.flaticon.com/512/2647/2647349.png";

// --- FAKTA CAPRICORN ---
const CAPRICORN_FACTS = [
  "Ambisius & Pekerja Keras 💪",
  "Setia banget kalau udah sayang ❤️",
  "Punya selera humor yang unik 😂",
  "Teman curhat yang paling logis 🧠"
];

// --- DATA KOORDINAT BINTANG (Responsive Scale) ---
// Koordinat ini relatif terhadap container 350x400
const CAPRICORN_STARS = [
  { id: 1, x: 50, y: 100, name: "Algedi" }, 
  { id: 2, x: 80, y: 120, name: "Dabih" },  
  { id: 3, x: 120, y: 150, name: "Nashira" }, 
  { id: 4, x: 180, y: 180, name: "Deneb Algedi" }, 
  { id: 5, x: 250, y: 220, name: "Theta Cap" }, 
  { id: 6, x: 300, y: 280, name: "Omega Cap" }, 
  { id: 7, x: 220, y: 300, name: "Psi Cap" }, 
  { id: 8, x: 150, y: 350, name: "Zeta Cap" }, 
  { id: 9, x: 100, y: 320, name: "36 Cap" }, 
  { id: 10, x: 120, y: 150 }, 
];

const ConnectingStars = () => {
  const navigate = useNavigate();
  const { nextStep } = useJourney();

  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [lines, setLines] = useState([]);
  const [currentFact, setCurrentFact] = useState(0);

  // Efek ganti fakta otomatis
  useEffect(() => {
    if (completed) {
      const interval = setInterval(() => {
        setCurrentFact((prev) => (prev + 1) % CAPRICORN_FACTS.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [completed]);

  const handleStarClick = (index) => {
    if (completed) return;
    if (index !== activeIndex) return;

    if (index > 0) {
      setLines((prev) => [...prev, {
        x1: CAPRICORN_STARS[index - 1].x,
        y1: CAPRICORN_STARS[index - 1].y,
        x2: CAPRICORN_STARS[index].x,
        y2: CAPRICORN_STARS[index].y
      }]);
    }

    if (index === CAPRICORN_STARS.length - 1) {
      setTimeout(() => setCompleted(true), 500);
    }
    
    setActiveIndex((prev) => prev + 1);
  };

  const handleNext = () => {
    nextStep();
    navigate('/final');
  };

  return (
    <PageTransition>
      {/* WRAPPER UTAMA: FULL SCREEN FIX */}
      <div style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        width: '100vw', height: '100vh',
        overflow: 'hidden', // Mencegah scroll
        display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', 
        backgroundImage: `url(${BG_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0f172a' // Fallback color
      }}>

        {/* Overlay Gelap */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 0 }} />

        {/* --- HEADER TEKS --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            textAlign: 'center', zIndex: 20, 
            position: 'absolute', top: '5%', width: '100%', padding: '0 20px',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}
        >
          <h2 style={{ fontSize: '2rem', fontFamily: "'Playfair Display', serif", color: '#f1f5f9', marginBottom: '5px', fontWeight: 'bold' }}>
            {completed ? "Capricornus ♑" : "The Sea-Goat"}
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '300', maxWidth: '300px', margin: '0 auto' }}>
            {completed 
              ? "Rasi bintangmu telah terbentuk sempurna." 
              : "Hubungkan bintang-bintang secara berurutan."}
          </p>
        </motion.div>

        {/* --- AREA KONSTELASI (Tengah Layar) --- */}
        <div style={{ position: 'relative', width: '350px', height: '400px', zIndex: 10, marginTop: '-50px' }}>
          
          {/* ILUSTRASI CAPRICORN */}
          <AnimatePresence>
            {completed && (
              <motion.img
                src={CAPRICORN_ART_URL}
                alt="Capricorn Art"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.15, scale: 1 }} 
                transition={{ duration: 2 }}
                style={{
                  position: 'absolute', top: '10%', left: '5%',
                  width: '90%', height: 'auto',
                  zIndex: 5, filter: 'invert(1) drop-shadow(0 0 20px white)'
                }}
              />
            )}
          </AnimatePresence>

          {/* GARIS HUBUNG */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 15 }}>
            {lines.map((line, i) => (
              <React.Fragment key={i}>
                {/* Glow Line */}
                <motion.line
                  x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                  stroke="#93c5fd" strokeWidth="4" strokeLinecap="round"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
                  style={{ filter: 'blur(3px)' }}
                />
                {/* Main Line */}
                <motion.line
                  x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                  stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 0.5 }}
                />
              </React.Fragment>
            ))}
          </svg>

          {/* BINTANG */}
          {CAPRICORN_STARS.map((star, index) => {
            const isActive = index === activeIndex; 
            const isDone = index < activeIndex;
            const starSize = star.name === "Deneb Algedi" ? 24 : 16; 
            
            return (
              <motion.div
                key={star.id}
                onClick={() => handleStarClick(index)}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: isActive ? [1, 1.4, 1] : 1,
                  opacity: isActive || isDone || completed ? 1 : 0.3,
                  boxShadow: isActive ? '0 0 20px #93c5fd' : '0 0 0 transparent'
                }}
                transition={{ scale: { repeat: isActive ? Infinity : 0, duration: 1.5 } }}
                style={{
                  position: 'absolute',
                  left: star.x - starSize/2,
                  top: star.y - starSize/2,
                  width: `${starSize}px`,
                  height: `${starSize}px`,
                  borderRadius: '50%',
                  background: isDone || isActive ? 'white' : '#64748b',
                  cursor: isActive ? 'pointer' : 'default',
                  zIndex: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  filter: completed ? 'drop-shadow(0 0 8px white)' : 'none'
                }}
              >
                <div style={{ width: '40%', height: '40%', background: '#bae6fd', borderRadius: '50%' }} />
                {(isActive || completed) && star.name && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{
                      position: 'absolute', top: '-20px', whiteSpace: 'nowrap',
                      fontSize: '0.7rem', color: '#bae6fd', textShadow: '0 0 5px black'
                    }}
                  >
                    {star.name}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* --- AREA FAKTA & TOMBOL (Bawah) --- */}
        <div style={{ 
          position: 'absolute', bottom: '5%', width: '100%', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 
        }}>
          <AnimatePresence mode="wait">
            {completed && (
              <motion.div
                key="facts-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', width: '90%', maxWidth: '400px' }}
              >
                {/* Kartu Fakta */}
                <motion.div
                  key={currentFact} // Animasi ganti fakta
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(5px)',
                    padding: '15px 20px',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    marginBottom: '20px',
                    color: '#e2e8f0',
                    fontSize: '0.95rem',
                    fontStyle: 'italic'
                  }}
                >
                  "{CAPRICORN_FACTS[currentFact]}"
                </motion.div>

                <button onClick={handleNext} className="btn-glow" style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  border: '1px solid rgba(255,255,255,0.5)', 
                  color: 'white',
                  width: '100%',
                  padding: '15px'
                }}>
                  Lihat Kejutan Terakhir 🎁
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </PageTransition>
  );
};

export default ConnectingStars;