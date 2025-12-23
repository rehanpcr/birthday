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
    if (status === 'success') {
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
        padding: '15px'
      }}>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel"
          style={{
            maxWidth: '600px',
            width: '100%',
            background: 'white',
            borderRadius: '20px',
            padding: '25px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            maxHeight: '95vh', 
            overflowY: 'auto', 
            display: 'flex', flexDirection: 'column'
          }}
        >
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#1e293b', fontWeight: 'bold', margin: '0 0 5px 0' }}>
              {status === 'success' ? 'Terima Kasih! 🎉' : 'Kirim Video Ucapan 🎥'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              {status === 'success' ? 'Video kamu berhasil dikirim.' : 'Rekam langsung dari sini ya!'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            
            {/* --- LAYAR SUKSES & GALERI --- */}
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ width: '100%' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="btn-glow"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    Kirim Video Lain?
                  </button>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#334155' }}>
                    Lihat Ucapan Lainnya:
                  </h3>
                </div>

                {loadingVideos ? (
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', textAlign: 'center' }}>Memuat video...</p>
                ) : otherVideos.length === 0 ? (
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', textAlign: 'center' }}>Belum ada video lain.</p>
                ) : (
                  /* --- GALERI SCROLL MANUAL (SCROLLBAR HIDDEN) --- */
                  <div 
                    style={{ 
                      width: '100%', 
                      overflowX: 'auto', // TETAP BISA SCROLL
                      display: 'flex',
                      gap: '15px',
                      padding: '10px 5px 20px 5px',
                      scrollBehavior: 'smooth',
                      WebkitOverflowScrolling: 'touch', // Smooth scroll di HP
                      
                      // HILANGKAN SCROLLBAR (CSS Inline)
                      scrollbarWidth: 'none', // Firefox
                      msOverflowStyle: 'none' // IE/Edge
                    }}
                    className="hide-scrollbar" 
                  >
                    {/* HILANGKAN SCROLLBAR (Chrome/Safari/Opera) */}
                    <style>{`
                      .hide-scrollbar::-webkit-scrollbar {
                        display: none; 
                      }
                    `}</style>

                    {otherVideos.map((vid) => (
                      <motion.div
                        key={vid.id}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedVideo(vid)}
                        style={{
                          position: 'relative', 
                          width: '200px', 
                          height: '300px',
                          flexShrink: 0,
                          borderRadius: '15px', 
                          overflow: 'hidden', 
                          cursor: 'pointer',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.1)', 
                          border: '2px solid white',
                          background: '#000'
                        }}
                      >
                        <video 
                          src={vid.video_url} muted loop playsInline
                          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
                        />
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '15px',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                          color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
                        }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{vid.name}</h3>
                          <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>{vid.relation}</p>
                        </div>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2rem', color: 'white', opacity: 0.8 }}>▶</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              /* --- FORM & REKAM --- */
              <motion.form 
                key="form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onSubmit={handleSubmit} 
                style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
              >
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    type="text" required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                    placeholder="Nama Kamu"
                  />
                  <select
                    required
                    value={formData.relation}
                    onChange={e => setFormData({...formData, relation: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: 'white' }}
                  >
                    <option value="">Hubungan...</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Sahabat">Sahabat</option>
                    <option value="Teman">Teman</option>
                    <option value="Bos Besar">Bos Besar</option>
                  </select>
                </div>

                {/* AREA REKAM VIDEO */}
                <div style={{ 
                  width: '100%', 
                  height: '350px', 
                  background: '#000', borderRadius: '15px', 
                  overflow: 'hidden', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}>
                  {status === 'idle' && (
                    <div style={{ textAlign: 'center', color: 'white' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📷</div>
                      <p>Siap merekam?</p>
                    </div>
                  )}

                  {status === 'recording' && (
                    <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                  )}
                  
                  {status === 'review' && videoPreview && (
                    <video src={videoPreview} controls playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  )}

                  <div style={{ position: 'absolute', bottom: '20px', left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: '15px', zIndex: 10 }}>
                    {status === 'idle' && (
                      <button type="button" onClick={startRecording} className="btn-glow" style={{ padding: '12px 35px', background: '#ef4444', border: 'none', fontSize: '1rem' }}>● Mulai</button>
                    )}
                    {status === 'recording' && (
                      <button type="button" onClick={stopRecording} className="btn-glow" style={{ padding: '12px 35px', background: 'white', color: 'red', border: 'none', fontSize: '1rem' }}>■ Stop</button>
                    )}
                    {status === 'review' && (
                      <button type="button" onClick={retakeVideo} style={{ padding: '10px 25px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>↺ Ulangi</button>
                    )}
                  </div>

                  {status === 'recording' && (
                    <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'red', color: 'white', padding: '5px 12px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold' }} className="animate-pulse">REC</div>
                  )}
                </div>

                <textarea
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '60px', fontSize: '0.95rem', fontFamily: 'inherit' }}
                  placeholder="Tulis pesan singkat..."
                />

                {status === 'review' && (
                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn-glow"
                    style={{ width: '100%', padding: '14px', fontSize: '1rem', opacity: uploading ? 0.7 : 1, cursor: uploading ? 'not-allowed' : 'pointer' }}
                  >
                    {uploading ? 'Mengirim...' : 'Kirim Video 🚀'}
                  </button>
                )}

                {status === 'error' && (
                  <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.8rem', margin: 0 }}>Gagal upload. Cek koneksi internetmu.</p>
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
                backdropFilter: 'blur(5px)'
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
                  <button onClick={() => setSelectedVideo(null)} style={{ background: '#fee2e2', border: 'none', color: '#ef4444', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
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