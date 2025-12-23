import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import PageTransition from "../layouts/PageTransition";

const Upload = () => {
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    message: "",
  });

  // --- KONFIGURASI BATASAN ---
  const MAX_DURATION = 45; // Maksimal 45 Detik
  const MAX_SIZE_MB = 25; // Batas aman size file

  // State Perekaman
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [stream, setStream] = useState(null);
  const [timeLeft, setTimeLeft] = useState(MAX_DURATION);

  // State UI
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("idle");

  // State Galeri Video
  const [otherVideos, setOtherVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (status === "success" || status === "gallery") {
      fetchOtherVideos();
    }
  }, [status]);

  const fetchOtherVideos = async () => {
    setLoadingVideos(true);
    try {
      const { data, error } = await supabase
        .from("video_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOtherVideos(data || []);
    } catch (err) {
      console.error("Gagal ambil video:", err);
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    if (status === "recording" && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [status, stream]);

  // --- LOGIKA TIMER MUNDUR & AUTO CUT ---
  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRecording && timeLeft === 0) {
      stopRecording();
      setShowTimeUpModal(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [isRecording, timeLeft]);

  // --- FUNGSI PEREKAMAN ---
  const startRecording = async () => {
    try {
      // Constraints
      const constraints = {
        audio: true,
        video: {
          width: { ideal: 720 },
          height: { ideal: 1280 },
          facingMode: "user",
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);
      setStatus("recording");
      setTimeLeft(MAX_DURATION);
      setShowTimeUpModal(false);

      const options = {
        videoBitsPerSecond: 2500000,
        mimeType: "video/webm;codecs=vp8",
      };

      let mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(mediaStream, options);
      } catch (e) {
        mediaRecorder = new MediaRecorder(mediaStream);
      }

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });

        const sizeInMB = blob.size / (1024 * 1024);

        if (sizeInMB > MAX_SIZE_MB) {
          alert(
            `Video kegedean (${sizeInMB.toFixed(1)}MB). Coba rekam ulang ya.`
          );
          setStatus("idle");
          setRecordedBlob(null);
          return;
        }

        setRecordedBlob(blob);
        setVideoPreview(URL.createObjectURL(blob));
        mediaStream.getTracks().forEach((track) => track.stop());
        setStream(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Gagal akses kamera:", err);
      alert("Gagal akses kamera. Pastikan izin browser diberikan.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus("review");
      clearTimeout(timerRef.current);
    }
  };

  const retakeVideo = () => {
    setRecordedBlob(null);
    setVideoPreview(null);
    setStatus("idle");
    setTimeLeft(MAX_DURATION);
    setShowTimeUpModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recordedBlob || !formData.name) return;

    setUploading(true);

    try {
      const fileExt = "webm";
      const fileName = `${Date.now()}_${formData.name.replace(
        /\s/g,
        "_"
      )}.${fileExt}`;
      const fileToUpload = new File([recordedBlob], fileName, {
        type: "video/webm",
      });

      const { error: uploadError } = await supabase.storage
        .from("birthday-videos")
        .upload(fileName, fileToUpload);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("birthday-videos").getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("video_messages").insert([
        {
          name: formData.name,
          relation: formData.relation,
          message: formData.message,
          video_url: publicUrl,
        },
      ]);
      if (dbError) throw dbError;

      setStatus("success");
      setFormData({ name: "", relation: "", message: "" });
      setRecordedBlob(null);
      setVideoPreview(null);
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageTransition>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fdfbf7 0%, #e2e8f0 100%)",
          padding: "15px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            fontSize: "4rem",
            opacity: 0.1,
          }}
        >
          🎈
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: "15%",
            right: "5%",
            fontSize: "5rem",
            opacity: 0.1,
          }}
        >
          🎁
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel hide-scrollbar"
          style={{
            maxWidth: "550px",
            width: "100%",
            maxHeight: "92vh",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "25px",
            padding: "25px 20px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 10,
            border: "1px solid rgba(255,255,255,0.8)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            {status === "gallery" && (
              <button
                onClick={() => setStatus("idle")}
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#f1f5f9",
                  border: "none",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  color: "#64748b",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ←
              </button>
            )}

            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1e293b",
                fontWeight: "800",
                margin: "0 0 5px 0",
                background: "linear-gradient(to right, #ec4899, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {status === "success"
                ? "Terkirim! 🎉"
                : status === "gallery"
                ? "Kenangan 📸"
                : "Kirim Video 🎥"}
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.85rem",
                margin: 0,
                fontWeight: "500",
              }}
            >
              {status === "success"
                ? "Makasih udah ngeramein!"
                : status === "gallery"
                ? "Doa terbaik buat Thia."
                : "Durasi maks 45 detik ya!"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === "success" || status === "gallery" ? (
              <motion.div
                key="gallery-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: "100%" }}
              >
                {status === "success" && (
                  <div style={{ textAlign: "center", marginBottom: "25px" }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStatus("idle")}
                      style={{
                        background: "linear-gradient(45deg, #ec4899, #8b5cf6)",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "50px",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 10px 20px rgba(236, 72, 153, 0.3)",
                      }}
                    >
                      + Kirim Lagi
                    </motion.button>
                  </div>
                )}

                <div
                  style={{
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "4px",
                      height: "18px",
                      background: "#ec4899",
                      borderRadius: "2px",
                    }}
                  ></div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: "#334155",
                      margin: 0,
                    }}
                  >
                    {status === "success" ? "Video Lainnya:" : "Video Masuk:"}
                  </h3>
                </div>

                {loadingVideos ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#94a3b8",
                    }}
                  >
                    <div
                      className="animate-spin"
                      style={{
                        display: "inline-block",
                        width: "20px",
                        height: "20px",
                        border: "3px solid #cbd5e1",
                        borderTopColor: "#ec4899",
                        borderRadius: "50%",
                        marginBottom: "10px",
                      }}
                    ></div>
                    <p style={{ fontSize: "0.8rem" }}>Memuat...</p>
                  </div>
                ) : otherVideos.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      background: "#f8fafc",
                      borderRadius: "15px",
                    }}
                  >
                    <p style={{ fontSize: "2rem", margin: 0 }}>📭</p>
                    <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                      Belum ada video nih.
                    </p>
                  </div>
                ) : (
                  <div
                    className="hide-scrollbar"
                    style={{
                      width: "100%",
                      overflowX: "auto",
                      display: "flex",
                      gap: "12px",
                      padding: "5px 5px 20px 5px",
                      scrollBehavior: "smooth",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
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
                          position: "relative",
                          width: "160px",
                          height: "260px",
                          flexShrink: 0,
                          borderRadius: "16px",
                          overflow: "hidden",
                          cursor: "pointer",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                          background: "#000",
                          border: "2px solid white",
                        }}
                      >
                        <video
                          src={vid.video_url}
                          muted
                          loop
                          playsInline
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.9,
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            padding: "12px 10px",
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                            color: "white",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: "bold",
                              margin: 0,
                              lineHeight: 1.2,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {vid.name}
                          </h3>
                          <span style={{ fontSize: "0.65rem", opacity: 0.8 }}>
                            {vid.relation}
                          </span>
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: "1.5rem",
                            color: "rgba(255,255,255,0.8)",
                          }}
                        >
                          ▶
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <div style={{ textAlign: "right", marginTop: "-10px" }}>
                  <button
                    type="button"
                    onClick={() => setStatus("gallery")}
                    style={{
                      background: "rgba(236, 72, 153, 0.1)",
                      border: "none",
                      color: "#db2777",
                      fontSize: "0.8rem",
                      padding: "6px 12px",
                      borderRadius: "15px",
                      cursor: "pointer",
                      fontWeight: "600",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    📸 Lihat Galeri
                  </button>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 140px" }}>
                    <label
                      style={{
                        fontSize: "0.8rem",
                        color: "#64748b",
                        fontWeight: "bold",
                        marginLeft: "5px",
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      Nama Kamu
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.9rem",
                        outline: "none",
                        background: "#f8fafc",
                      }}
                      placeholder="Masukkan namamu"
                    />
                  </div>
                  <div style={{ flex: "1 1 140px" }}>
                    <label
                      style={{
                        fontSize: "0.8rem",
                        color: "#64748b",
                        fontWeight: "bold",
                        marginLeft: "5px",
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      Hubungan
                    </label>
                    <select
                      required
                      value={formData.relation}
                      onChange={(e) =>
                        setFormData({ ...formData, relation: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.9rem",
                        outline: "none",
                        background: "#f8fafc",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Pilih...</option>
                      <option value="Keluarga">Keluarga 🏠</option>
                      <option value="Sahabat">Sahabat 🤝</option>
                      <option value="Teman">Teman ✌️</option>
                      <option value="Bos Besar">Bos Besar 👑</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "min(350px, 50vh)",
                    background: "#000",
                    borderRadius: "20px",
                    overflow: "hidden",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    border: "3px solid #1e293b",
                  }}
                >
                  {status === "idle" && (
                    <div style={{ textAlign: "center", color: "white" }}>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ fontSize: "2.5rem", marginBottom: "8px" }}
                      >
                        📷
                      </motion.div>
                      <p style={{ opacity: 0.8, fontSize: "0.85rem" }}>
                        Siap merekam?
                      </p>
                    </div>
                  )}

                  {/* FIX: Full Frame Video (Contain) */}
                  {status === "recording" && (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // BIAR TIDAK TERPOTONG
                        transform: "scaleX(-1)",
                      }}
                    />
                  )}

                  {status === "review" && videoPreview && (
                    <video
                      src={videoPreview}
                      controls
                      playsInline
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div
                    style={{
                      position: "absolute",
                      bottom: "15px",
                      left: 0,
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "20px",
                      zIndex: 10,
                    }}
                  >
                    {status === "idle" && (
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={startRecording}
                        style={{
                          width: "55px",
                          height: "55px",
                          borderRadius: "50%",
                          background: "#ef4444",
                          border: "4px solid rgba(255,255,255,0.5)",
                          cursor: "pointer",
                          boxShadow: "0 0 15px rgba(239, 68, 68, 0.6)",
                        }}
                      />
                    )}
                    {status === "recording" && (
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={stopRecording}
                        style={{
                          width: "55px",
                          height: "55px",
                          borderRadius: "50%",
                          background: "white",
                          border: "4px solid rgba(255,0,0,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            background: "#ef4444",
                            borderRadius: "4px",
                          }}
                        ></div>
                      </motion.button>
                    )}
                    {status === "review" && (
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={retakeVideo}
                        style={{
                          padding: "8px 18px",
                          background: "rgba(255,255,255,0.2)",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.4)",
                          borderRadius: "30px",
                          cursor: "pointer",
                          backdropFilter: "blur(5px)",
                          fontSize: "0.85rem",
                        }}
                      >
                        ↺ Ulangi
                      </motion.button>
                    )}
                  </div>

                  {status === "recording" && (
                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(0,0,0,0.5)",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "15px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <div
                        className="animate-pulse"
                        style={{
                          width: "6px",
                          height: "6px",
                          background: "#ef4444",
                          borderRadius: "50%",
                        }}
                      ></div>
                      {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toString().padStart(2, "0")}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "0.8rem",
                      color: "#64748b",
                      fontWeight: "bold",
                      marginLeft: "5px",
                      marginBottom: "4px",
                      display: "block",
                    }}
                  >
                    Pesan Singkat
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "15px",
                      border: "1px solid #e2e8f0",
                      minHeight: "70px",
                      fontSize: "0.9rem",
                      fontFamily: "inherit",
                      background: "#f8fafc",
                      outline: "none",
                      resize: "none",
                    }}
                    placeholder="Tulis harapan kamu..."
                  />
                </div>

                {status === "review" && (
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={uploading}
                    className="btn-glow"
                    style={{
                      width: "100%",
                      padding: "14px",
                      fontSize: "1rem",
                      opacity: uploading ? 0.7 : 1,
                      cursor: uploading ? "not-allowed" : "pointer",
                      borderRadius: "15px",
                      marginTop: "5px",
                    }}
                  >
                    {uploading ? "Mengirim..." : "Kirim Video 🚀"}
                  </motion.button>
                )}

                {status === "error" && (
                  <div
                    style={{
                      background: "#fee2e2",
                      color: "#b91c1c",
                      padding: "10px",
                      borderRadius: "10px",
                      textAlign: "center",
                      fontSize: "0.8rem",
                    }}
                  >
                    ❌ Gagal upload. Coba lagi.
                  </div>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* === MODAL VIDEO PLAYER === */}
        {/* === MODAL VIDEO PLAYER === */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.9)",
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                backdropFilter: "blur(5px)",
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  width: "100%",
                  maxWidth: "500px",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: "85vh",
                }}
              >
                {/* --- HEADER MODAL --- */}
                <div
                  style={{
                    padding: "15px 20px",
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    justifyContent: "space-between",
                    // Menggunakan flex-start agar jika teks panjang (multiline), tombol tetap di atas (tidak ikut ke tengah)
                    alignItems: "flex-start",
                    background: "white",
                    gap: "15px", // Memberi jarak aman antara teks dan tombol
                  }}
                >
                  {/* Container Teks */}
                  <div
                    style={{
                      flex: 1, // Agar teks mengambil sisa ruang yang ada
                      minWidth: 0, // Mencegah teks memaksa container melebar keluar layar hp
                      paddingTop: "4px", // Sedikit penyesuaian agar sejajar vertikal dengan icon X
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        color: "#1e293b",
                        fontWeight: "bold",
                        fontFamily: "'Playfair Display', serif",
                        margin: 0, // Reset margin
                        lineHeight: 1.3,
                        wordBreak: "break-word", // Agar kata panjang turun ke bawah
                      }}
                    >
                      {selectedVideo.name}
                    </h3>
                    {selectedVideo.message && (
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#64748b",
                          marginTop: "4px",
                          fontStyle: "italic",
                          lineHeight: 1.4,
                          wordBreak: "break-word",
                        }}
                      >
                        "{selectedVideo.message}"
                      </p>
                    )}
                  </div>

                  {/* Tombol Close (X) */}
                  <button
                    onClick={() => setSelectedVideo(null)}
                    style={{
                      background: "#fee2e2",
                      border: "none",
                      color: "#ef4444",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // --- KUNCI ANTI GEPENG ---
                      flexShrink: 0, // Tombol dilarang mengecil walau ruang sempit
                      marginLeft: "auto", // Memastikan tombol selalu mojok kanan
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* --- CONTENT VIDEO --- */}
                <div
                  style={{
                    background: "black",
                    flexGrow: 1,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <video
                    controls
                    autoPlay
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: "70vh",
                      objectFit: "contain",
                    }}
                  >
                    <source src={selectedVideo.video_url} type="video/mp4" />
                  </video>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === MODAL WAKTU HABIS === */}
        <AnimatePresence>
          {showTimeUpModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.6)",
                zIndex: 110,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                backdropFilter: "blur(3px)",
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "20px",
                  maxWidth: "320px",
                  textAlign: "center",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "10px" }}>⏱️</div>
                <h3
                  style={{
                    margin: "0 0 10px 0",
                    color: "#1e293b",
                    fontWeight: "bold",
                  }}
                >
                  Waktu Habis!
                </h3>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    marginBottom: "20px",
                  }}
                >
                  Maksimal 45 detik ya, biar videonya gak keberatan saat
                  diupload. Video kamu sudah otomatis dipotong.
                </p>
                <button
                  onClick={() => setShowTimeUpModal(false)}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    padding: "10px 25px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Oke, Siap!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Upload;
