import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';
import PageTransition from '../layouts/PageTransition';

const PreLanding = () => {
  const navigate = useNavigate();
  const { nextStep } = useJourney();
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [shake, setShake] = useState(false);

  // --- KONFIGURASI PERTANYAAN & JAWABAN ---
  const QUESTION = "Siapa yang paling sering ngambek? 🤔";
  
  const OPTIONS = [
    { id: 'A', text: 'Aku (Rehan)', isCorrect: false }, // Ganti false/true sesuai fakta wkwk
    { id: 'B', text: 'Kamu (Sayangku)', isCorrect: true }, // Set true kalau ini jawabannya
    { id: 'C', text: 'Kucing Tetangga', isCorrect: false },
    { id: 'D', text: 'Pak RT', isCorrect: false },
  ];

  const handleOptionClick = (isCorrect) => {
    if (isCorrect) {
      // JIKA BENAR
      setIsUnlocked(true);
      setTimeout(() => {
        nextStep();
        navigate('/landing');
      }, 500);
    } else {
      // JIKA SALAH (Efek Getar)
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  // Variabel animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="full-screen flex-center" style={{ position: 'relative', overflow: 'hidden' }}>
        
        {/* --- BACKGROUND DECORATION --- */}
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(40px)', zIndex: -1
          }}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', bottom: '15%', right: '10%', width: '250px', height: '250px',
            background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(40px)', zIndex: -1
          }}
        />

        {/* --- MAIN CARD --- */}
        <motion.div
          className="glass-panel"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            maxWidth: '450px', width: '90%', padding: '40px 30px', 
            textAlign: 'center', border: '1px solid rgba(255,255,255,0.6)',
            position: 'relative'
          }}
        >
          {/* Ikon Gembok */}
          <motion.div 
            variants={itemVariants}
            animate={isUnlocked ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
            style={{ fontSize: '3rem', marginBottom: '10px' }}
          >
            {isUnlocked ? '🔓' : '🔒'}
          </motion.div>

          <motion.h3 variants={itemVariants} style={{ color: '#334155', fontWeight: 'bold', marginBottom: '5px' }}>
            Security Check
          </motion.h3>
          
          <motion.p variants={itemVariants} style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '30px' }}>
            Jawab dulu biar kuncinya terbuka 😜
          </motion.p>

          {/* PERTANYAAN */}
          <motion.div 
            variants={itemVariants}
            style={{ 
              background: 'rgba(255,255,255,0.5)', padding: '15px', borderRadius: '15px',
              marginBottom: '20px', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b'
            }}
          >
            {QUESTION}
          </motion.div>

          {/* OPSI JAWABAN (GRID) */}
          <motion.div 
            variants={itemVariants}
            // Animasi Getar jika salah
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}
          >
            {OPTIONS.map((opt, index) => (
              <motion.button
                key={opt.id}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.9)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOptionClick(opt.isCorrect)}
                style={{
                  padding: '15px', border: 'none', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.7)',
                  color: '#334155', fontWeight: 'bold', cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  fontSize: '0.95rem'
                }}
              >
                {opt.text}
              </motion.button>
            ))}
          </motion.div>

          {/* Pesan Error (Muncul jika salah) */}
          <AnimatePresence>
            {shake && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '20px', fontWeight: 'bold' }}
              >
                Hayoo salah... ngaku aja! 😜
              </motion.p>
            )}
          </AnimatePresence>

        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          style={{ position: 'absolute', bottom: '20px', fontSize: '11px', color: 'rgba(0,0,0,0.3)' }}
        >
          Made with ❤️ by Rehan
        </motion.p>

      </div>
    </PageTransition>
  );
};

export default PreLanding;