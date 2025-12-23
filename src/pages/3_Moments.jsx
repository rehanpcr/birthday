import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';
import PageTransition from '../layouts/PageTransition';

// =========================================
// AREA IMPORT FOTO (Pastikan file ada di src/assets/photos/)
// =========================================
// Ganti nama file sesuai yang kamu punya (misal .jpeg, .png)

import img1 from '../assets/photos/foto1.jpg';
import img2 from '../assets/photos/foto2.jpg';
import img3 from '../assets/photos/foto3.jpg';
import img4 from '../assets/photos/foto4.jpg';
import img5 from '../assets/photos/foto5.jpg';
import img6 from '../assets/photos/foto6.jpg'; // Tambahan
import img7 from '../assets/photos/foto7.jpg'; // Tambahan
import img8 from '../assets/photos/foto8.jpg'; // Tambahan
import img9 from '../assets/photos/foto9.jpg'; // Tambahan
import img10 from '../assets/photos/foto10.jpg'; // Tambahan

// =========================================
// DATA FOTO & CAPTION (Total 10)
// =========================================
const photos = [
  { id: 1, url: img1, caption: "First Date ❤️" },
  { id: 2, url: img2, caption: "Liburan Kita ✈️" },
  { id: 3, url: img3, caption: "Silly Face 🤪" },
  { id: 4, url: img4, caption: "Senyum Manismu" },
  { id: 5, url: img5, caption: "Random Moment" },
  // --- 5 Tambahan Baru ---
  { id: 6, url: img6, caption: "Kulineran Time 🍜" },
  { id: 7, url: img7, caption: "Dibuang Sayang 😂" },
  { id: 8, url: img8, caption: "Edisi Kondangan ✨" },
  { id: 9, url: img9, caption: "Muka Bantal 😴" },
  { id: 10, url: img10, caption: "Love You 3000 ❤️" },
];

// Duplikasi array untuk efek looping seamless
const duplicatedPhotos = [...photos, ...photos].map((item, index) => ({
  ...item,
  uniqueId: `${item.id}-${index}`
}));

const Moments = () => {
  const navigate = useNavigate();
  const { nextStep } = useJourney();

  const handleNext = () => {
    nextStep();
    navigate('/memory-game');
  };

  return (
    <PageTransition>
      <div style={{ 
        minHeight: '100vh', width: '100%', overflow: 'hidden', 
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '40px 0', position: 'relative'
      }}>
        
        {/* Dekorasi Background (Blobs) */}
        <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(60px)', zIndex: -1 }} />
        <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(60px)', zIndex: -1 }} />

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '40px', padding: '0 20px', zIndex: 2 }}
        >
          <h3 style={{ fontSize: '0.9rem', letterSpacing: '3px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
            Flashback Time
          </h3>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            fontFamily: "'Playfair Display', serif",
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Our Sweetest <br/> Moments
          </h2>
        </motion.div>

        {/* === MARQUEE CONTAINER === */}
        <div style={{ 
          width: '100%', 
          position: 'relative',
          padding: '30px 0',
          marginBottom: '50px',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' 
        }}>
          
          <motion.div
            style={{ 
              display: 'flex', 
              gap: '30px', 
              width: 'max-content',
              paddingLeft: '30px'
            }}
            animate={{ x: "-50%" }} 
            transition={{ 
              ease: "linear", 
              duration: 60, // DIPERLAMBAT jadi 60 detik karena fotonya makin banyak
              repeat: Infinity 
            }}
          >
            {duplicatedPhotos.map((photo, index) => (
              <motion.div 
                key={photo.uniqueId}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 0, 
                  zIndex: 10,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}
                initial={{ rotate: index % 2 === 0 ? -3 : 3 }} 
                style={{
                  position: 'relative',
                  width: '240px',     
                  flexShrink: 0,
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,1)',
                  padding: '15px 15px 60px 15px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  cursor: 'grab'
                }}
              >
                {/* Frame Foto */}
                <div style={{
                  width: '100%',
                  height: '240px',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  backgroundColor: '#f1f5f9',
                  boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)'
                }}>
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    style={{ 
                      width: '100%', height: '100%', objectFit: 'cover',
                      filter: 'sepia(0.2) contrast(1.1)'
                    }} 
                  />
                </div>
                
                {/* Caption */}
                <div style={{ 
                  position: 'absolute',
                  bottom: '0', left: '0', width: '100%',
                  height: '60px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center',
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  color: '#334155', 
                  fontSize: '1.1rem',
                  padding: '0 10px'
                }}>
                  "{photo.caption}"
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex-center" 
          style={{ zIndex: 2 }}
        >
          <p style={{ marginBottom: '15px', fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
            Inget kan sama momen-momen itu? Sekarang kita tes ingatan kamu!
          </p>
          <button onClick={handleNext} className="btn-glow">
            Lanjut ke Game!
          </button>
        </motion.div>

      </div>
    </PageTransition>
  );
};

export default Moments;