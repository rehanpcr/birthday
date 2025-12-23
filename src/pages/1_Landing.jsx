import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useJourney } from "../context/JourneyContext";
import PageTransition from "../layouts/PageTransition";

import fotoSyaftiani from "../assets/syaftiani.jpg";

// Array untuk dekorasi (Hati & Partikel Emas)
const hearts = Array.from({ length: 25 });
const particles = Array.from({ length: 30 });

const Landing = () => {
  const navigate = useNavigate();
  const { nextStep } = useJourney();

  const handleNext = () => {
    nextStep();
    navigate("/about");
  };

  // Variabel animasi teks per baris
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 1, ease: "easeOut" },
    }),
  };

  return (
    <PageTransition>
      <div
        className="full-screen flex-center"
        style={{ overflow: "hidden", position: "relative" }}
      >
        {/* --- ANIMASI PARTIKEL EMAS --- */}
        {particles.map((_, i) => (
          <motion.div
            key={`p-${i}`}
            initial={{ opacity: 0, y: Math.random() * 1000 }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [null, Math.random() * -1000],
              x: Math.random() * 100 - 50,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: Math.random() * 4 + 1 + "px",
              height: Math.random() * 4 + 1 + "px",
              background: "#fbbf24", // Warna Emas
              borderRadius: "50%",
              boxShadow: "0 0 5px #fbbf24",
              left: `${Math.random() * 100}%`,
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* --- ANIMASI HATI MELAYANG --- */}
        {hearts.map((_, i) => (
          <motion.div
            key={`h-${i}`}
            initial={{ opacity: 0, y: 100, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: -800,
              scale: [0, 1, 1.5],
              x: Math.random() * 150 - 75,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              position: "absolute",
              bottom: "-10%",
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 25 + 10}px`,
              color: i % 2 === 0 ? "#ec4899" : "#f43f5e",
              zIndex: 0,
              pointerEvents: "none",
              textShadow: "0 0 10px rgba(236, 72, 153, 0.5)",
            }}
          >
            ❤
          </motion.div>
        ))}

        {/* --- MAIN GLASS CARD (WIDE VERSION) --- */}
        <motion.div
          className="glass-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            position: "relative",
            zIndex: 10,
            // UBAH DISINI: MaxWidth diperbesar jadi 1000px agar melebar ke samping
            maxWidth: "1000px",
            width: "95%", // Hampir full layar di HP
            padding: "60px 40px", // Padding diperbesar dikit
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Dekorasi Garis Atas */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }} // Garis lebih panjang dikit
            transition={{ duration: 1.5, delay: 0.5 }}
            style={{
              height: "3px",
              background:
                "linear-gradient(to right, transparent, #fbbf24, transparent)",
              marginBottom: "30px",
            }}
          />

          {/* Subtitle */}
          <motion.h3
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            style={{
              fontSize: "1.2rem",
              fontWeight: "400",
              letterSpacing: "6px", // Spasi huruf diperlebar biar elegan
              marginBottom: "15px",
              color: "#cbd5e1",
              textTransform: "uppercase",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            A Special Day For
          </motion.h3>

          {/* NAMA UTAMA */}
          <motion.h1
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            style={{
              // Font size responsif (lebih besar di layar lebar)
              fontSize: "clamp(3rem, 6vw, 5rem)",
              fontWeight: "800",
              background:
                "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f472b6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "30px",
              lineHeight: 1.1,
              fontFamily: "'Playfair Display', serif",
              textShadow: "0 10px 30px rgba(236, 72, 153, 0.3)",
              textAlign: "center",
            }}
          >
            Syaftiani Dwi Astuti
          </motion.h1>

          {/* Container Teks (Diperlebar juga) */}
          <div
            style={{
              // UBAH DISINI: MaxWidth teks jadi 800px biar ngisi ruang samping
              maxWidth: "800px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <motion.p
              custom={2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontSize: "1.2rem", // Font agak dibesarin dikit
                lineHeight: "1.8",
                color: "#e2e8f0",
                marginBottom: "25px",
                fontStyle: "italic",
              }}
            >
              "Selamat bertambah usia, manusia favoritku."
            </motion.p>

            <motion.p
              custom={3}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.8",
                color: "#cbd5e1",
                marginBottom: "50px",
                fontWeight: "300",
              }}
            >
              Terima kasih sudah lahir ke dunia dan bertahan sejauh ini. Dunia
              mungkin berisik dan kadang melelahkan, tapi tolong ingat satu hal:
              <strong>
                {" "}
                Hadirmu selalu cukup dan selalu dirayakan di sini.
              </strong>
              <br />
              <br />
              Siap untuk melihat kejutan kecil yang aku buat?
            </motion.p>
          </div>

          {/* Tombol dengan Efek Glow */}
          <motion.div
            custom={4}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
            whileTap={{ scale: 0.95 }}
            style={{ position: "relative" }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "120%",
                height: "150%",
                background: "rgba(236, 72, 153, 0.4)",
                filter: "blur(20px)",
                borderRadius: "50%",
                zIndex: -1,
              }}
            ></div>

            <button onClick={handleNext} className="btn-glow">
              Mulai Perjalanan
            </button>
          </motion.div>
        </motion.div>

        {/* Footer Musik Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            position: "absolute",
            bottom: "20px",
            fontSize: "11px",
            color: "rgba(0,0,0,0.3)",
          }}
        >
          Made with ❤️ by Rehan
        </motion.p>
      </div>
    </PageTransition>
  );
};

export default Landing;
