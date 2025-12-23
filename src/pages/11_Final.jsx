import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import Navigation
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useJourney } from "../context/JourneyContext"; // Import Context
import PageTransition from "../layouts/PageTransition";

// Import foto terbaik
import heroImage from "../assets/photos/foto6.jpg";

const Final = () => {
  const navigate = useNavigate();
  const { resetJourney } = useJourney(); // Ambil fungsi reset
  const [isClaimed, setIsClaimed] = useState(false);

  // Efek Confetti saat load halaman
  useEffect(() => {
    triggerConfetti();
  }, []);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3, angle: 60, spread: 55, origin: { x: 0 },
        colors: ["#ec4899", "#8b5cf6", "#facc15"],
      });
      confetti({
        particleCount: 3, angle: 120, spread: 55, origin: { x: 1 },
        colors: ["#ec4899", "#8b5cf6", "#facc15"],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleClaim = () => {
    triggerConfetti(); 
    setIsClaimed(true); 
  };

  // Fungsi Restart
  const handleRestart = () => {
    resetJourney(); // Hapus progress step
    navigate("/");  // Balik ke halaman gembok
  };

  return (
    <PageTransition>
      {/* WRAPPER UTAMA: LOCKED FULL SCREEN */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          overflow: "hidden", 
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
          backgroundSize: "400% 400%",
          animation: "gradientBG 15s ease infinite",
          padding: "15px",
        }}
      >
        <style>{`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>

        {/* KARTU TENGAH */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="glass-panel"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            borderRadius: "30px",
            padding: "30px",
            width: "100%",
            maxWidth: "450px", 
            maxHeight: "98vh",
            boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
            textAlign: "center",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          }}
        >
          {/* Foto Profil */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              width: "200px", height: "200px", 
              borderRadius: "50%", overflow: "hidden",
              border: "5px solid white",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              marginBottom: "20px", flexShrink: 0,
            }}
          >
            <img
              src={heroImage}
              alt="Birthday"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>

          {/* Judul & Pesan */}
          <motion.h1
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{
              fontSize: "2rem",
              fontFamily: "'Playfair Display', serif", fontWeight: "bold",
              background: "linear-gradient(to right, #ec4899, #8b5cf6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: "5px", marginTop: 0,
            }}
          >
            Happy Birthday!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{
              fontSize: "1rem", color: "#64748b", marginBottom: "25px", lineHeight: "1.5",
            }}
          >
            Terima kasih udah lahir dan bertahan sejauh ini.
            <br />
            Dunia ini lebih indah karena ada kamu.
            <br />
            <i>I love you more than words can say.</i>
          </motion.p>

          {/* --- VOUCHER --- */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 }}
            style={{
              background: "#1e293b", color: "#f1f5f9",
              borderRadius: "15px", padding: "18px", marginBottom: "25px",
              width: "100%", position: "relative", border: "2px dashed #475569",
            }}
          >
            <div style={{ position: "absolute", top: "50%", left: "-8px", width: "16px", height: "16px", background: "white", borderRadius: "50%", transform: "translateY(-50%)" }} />
            <div style={{ position: "absolute", top: "50%", right: "-8px", width: "16px", height: "16px", background: "white", borderRadius: "50%", transform: "translateY(-50%)" }} />

            <h3 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8", marginBottom: "2px" }}>
              EMERGENCY CARD
            </h3>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#38bdf8", margin: "5px 0" }}>
              Bebas Ngambek 🛡️
            </h2>
            <p style={{ fontSize: "0.75rem", color: "#cbd5e1", margin: 0 }}>
              Tukarkan ini saat kita berantem, dan aku akan langsung minta maaf.
            </p>
          </motion.div>

          {/* --- TOMBOL INTERAKTIF --- */}
          <div style={{ width: '100%', minHeight: '50px' }}>
            <AnimatePresence mode="wait">
                {!isClaimed ? (
                    <motion.button
                        key="btn-claim"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClaim}
                        className="btn-glow"
                        style={{ width: "100%", padding: "14px", fontSize: "1rem", cursor: 'pointer' }}
                    >
                        Klaim Hadiah Sekarang 🎁
                    </motion.button>
                ) : (
                    <motion.div
                        key="msg-success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ 
                            padding: '12px', 
                            background: '#dcfce7', 
                            color: '#166534', 
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            border: '1px solid #22c55e'
                        }}
                    >
                        ✅ Berhasil Diklaim! Peluk aku sekarang! 🫂❤️
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* --- TOMBOL RESTART (BARU) --- */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            onClick={handleRestart}
            style={{
              marginTop: "20px",
              background: "transparent",
              border: "1px solid #cbd5e1",
              color: "#94a3b8",
              padding: "8px 20px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
            whileHover={{ scale: 1.05, borderColor: "#94a3b8", color: "#64748b" }}
          >
            Main Lagi 🔄
          </motion.button>

          <div style={{ marginTop: "10px", fontSize: "0.8rem", color: "#cbd5e1", fontFamily: "'Dancing Script', cursive" }}>
            Made with ❤️ by Rehan
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Final;