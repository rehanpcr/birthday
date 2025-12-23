import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';
import PageTransition from '../layouts/PageTransition';

const Pause = () => {
  const navigate = useNavigate();
  const { nextStep } = useJourney();

  const handleNext = () => {
    nextStep();
    navigate('/letter'); 
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
        padding: '20px',
        position: 'relative'
      }}>

        {/* Dekorasi Background yang sangat subtle/lembut */}
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* --- KONTEN UTAMA --- */}
        <div style={{ textAlign: 'center', zIndex: 10 }}>
          
          {/* 1. VISUALISASI PERNAPASAN (Lingkaran yang membesar/mengecil) */}
          <div style={{ position: 'relative', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
            {/* Lingkaran Luar (Glow) */}
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1], 
                opacity: [0.3, 0.1, 0.3] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.3)',
                filter: 'blur(20px)'
              }}
            />
            
            {/* Lingkaran Dalam (Solid) */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                boxShadow: '0 0 30px rgba(255,255,255,0.2)'
              }}
            />
          </div>

          {/* 2. TEKS MINIMALIS & DEWASA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontFamily: "'Playfair Display', serif", 
              color: '#e2e8f0',
              marginBottom: '15px',
              letterSpacing: '2px'
            }}>
              Sebuah Jeda
            </h2>
            <p style={{ 
              fontSize: '1rem', 
              color: '#ffffffff', 
              maxWidth: '400px', 
              lineHeight: '1.8',
              margin: '0 auto 40px auto',
              fontWeight: '300'
            }}>
              Halaman berikutnya sedikit lebih panjang dan personal.<br/>
              Ambil napas sejenak, jangan terburu-buru.
            </p>
          </motion.div>

          {/* 3. TOMBOL (Muncul belakangan biar dia beneran jeda) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 1 }} // Delay 3.5 detik
          >
            <button 
              onClick={handleNext} 
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#cbd5e1',
                padding: '12px 30px',
                borderRadius: '30px',
                fontSize: '0.9rem',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: "'Playfair Display', serif"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.borderColor = 'rgba(255,255,255,0.8)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                e.target.style.color = '#cbd5e1';
              }}
            >
              Buka Surat
            </button>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
};

export default Pause;