import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useJourney } from '../context/JourneyContext';
import PageTransition from '../layouts/PageTransition';

const VideoMessages = () => {
  const navigate = useNavigate();
  const { nextStep } = useJourney();
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Ref & Scroll Logic
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  // Fetch Data
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let { data, error } = await supabase
          .from('video_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVideos(data || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Hitung lebar scroll (Ping-Pong Effect)
  useEffect(() => {
    if (contentRef.current && scrollRef.current && videos.length > 0) {
      const contentW = contentRef.current.scrollWidth;
      const containerW = scrollRef.current.offsetWidth;
      setScrollWidth(contentW - containerW > 0 ? contentW - containerW + 40 : 0);
    }
  }, [videos, loading]);

  const handleNext = () => {
    nextStep();
    navigate('/candle');
  };

  return (
    <PageTransition>
      <div style={{ 
        width: '100%', 
        minHeight: '100vh',
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '20px 0'
      }}>
        
        {/* Dekorasi Background */}
        <div style={{ position: 'fixed', top: '10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(60px)', zIndex: -1 }} />
        <div style={{ position: 'fixed', bottom: '10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(60px)', zIndex: -1 }} />

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '40px', padding: '0 20px', zIndex: 10 }}
        >
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontFamily: "'Playfair Display', serif", 
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            Special Wishes 🎥
          </h2>
          <p style={{ color: '#ffffffff', fontSize: '1rem' }}>
            Ucapan dari orang-orang tersayang khusus buat kamu.
          </p>
        </motion.div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex-center" style={{ minHeight: '300px' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid var(--accent-pink)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '15px', color: 'var(--text-muted)' }}>Mengambil video...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="glass-panel flex-center" style={{ width: '90%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📭</div>
            <p style={{ color: '#ffffffff' }}>Belum ada video ucapan yang masuk nih.</p>
          </div>
        ) : (
          /* === CONTAINER SCROLL HORIZONTAL (PING-PONG) === */
          <div 
            ref={scrollRef}
            style={{ 
              width: '100%', 
              position: 'relative', 
              overflow: 'hidden', 
              padding: '20px 0',
              marginBottom: '30px',
              // Masking gradasi kiri-kanan
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' 
            }}
          >
            <motion.div
              ref={contentRef}
              style={{ 
                display: 'flex', 
                gap: '25px', 
                width: 'max-content',
                paddingLeft: '30px', 
                paddingRight: '30px' 
              }}
              // LOGIKA ANIMASI PING-PONG
              animate={{ x: scrollWidth > 0 ? [0, -scrollWidth] : 0 }} 
              transition={{ 
                ease: "linear", 
                duration: Math.max(15, videos.length * 6), // Durasi disesuaikan jumlah video
                repeat: Infinity,
                repeatType: "mirror", 
                repeatDelay: 1 
              }}
            >
              {videos.map((vid) => (
                <motion.div
                  key={vid.id}
                  whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, y: -10 }}
                  onClick={() => setSelectedVideo(vid)}
                  style={{
                    position: 'relative',
                    width: '220px',    
                    height: '350px',   
                    flexShrink: 0,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                    border: '4px solid white',
                    background: '#000',
                    transform: 'rotate(-2deg)' // Miring dikit biar estetik
                  }}
                >
                  <video 
                    src={vid.video_url}
                    muted 
                    loop 
                    playsInline
                    // onMouseOver={event => event.target.play()} // Opsional: Play pas di-hover
                    // onMouseOut={event => event.target.pause()}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
                  />
                  
                  {/* Overlay Gradient Bawah */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, width: '100%', padding: '20px 15px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', fontFamily: "'Playfair Display', serif" }}>{vid.name}</h3>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{vid.relation}</p>
                  </div>
                  
                  {/* Icon Play Tengah */}
                  <div style={{ 
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                    fontSize: '3rem', color: 'white', opacity: 0.8,
                    filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))'
                  }}>
                    ▶
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex-center"
            style={{ paddingBottom: '30px' }}
          >
            <button onClick={handleNext} className="btn-glow">
              Lanjut ga sih?
            </button>
          </motion.div>
        )}

        {/* === MODAL VIDEO PLAYER (FULLSCREEN & ESTETIK) === */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0, 0, 0, 0.85)', zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'white', borderRadius: '25px', width: '100%', maxWidth: '400px', // MaxWidth kecil biar kayak HP
                  overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                  display: 'flex', flexDirection: 'column', maxHeight: '90vh'
                }}
              >
                {/* Header Modal */}
                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#1e293b', fontWeight: 'bold', fontFamily: "'Playfair Display', serif" }}>
                      {selectedVideo.name}
                    </h3>
                    {selectedVideo.message && (
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px', fontStyle: 'italic' }}>
                            "{selectedVideo.message}"
                        </p>
                    )}
                  </div>
                  <button 
                    onClick={() => setSelectedVideo(null)} 
                    style={{ 
                        background: '#fee2e2', border: 'none', color: '#ef4444', 
                        width: '35px', height: '35px', borderRadius: '50%', 
                        cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                {/* Video Player */}
                <div style={{ background: 'black', flexGrow: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <video 
                    controls 
                    autoPlay 
                    playsInline // Agar di iPhone tidak otomatis fullscreen native player
                    style={{ width: '100%', height: '100%', maxHeight: '60vh', objectFit: 'contain' }}
                  >
                    <source src={selectedVideo.video_url} type="video/mp4" />
                    Browser kamu tidak support video.
                  </video>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
};

export default VideoMessages; 