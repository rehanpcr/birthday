import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';
import PageTransition from '../layouts/PageTransition';

// DATABASE PESAN (25 Pesan Random)
const MESSAGES = [
  "Aku suka cara kamu ketawa, bikin hari aku langsung cerah.",
  "Makasih udah selalu sabar ngadepin sifat aku yang kadang batu.",
  "Kamu adalah rumah tempat aku pulang.",
  "Setiap liat mata kamu, aku ngerasa tenang banget.",
  "Jangan lupa makan ya, aku gak mau kamu sakit.",
  "I love you more than words can say.",
  "Kamu tau gak? Senyum kamu itu candu.",
  "Bahagia itu sederhana: Cukup ada kamu di samping aku.",
  "Maaf ya kalau aku belum bisa jadi yang sempurna, tapi aku usaha terus kok.",
  "Apapun yang terjadi, aku bakal selalu ada buat kamu.",
  "Kamu itu unik, jangan pernah berubah demi orang lain ya.",
  "Kadang aku mikir, aku beruntung banget bisa ketemu kamu.",
  "Semangat ya hari ini! Aku tau kamu bisa hadapin semuanya.",
  "Kalau cape istirahat ya, jangan dipaksain.",
  "Dunia mungkin jahat, tapi pelukanku selalu hangat buat kamu.",
  "Tau gak bedanya kamu sama jam? Jam muterin waktu, kamu muterin pikiranku.",
  "Kamu cantik banget hari ini. (Aku gak liat, tapi aku yakin)",
  "Terima kasih sudah bertahan sejauh ini. Aku bangga sama kamu.",
  "Satu pesanku: Jangan pernah ngerasa sendirian ya.",
  "Aku kangen. Itu aja.",
  "Tuhan baik banget ya, ngirim kamu ke hidup aku.",
  "Jangan lupa minum air putih yang banyak!",
  "Senyum dulu dong... nah gitu kan cantik.",
  "Love you to the moon and back 🌙",
  "Kamu alesan aku mau jadi orang yang lebih baik lagi."
];

const LoveMessages = () => {
  const navigate = useNavigate();
  const { nextStep } = useJourney();

  const [currentMsg, setCurrentMsg] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [isOpening, setIsOpening] = useState(false); // Status animasi buka amplop

  const generateMessage = () => {
    if (isOpening) return; // Cegah spam klik

    setIsOpening(true);
    
    // Animasi delay seolah-olah sedang "mengambil" surat
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * MESSAGES.length);
      setCurrentMsg(MESSAGES[randomIndex]);
      setClickCount((prev) => prev + 1);
      setIsOpening(false);
    }, 800);
  };

  const handleNext = () => {
    nextStep();
    navigate('/pause'); 
  };

  return (
    <PageTransition>
      <div style={{ 
        minHeight: '100vh', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px' 
      }}>

        {/* Dekorasi Background */}
        <div style={{ position: 'fixed', top: '20%', left: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(50px)', zIndex: -1 }} />
        <div style={{ position: 'fixed', bottom: '20%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(50px)', zIndex: -1 }} />

        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <h2 style={{ fontSize: '2rem', fontFamily: "'Playfair Display', serif", fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '10px' }}>
            Daily Dose of Love 💌
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Klik amplop di bawah kalau kamu butuh semangat.
          </p>
        </motion.div>

        {/* --- TOMBOL AMPLOP --- */}
        <motion.button
          onClick={generateMessage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            marginBottom: '40px'
          }}
        >
          <motion.div
            animate={isOpening ? { rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } } : {}}
            style={{ fontSize: '6rem', filter: 'drop-shadow(0 10px 20px rgba(236, 72, 153, 0.3))' }}
          >
            {isOpening ? '📨' : '💌'}
          </motion.div>
          <div style={{ 
            marginTop: '10px', 
            fontSize: '1rem', 
            color: '#ec4899', 
            fontWeight: 'bold',
            background: 'rgba(255,255,255,0.8)',
            padding: '5px 15px',
            borderRadius: '20px'
          }}>
            {isOpening ? 'Mengambil pesan...' : 'Buka Surat'}
          </div>
        </motion.button>

        {/* --- AREA PESAN (KARTU) --- */}
        <div style={{ minHeight: '180px', width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {currentMsg && !isOpening && (
              <motion.div
                key={clickCount}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -50, rotateX: 90 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="glass-panel"
                style={{
                  padding: '30px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '1px solid white',
                  position: 'relative',
                  width: '90%'
                }}
              >
                {/* Dekorasi Pin */}
                <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', fontSize: '2rem' }}>📌</div>

                <p style={{ 
                  fontSize: '1.2rem', 
                  lineHeight: '1.6', 
                  color: '#334155', 
                  fontStyle: 'italic',
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: '15px'
                }}>
                  "{currentMsg}"
                </p>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: '#94a3b8', 
                  borderTop: '1px solid #e2e8f0', 
                  paddingTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Surat ke-{clickCount}</span>
                  <span>From: Rehan ❤️</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- FOOTER (TOMBOL NEXT) --- */}
        {clickCount >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            style={{ marginTop: '30px', textAlign: 'center' }}
          >
            <p style={{ fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-muted)' }}>
              Udah cukup senyum-senyumnya? 🤭
            </p>
            <button onClick={handleNext} className="btn-glow">
              Gas ke Momen Serius ➝
            </button>
          </motion.div>
        )}

      </div>
    </PageTransition>
  );
};

export default LoveMessages;