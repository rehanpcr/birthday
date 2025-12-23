import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import PageTransition from '../layouts/PageTransition';

const Upload = () => {
  const [formData, setFormData] = useState({ name: '', relation: '', message: '' });
  
  // State Perekaman
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null); 
  const [videoPreview, setVideoPreview] = useState(null); 
  const [stream, setStream] = useState(null); 
  
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const chunksRef = useRef([]);

  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('idle'); 

  // State Galeri Video
  const [otherVideos, setOtherVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // --- EFEK: Fetch Video ---
  useEffect(() => {
    if (status === 'success' || status === 'gallery') {
      fetchOtherVideos();
    }
  }, [status]);

  const fetchOtherVideos = async () => {
    setLoadingVideos(true);
    try {
      const { data, error } = await supabase
        .from('video_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOtherVideos(data || []);
    } catch (err) {
      console.error("Gagal ambil video:", err);
    } finally {
      setLoadingVideos(false);
    }
  };

  // --- EFEK: Live Preview Kamera ---
  useEffect(() => {
    if (status === 'recording' && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [status, stream]);

  // --- FUNGSI PEREKAMAN ---
  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream); 
      setStatus('recording'); 

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        setVideoPreview(URL.createObjectURL(blob));
        mediaStream.getTracks().forEach(track => track.stop());
        setStream(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Gagal akses kamera:", err);
      alert("Gagal akses kamera. Pastikan izin diberikan ya!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus('review');
    }
  };

  const retakeVideo = () => {
    setRecordedBlob(null);
    setVideoPreview(null);
    setStatus('idle');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recordedBlob || !formData.name) return;

    setUploading(true);

    try {
      const fileExt = 'webm';
      const fileName = `${Date.now()}_${formData.name.replace(/\s/g, '_')}.${fileExt}`;
      const fileToUpload = new File([recordedBlob], fileName, { type: 'video/webm' });

      const { error: uploadError } = await supabase.storage
        .from('birthday-videos').upload(fileName, fileToUpload);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('birthday-videos').getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('video_messages')
        .insert([{
            name: formData.name,
            relation: formData.relation,
            message: formData.message,
            video_url: publicUrl,
          }]);
      if (dbError) throw dbError;

      setStatus('success');
      setFormData({ name: '', relation: '', message: '' });
      setRecordedBlob(null);
      setVideoPreview(null);

    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageTransition>
      <div style={{ 
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        overflow: 'hidden', 
        display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #fdfbf7 0%, #e2e8f0 100%)',
        padding: '15px',
        fontFamily: "'Inter', sans-serif"
      }}>

        {/* --- DEKORASI BACKGROUND --- */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '4rem', opacity: 0.1 }}>🎈</motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 7, repeat: Infinity }} style={{ position: 'absolute', bottom: '15%', right: '5%', fontSize: '5rem', opacity: 0.1 }}>🎁</motion.div>
        <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity }} style={{ position: 'absolute', top: '20%', right: '15%', fontSize: '3rem', opacity: 0.1 }}>✨</motion.div>

        {/* --- CARD UTAMA --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel"
          style={{
            maxWidth: '550px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            padding: '30px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
            maxHeight: '95vh', 
            overflowY: 'auto', 
            display: 'flex', flexDirection: 'column',
            position: 'relative',
            zIndex: 10,
            border: '1px solid rgba(255,255,255,0.8)'
          }}
        >
          
          {/* Header & Navigasi */}
          <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative' }}>
            {status === 'gallery' && (
              <button 
                onClick={() => setStatus('idle')}
                style={{ 
                  position: 'absolute', left: 0, top: '5px',
                  background: '#f1f5f9', border: 'none', 
                  width: '35px', height: '35px', borderRadius: '50%',
                  cursor: 'pointer', color: '#64748b', fontSize: '1.2rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
              >
                ←
              </button>
            )}

            <h2 style={{ 
              fontSize: '1.8rem', color: '#1e293b', 
              fontWeight: '800', margin: '0 0 5px 0',
              background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontFamily: "'Playfair Display', serif"
            }}>
              {status === 'success' ? 'Yeay! Terkirim! 🎉' : status === 'gallery' ? 'Gallery' : 'Kirim Video 🎥'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, fontWeight: '500' }}>
              {status === 'success' ? 'Makasih udah ikut ngeramein!' : status === 'gallery' ? 'Kumpulan doa terbaik buat Thia.' : 'Rekam doa & harapanmu buat Thia!'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            
            {/* --- MODE GALERI (VIEW) --- */}
            {(status === 'success' || status === 'gallery') ? (
              <motion.div
                key="gallery-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: '100%' }}
              >
                {status === 'success' && (
                  <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStatus('idle')}
                      style={{ 
                        background: 'linear-gradient(45deg, #ec4899, #8b5cf6)',
                        color: 'white', border: 'none',
                        padding: '12px 25px', borderRadius: '50px',
                        fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(236, 72, 153, 0.3)'
                      }}
                    >
                      + Kirim Video Lagi
                    </motion.button>
                  </div>
                )}

                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '4px', height: '20px', background: '#ec4899', borderRadius: '2px' }}></div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#334155', margin: 0 }}>
                    {status === 'success' ? 'Video Teman Lainnya:' : 'Daftar Video Masuk:'}
                  </h3>
                </div>

                {loadingVideos ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                    <div className="animate-spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '3px solid #cbd5e1', borderTopColor: '#ec4899', borderRadius: '50%', marginBottom: '10px' }}></div>
                    <p style={{ fontSize: '0.9rem' }}>Sedang memuat...</p>
                  </div>
                ) : otherVideos.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', background: '#f8fafc', borderRadius: '15px' }}>
                    <p style={{ fontSize: '2rem', margin: 0 }}>📭</p>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Belum ada video nih. Jadilah yang pertama!</p>
                  </div>
                ) : (
                  /* --- SCROLLABLE GALLERY --- */
                  <div 
                    className="hide-scrollbar"
                    style={{ 
                      width: '100%', overflowX: 'auto', display: 'flex', gap: '15px',
                      padding: '10px 5px 25px 5px', scrollBehavior: 'smooth',
                      WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none'
                    }}
                  >
                    <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

                    {otherVideos.map((vid, i) => (
                      <motion.div
                        key={vid.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedVideo(vid)}
                        style={{
                          position: 'relative', width: '180px', height: '280px', flexShrink: 0,
                          borderRadius: '18px', overflow: 'hidden', cursor: 'pointer',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: '#000',
                          border: '3px solid white'
                        }}
                      >
                        <video src={vid.video_url} muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                        
                        {/* Overlay Info */}
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '15px 12px',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                          color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
                        }}>
                          <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', margin: 0, lineHeight: 1.2 }}>{vid.name}</h3>
                          <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>
                            {vid.relation}
                          </span>
                        </div>
                        
                        {/* Play Icon */}
                        <div style={{ 
                          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                          width: '40px', height: '40px', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(5px)',
                          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '1px solid rgba(255,255,255,0.5)'
                        }}>
                          <div style={{ width: 0, height: 0, borderLeft: '12px solid white', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', marginLeft: '4px' }}></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              /* --- MODE FORM & REKAM --- */
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit} 
                style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
              >
                
                {/* Tombol Lihat Galeri */}
                <div style={{ textAlign: 'right', marginTop: '-10px' }}>
                  <button 
                    type="button"
                    onClick={() => setStatus('gallery')}
                    style={{ 
                      background: 'rgba(236, 72, 153, 0.1)', border: 'none', color: '#db2777', 
                      fontSize: '0.8rem', padding: '6px 12px', borderRadius: '15px',
                      cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px'
                    }}
                  >
                    📸 Lihat Galeri Video
                  </button>
                </div>

                {/* Input Data Diri */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold', marginLeft: '5px', marginBottom: '5px', display: 'block' }}>Nama Kamu</label>
                    <input
                      type="text" required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      style={{ 
                        width: '100%', padding: '12px', borderRadius: '12px', 
                        border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none',
                        background: '#f8fafc', transition: 'all 0.2s'
                      }}
                      placeholder="masukkan namamu"
                      onFocus={(e) => e.target.style.borderColor = '#ec4899'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold', marginLeft: '5px', marginBottom: '5px', display: 'block' }}>Hubungan</label>
                    <select
                      required
                      value={formData.relation}
                      onChange={e => setFormData({...formData, relation: e.target.value})}
                      style={{ 
                        width: '100%', padding: '12px', borderRadius: '12px', 
                        border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none',
                        background: '#f8fafc', cursor: 'pointer'
                      }}
                    >
                      <option value="">Pilih...</option>
                      <option value="Keluarga">Keluarga 🏠</option>
                      <option value="Sahabat">Sahabat 🤝</option>
                      <option value="Teman">Teman ✌️</option>
                      <option value="Bos Besar">Bos Besar</option>
                    </select>
                  </div>
                </div>

                {/* AREA REKAM VIDEO (CAMERA UI) */}
                <div style={{ 
                  width: '100%', height: '380px', 
                  background: '#000', borderRadius: '25px', 
                  overflow: 'hidden', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.2)', border: '4px solid #1e293b'
                }}>
                  {status === 'idle' && (
                    <div style={{ textAlign: 'center', color: 'white' }}>
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                        style={{ fontSize: '3rem', marginBottom: '10px' }}
                      >
                        📷
                      </motion.div>
                      <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Siap merekam?</p>
                    </div>
                  )}

                  {status === 'recording' && (
                    <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                  )}
                  
                  {status === 'review' && videoPreview && (
                    <video src={videoPreview} controls playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  )}

                  {/* UI CONTROLS DI DALAM KAMERA */}
                  <div style={{ 
                    position: 'absolute', bottom: '20px', left: 0, width: '100%', 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', zIndex: 10 
                  }}>
                    {status === 'idle' && (
                      <motion.button 
                        type="button" 
                        whileTap={{ scale: 0.9 }}
                        onClick={startRecording} 
                        style={{ 
                          width: '60px', height: '60px', borderRadius: '50%',
                          background: '#ef4444', border: '4px solid rgba(255,255,255,0.5)',
                          cursor: 'pointer', boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)'
                        }}
                      />
                    )}
                    {status === 'recording' && (
                      <motion.button 
                        type="button" 
                        whileTap={{ scale: 0.9 }}
                        onClick={stopRecording} 
                        style={{ 
                          width: '60px', height: '60px', borderRadius: '50%',
                          background: 'white', border: '4px solid rgba(255,0,0,0.5)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }}
                      >
                        <div style={{ width: '24px', height: '24px', background: '#ef4444', borderRadius: '4px' }}></div>
                      </motion.button>
                    )}
                    {status === 'review' && (
                      <motion.button 
                        type="button" 
                        whileTap={{ scale: 0.95 }}
                        onClick={retakeVideo} 
                        style={{ 
                          padding: '10px 20px', background: 'rgba(255,255,255,0.2)', 
                          color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '30px', 
                          cursor: 'pointer', backdropFilter: 'blur(5px)', fontSize: '0.9rem', fontWeight: '500'
                        }}
                      >
                        ↺ Ulangi
                      </motion.button>
                    )}
                  </div>

                  {status === 'recording' && (
                    <div style={{ 
                      position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
                      background: 'rgba(0,0,0,0.5)', color: 'white', padding: '5px 15px', 
                      borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      <div className="animate-pulse" style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></div>
                      REC
                    </div>
                  )}
                </div>

                {/* Input Pesan */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold', marginLeft: '5px', marginBottom: '5px', display: 'block' }}>Pesan Singkat</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    style={{ 
                      width: '100%', padding: '15px', borderRadius: '15px', 
                      border: '1px solid #e2e8f0', minHeight: '80px', fontSize: '0.95rem', fontFamily: 'inherit',
                      background: '#f8fafc', outline: 'none'
                    }}
                    placeholder="Tulis harapan & doa kamu disini..."
                    onFocus={(e) => e.target.style.borderColor = '#ec4899'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Tombol Kirim */}
                {status === 'review' && (
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={uploading}
                    className="btn-glow"
                    style={{ 
                      width: '100%', padding: '16px', fontSize: '1.1rem', 
                      opacity: uploading ? 0.7 : 1, cursor: uploading ? 'not-allowed' : 'pointer',
                      borderRadius: '15px', marginTop: '5px'
                    }}
                  >
                    {uploading ? 'Mengirim Video...' : 'Kirim Video Sekarang 🚀'}
                  </motion.button>
                )}

                {status === 'error' && (
                  <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '10px', textAlign: 'center', fontSize: '0.9rem' }}>
                    ❌ Gagal upload. Coba lagi atau cek koneksi internet.
                  </div>
                )}

              </motion.form>
            )}
          </AnimatePresence>

        </motion.div>

        {/* === MODAL VIDEO PLAYER === */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0, 0, 0, 0.9)', zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'white', borderRadius: '25px', width: '100%', maxWidth: '500px',
                  overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                  display: 'flex', flexDirection: 'column', maxHeight: '90vh'
                }}
              >
                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#1e293b', fontWeight: 'bold', fontFamily: "'Playfair Display', serif" }}>{selectedVideo.name}</h3>
                    {selectedVideo.message && <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px', fontStyle: 'italic' }}>"{selectedVideo.message}"</p>}
                  </div>
                  <button onClick={() => setSelectedVideo(null)} style={{ background: '#fee2e2', border: 'none', color: '#ef4444', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>✕</button>
                </div>
                <div style={{ background: 'black', flexGrow: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <video controls autoPlay playsInline style={{ width: '100%', height: '100%', maxHeight: '70vh', objectFit: 'contain' }}>
                    <source src={selectedVideo.video_url} type="video/mp4" />
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

export default Upload;