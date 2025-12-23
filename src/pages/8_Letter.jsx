import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';
import PageTransition from '../layouts/PageTransition';

// --- ISI SURAT (Edit di sini) ---
// Gunakan \n\n untuk paragraf baru
const FULL_TEXT = `Hai sayang,

Selamat ulang tahun ya! ❤️

Gak kerasa waktu jalan cepet banget. Rasanya baru kemarin kita ketemu, eh sekarang aku udah nemenin kamu ulang tahun lagi.

Aku cuma mau bilang makasih. Makasih udah jadi orang yang paling ngertiin aku. Makasih udah bertahan sama aku walaupun aku kadang nyebelin, bawel, atau kayak anak kecil.

Di umur kamu yang baru ini, doa aku simpel: Semoga kamu bahagia terus. Dunia mungkin kadang jahat, tapi aku janji bakal selalu ada di sini buat jadi tempat kamu pulang.

Tetap jadi diri kamu yang hebat ya. Aku bangga banget sama pencapaian kamu sejauh ini.

I love you, more than words can say.

Yours,
Rehan`;

const Letter = () => {
  const navigate = useNavigate();
  const { nextStep } = useJourney();
  
  const [displayedText, setDisplayedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const indexRef = useRef(0);
  const scrollRef = useRef(null); // Untuk auto-scroll

  // Load Font Tulisan Tangan
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Efek Mengetik
  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < FULL_TEXT.length) {
        setDisplayedText((prev) => prev + FULL_TEXT.charAt(indexRef.current));
        indexRef.current++;
        
        // Auto scroll ke bawah saat ngetik
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      } else {
        setIsFinished(true);
        clearInterval(interval);
      }
    }, 40); // Kecepatan ngetik

    return () => clearInterval(interval);
  }, []);

  // Fitur: Klik surat untuk langsung memunculkan semua teks (Skip)
  const finishTyping = () => {
    if (!isFinished) {
      setDisplayedText(FULL_TEXT);
      indexRef.current = FULL_TEXT.length;
      setIsFinished(true);
    }
  };

  const handleNext = () => {
    nextStep();
    navigate('/video');
  };

  return (
    <PageTransition>
      <div style={{ 
        minHeight: '100vh',
        width: '100%', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        
        {/* Background Overlay Halus */}
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.2)', zIndex: -1 }} />

        {/* Kertas Surat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, type: 'spring' }}
          onClick={finishTyping}
          style={{
            background: '#fffbf0', // Warna Cream Kertas
            maxWidth: '600px',
            width: '100%',
            minHeight: '60vh',
            maxHeight: '80vh', // Batas tinggi agar bisa di-scroll
            padding: '40px 30px',
            borderRadius: '4px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2), inset 0 0 60px rgba(0,0,0,0.05)', // Efek kertas tua dikit
            position: 'relative',
            overflowY: 'auto', // Scroll jika kepanjangan
            cursor: !isFinished ? 'pointer' : 'default',
            display: 'flex',
            flexDirection: 'column'
          }}
          ref={scrollRef}
        >
          {/* Header Tanggal (Pojok Kanan Atas) */}
          <div style={{ 
            fontFamily: "'Courier New', monospace", 
            fontSize: '0.8rem', 
            textAlign: 'right', 
            color: '#888',
            marginBottom: '20px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '10px'
          }}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          {/* Isi Surat */}
          <div style={{
            fontFamily: "'Dancing Script', cursive", // Pake font tulisan tangan
            fontSize: '1.4rem',
            color: '#2c3e50',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.8',
            textAlign: 'left',
            flexGrow: 1
          }}>
            {displayedText}
            {!isFinished && <span style={{ borderRight: '2px solid #ec4899', marginLeft: '2px' }} className="animate-pulse">|</span>}
          </div>

          {/* Footer: Segel Lilin (Wax Seal) */}
          {isFinished && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.5 }}
              style={{ 
                marginTop: '40px', 
                alignSelf: 'flex-end',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Gambar/CSS Wax Seal */}
              <div style={{
                width: '60px', height: '60px',
                background: '#b91c1c', // Merah gelap
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.2)',
                border: '2px dashed rgba(0,0,0,0.2)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                fontFamily: 'serif'
              }}>
                R
              </div>
              <span style={{ fontSize: '0.8rem', color: '#b91c1c', marginTop: '5px', fontFamily: 'serif', fontStyle: 'italic' }}>
                With Love
              </span>
            </motion.div>
          )}

        </motion.div>

        {/* Tombol Lanjut (Di Luar Kertas) */}
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            style={{ marginTop: '30px', zIndex: 10 }}
          >
            <p style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#e2e8f0', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              Udah bacanya? sekarang giliran orang lain mau ngucapin juga nih
            </p>
            <button onClick={handleNext} className="btn-glow">
              Tonton Video
            </button>
          </motion.div>
        )}

      </div>
    </PageTransition>
  );
};

export default Letter;