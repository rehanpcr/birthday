import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';
import PageTransition from '../layouts/PageTransition';

// DATA SIFAT (Total 12 Poin)
const traits = [
  { 
    emoji: "🧕", 
    title: "Sholehah", 
    desc: "Adem banget rasanya kalau liat kamu lagi ibadah. Calon makmum idaman." 
  },
  { 
    emoji: "🧠", 
    title: "Pintar", 
    desc: "Obrolan sama kamu tuh selalu 'berisi'. Kamu cerdas banget, bikin aku kagum." 
  },
  { 
    emoji: "💖", 
    title: "Cantik", 
    desc: "Gak perlu makeup tebel, senyum kamu aja udah cukup bikin deg-degan." 
  },
  { 
    emoji: "😤", 
    title: "Mode Galak", 
    desc: "Kalo lagi marah serem, tapi kadang gemes. Ampun kanjeng ratu! ✌️" 
  },
  { 
    emoji: "🐨", 
    title: "Clingy", 
    desc: "Kadang cuek, eh tiba-tiba manja nempel terus. Jujur, aku suka fase ini." 
  },
  { 
    emoji: "🤪", 
    title: "Ceroboh", 
    desc: "Sering kesandung atau jatohin barang kalau sama aku. Lucu, sini aku jagain." 
  },
  { 
    emoji: "📢", 
    title: "Yapping", 
    desc: "Hobi banget ngomong terus (yapping). Anehnya, aku gak pernah bosen dengernya." 
  },
  { 
    emoji: "💸", 
    title: "Menteri Keuangan", 
    desc: "Suprisingly jago banget kelola uang. Hemat tapi tetep bisa happy, salut deh!" 
  },
  { 
    emoji: "💡", 
    title: "Teman Diskusi", 
    desc: "Tempat terbaik buat tukar pikiran. Sudut pandang kamu selalu bikin aku mikir 'Wah bener juga ya'." 
  },
  { 
    emoji: "👩‍👧", 
    title: "Keibuan", 
    desc: "Liat interaksi kamu sama adekmu, aku jadi yakin kamu bakal jadi ibu yang hebat nanti." 
  },
  { 
    emoji: "👩‍🏫", 
    title: "Bu Guru", 
    desc: "Cara kamu ngejelasin sesuatu tuh enak banget dan sabar. Punya bakat ngajar alami." 
  },
  { 
    emoji: "🏠", 
    title: "Rumahku", 
    desc: "Apapun sifat kamu hari ini, kamu tetap tempat ternyaman buat aku pulang." 
  },
];

// Animasi Container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 } 
  }
};

// Animasi Item
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const About = () => {
  const navigate = useNavigate();
  const { nextStep } = useJourney();

  const handleNext = () => {
    nextStep();
    navigate('/moments');
  };

  return (
    <PageTransition>
      {/* WRAPPER UTAMA */}
      <div style={{ 
        minHeight: '100vh', 
        width: '100%', 
        position: 'relative', 
        overflowX: 'hidden', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px'
      }}>
        
        {/* Dekorasi Background */}
        <div style={{
          position: 'fixed', top: '5%', right: '-100px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%', zIndex: -1, filter: 'blur(60px)', pointerEvents: 'none'
        }} />
        
        <div style={{
          position: 'fixed', bottom: '10%', left: '-100px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%', zIndex: -1, filter: 'blur(60px)', pointerEvents: 'none'
        }} />

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}
        >
          <h3 style={{ fontSize: '0.9rem', letterSpacing: '2px', color: '#64748b', textTransform: 'uppercase' }}>
            All About You
          </h3>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginTop: '5px'
          }}>
            Hal Tentang Kamu
          </h2>
        </motion.div>

        {/* GRID KARTU (Responsif) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            maxWidth: '1000px',
            width: '100%',
            marginBottom: '40px'
          }}
        >
          {traits.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-panel"
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.6)', 
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.emoji}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* FOOTER BUTTON */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ paddingBottom: '20px' }}
        >
          <button onClick={handleNext} className="btn-glow">
            Lanjut ke Kenangan Kita 
          </button>
        </motion.div>

      </div>
    </PageTransition>
  );
};

export default About;