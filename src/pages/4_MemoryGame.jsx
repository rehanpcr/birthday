import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useJourney } from '../context/JourneyContext';
import PageTransition from '../layouts/PageTransition';

// --- 1. IMPORT FOTO ---
// Tambahkan img5 di sini
import img5 from '../assets/photos/foto5.jpg';
import img6 from '../assets/photos/foto6.jpg';
import img7 from '../assets/photos/foto7.jpg';
import img8 from '../assets/photos/foto8.jpg';
import img9 from '../assets/photos/foto3.jpg';
import img10 from '../assets/photos/foto10.jpg';

// Style gambar
const imgStyle = { 
  width: '100%', 
  height: '100%', 
  objectFit: 'cover', 
  borderRadius: '10px',
  pointerEvents: 'none',
  display: 'block'
};

// --- 2. DATA GAME (6 Pasang = 12 Kartu) ---
const ITEMS = [
  { id: 1, content: <img src={img5} alt="memori 0" style={imgStyle} /> }, // Tambahan Foto 5
  { id: 2, content: <img src={img6} alt="memori 1" style={imgStyle} /> },
  { id: 3, content: <img src={img7} alt="memori 2" style={imgStyle} /> },
  { id: 4, content: <img src={img8} alt="memori 3" style={imgStyle} /> },
  { id: 5, content: <img src={img9} alt="memori 4" style={imgStyle} /> },
  { id: 6, content: <img src={img10} alt="memori 5" style={imgStyle} /> },
];

const MemoryGame = () => {
  const navigate = useNavigate();
  const { nextStep } = useJourney();

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); 
  const [solved, setSolved] = useState([]);   
  const [disabled, setDisabled] = useState(false);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    shuffleCards();
  }, []);

  useEffect(() => {
    if (solved.length === ITEMS.length && ITEMS.length > 0) {
      setTimeout(() => {
        setIsWon(true);
        triggerConfetti();
      }, 500);
    }
  }, [solved]);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ec4899', '#8b5cf6', '#fbbf24'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ec4899', '#8b5cf6', '#fbbf24'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const shuffleCards = () => {
    const shuffled = [...ITEMS, ...ITEMS]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({ ...item, uniqueId: index }));
    setFlipped([]);
    setSolved([]);
    setCards(shuffled);
    setIsWon(false);
    setDisabled(false);
  };

  const handleClick = (id) => {
    if (disabled || isWon) return;
    const clickedCard = cards.find(c => c.uniqueId === id);
    if (solved.includes(clickedCard.id) || flipped.includes(id)) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }
    setFlipped([flipped[0], id]);
    setDisabled(true);
    checkForMatch(id);
  };

  const checkForMatch = (secondId) => {
    const [firstId] = flipped;
    const firstCard = cards.find(c => c.uniqueId === firstId);
    const secondCard = cards.find(c => c.uniqueId === secondId);

    if (firstCard.id === secondCard.id) {
      setSolved(prev => [...prev, firstCard.id]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  const handleNext = () => {
    nextStep();
    navigate('/quiz');
  };

  return (
    <PageTransition>
      <div style={{ 
        minHeight: '100vh', width: '100%', display: 'flex', 
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' 
      }}>
        {/* Header */}
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '2rem', fontFamily: "'Playfair Display', serif", fontWeight: 'bold', color: 'var(--text-main)' }}>
            Match Our Memories
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Cari pasangan foto kita ya!</p>
        </motion.div>

        {/* Game Board */}
        <motion.div 
          className="glass-panel"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
          style={{
            padding: '20px', background: 'rgba(255, 255, 255, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.8)', borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)', 
            maxWidth: '500px', // DIPERBESAR dari 400px
            width: '100%'      // Agar responsif
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)', // 4 Kolom
            gap: '12px', justifyContent: 'center'  // Gap diperbesar sedikit
          }}>
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.uniqueId) || solved.includes(card.id);
              const isSolved = solved.includes(card.id);

              return (
                <div 
                  key={card.uniqueId} 
                  onClick={() => handleClick(card.uniqueId)} 
                  style={{ 
                    position: 'relative', 
                    width: '100%',          // Lebar mengikuti Grid
                    aspectRatio: '1/1',     // Pastikan Kotak Sempurna
                    cursor: 'pointer', 
                    perspective: '1000px' 
                  }}
                >
                  <motion.div
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ width: '100%', height: '100%', position: 'absolute', transformStyle: 'preserve-3d' }}
                  >
                    {/* BELAKANG (TUTUP) */}
                    <div style={{
                      position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                      borderRadius: '12px', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '2px solid rgba(255,255,255,0.5)'
                    }}>
                      <span style={{ fontSize: '2rem', color: 'white', opacity: 0.8 }}>❓</span>
                    </div>

                    {/* DEPAN (FOTO) */}
                    <div style={{
                      position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)', borderRadius: '12px', backgroundColor: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: isSolved ? '0 0 15px #4ade80' : '0 4px 6px rgba(0,0,0,0.1)', 
                      border: isSolved ? '3px solid #4ade80' : '2px solid white', overflow: 'hidden'
                    }}>
                      {card.content}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Modal Menang */}
        <AnimatePresence>
          {isWon && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
              <div style={{ background: 'white', padding: '30px', borderRadius: '25px', textAlign: 'center', maxWidth: '300px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '4px solid #ec4899' }}>
                <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🥳</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', fontWeight: 'bold' }}>Hebat!</h3>
                <p style={{ color: '#64748b', marginBottom: '20px' }}>Ingatan kamu tentang kita emang juara!</p>
                <button onClick={handleNext} className="btn-glow" style={{width: '100%'}}>Lanjut Quiz 🧠</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default MemoryGame;