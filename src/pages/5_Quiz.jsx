import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';
import PageTransition from '../layouts/PageTransition';
import confetti from 'canvas-confetti';

// --- DATA PERTANYAAN DENGAN REAKSI KHUSUS ---
const QUESTIONS = [
  {
    question: "Kita jadian di mana dan jam berapa tepatnya?",
    options: [
      "Di Nalar, pas live music jam 8 malam",
      "Di Nalar, pas Azan Magrib",
      "Di Nalar, abis ujan deres sore-sore",
      "Di Nalar, jam 9 malem pas udah sepi"
    ],
    correct: 1, 
    // Reaksi khusus soal no 1
    reactionTrue: "Pinter! Azan Magrib jadi saksi cinta kita 🕌❤️",
    reactionFalse: "Parah banget lupa... tidur di luar ya! 😤"
  },
  {
    question: "Kalau boleh ngayal dan ga mikirin uang, HP apa yang Rehan pengen banget?",
    options: [
      "Samsung Galaxy S24 Ultra",
      "Samsung Galaxy Z Fold 6",
      "Samsung Galaxy S25 Ultra",
      "iPhone 17 "
    ],
    correct: 3, 
    // Reaksi khusus soal no 2
    reactionTrue: "Tau banget selera mahalku wkwk 🍎✨",
    reactionFalse: "Salah! Aku gak mau Samsung wlee 😝"
  },
  {
    question: "Apa merek sepatu 'Red Flag' eh maksudnya sepatu impian aku?",
    options: [
      "Dr. Martens 1460",
      "Red Wing Iron Ranger",
      "Timberland Yellow Boot",
      "Clarks Wallabee"
    ],
    correct: 1, 
    // Reaksi khusus soal no 3
    reactionTrue: "Emang Red Wing paling gagah, kayak aku 😎",
    reactionFalse: "Bukan itu sayang... kurang merhatiin nih 🥺"
  },
  {
    question: "Apa makanan favorit kita berdua (comfort food)?",
    options: [
      "Ramen Kuah Kental",
      "Dimsum Mentai",
      "Sushi",
      "Steak Holycow"
    ],
    correct: 2, 
    // Reaksi khusus soal no 4
    reactionTrue: "Gas sushi date weekend ini? 🍣🤤",
    reactionFalse: "Enak sih, tapi bukan itu top 1 kita! ❌"
  },
  {
    question: "Apa lagu wedding impian yang Rehan pengen banget diputer nanti?",
    options: [
      "A Thousand Years - Christina Perri",
      "Sweet Disposition - The Temper Trap",
      "Until I Found You - Stephen Sanchez",
      "Yellow - Coldplay"
    ],
    correct: 1, 
    // Reaksi khusus soal no 5
    reactionTrue: "Fix ini lagu wajib pas resepsi nanti! 🎶💍",
    reactionFalse: "Jangan salah lagu dong, nanti tamu bingung! 🙈"
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const { nextStep } = useJourney();

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); 
  const [isAnswered, setIsAnswered] = useState(false); 
  const [feedbackText, setFeedbackText] = useState(""); 

  const progressPercentage = ((currentQ + 1) / QUESTIONS.length) * 100;

  const handleOptionClick = (index) => {
    if (isAnswered) return; 

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === QUESTIONS[currentQ].correct;
    
    // --- AMBIL KATA-KATA DARI DATA QUESTIONS ---
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedbackText(QUESTIONS[currentQ].reactionTrue); // Kata-kata Benar
      
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#4ade80', '#22c55e']
      });
    } else {
      setFeedbackText(QUESTIONS[currentQ].reactionFalse); // Kata-kata Salah
    }

    // Delay ke soal berikutnya
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setFeedbackText(""); 
      } else {
        setShowResult(true);
        if (score + (isCorrect ? 1 : 0) === QUESTIONS.length) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
      }
    }, 2500); // Delay 2.5 detik biar puas bacanya
  };

  const handleNextPage = () => {
    nextStep();
    navigate('/messages'); 
  };

  const getResultMessage = () => {
    if (score === QUESTIONS.length) return "Gila sih! Kamu hafal mati semuanya! Love you! ❤️🔥";
    if (score > QUESTIONS.length / 2) return "Not bad! Sebagian besar bener kok, makasih udah inget 😘";
    return "Waduh... Kode keras nih, harus lebih sering deep talk lagi! 😜";
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
        padding: '20px' 
      }}>

        <div style={{ position: 'fixed', top: '10%', left: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(50px)', zIndex: -1 }} />
        <div style={{ position: 'fixed', bottom: '10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(50px)', zIndex: -1 }} />

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="quiz-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-panel"
              style={{
                maxWidth: '500px',
                width: '100%',
                padding: '30px',
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '24px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                position: 'relative'
              }}
            >
              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>
                  <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
                  <span style={{ color: '#ec4899' }}>Score: {score}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    style={{ height: '100%', background: 'linear-gradient(to right, #ec4899, #8b5cf6)', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div style={{ minHeight: '80px', marginBottom: '20px' }}>
                <AnimatePresence mode="wait">
                    <motion.h2 
                        key={currentQ}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        style={{ 
                            fontSize: '1.2rem', 
                            color: '#1e293b',
                            lineHeight: '1.5',
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 'bold'
                        }}
                    >
                        {QUESTIONS[currentQ].question}
                    </motion.h2>
                </AnimatePresence>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {QUESTIONS[currentQ].options.map((opt, index) => {
                  let bgColor = 'rgba(255,255,255,0.7)';
                  let borderColor = 'transparent';
                  let textColor = '#334155';
                  let icon = null;

                  if (isAnswered) {
                    if (index === QUESTIONS[currentQ].correct) {
                      bgColor = '#dcfce7'; borderColor = '#22c55e'; textColor = '#15803d'; icon = '✅';
                    } else if (index === selectedOption) {
                      bgColor = '#fee2e2'; borderColor = '#ef4444'; textColor = '#b91c1c'; icon = '❌';
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      whileHover={!isAnswered ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.9)' } : {}}
                      whileTap={!isAnswered ? { scale: 0.98 } : {}}
                      onClick={() => handleOptionClick(index)}
                      disabled={isAnswered}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '16px',
                        border: `2px solid ${isAnswered ? borderColor : 'rgba(255,255,255,0.5)'}`,
                        background: bgColor,
                        color: textColor,
                        textAlign: 'left',
                        fontSize: '0.95rem',
                        cursor: isAnswered ? 'default' : 'pointer',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: '500',
                        transition: 'background 0.3s ease'
                      }}
                    >
                      {opt}
                      {icon && <span>{icon}</span>}
                    </motion.button>
                  );
                })}
              </div>

              {/* FEEDBACK TEXT KHUSUS PER SOAL */}
              <div style={{ height: '30px', textAlign: 'center' }}>
                <AnimatePresence>
                  {feedbackText && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ 
                        fontWeight: 'bold', 
                        color: feedbackText.includes('Salah') || feedbackText.includes('Bukan') || feedbackText.includes('Parah') || feedbackText.includes('Enak') || feedbackText.includes('Jangan') ? '#ef4444' : '#10b981',
                        fontSize: '1rem'
                      }}
                    >
                      {feedbackText}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>

          ) : (
            <motion.div
              key="result-panel"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel flex-center"
              style={{
                maxWidth: '450px',
                width: '100%',
                padding: '40px 30px',
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '30px',
                textAlign: 'center'
              }}
            >
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} 
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                style={{ fontSize: '5rem', marginBottom: '20px' }}
              >
                {score === QUESTIONS.length ? '👑' : score > QUESTIONS.length / 2 ? '🥰' : '🫣'}
              </motion.div>
              
              <h2 style={{ fontSize: '2.2rem', marginBottom: '10px', color: '#1e293b', fontFamily: "'Playfair Display', serif" }}>
                Score: {score}/{QUESTIONS.length}
              </h2>
              
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#64748b', 
                marginBottom: '40px', 
                lineHeight: '1.6'
              }}>
                {getResultMessage()}
              </p>

              <button onClick={handleNextPage} className="btn-glow" style={{ width: '100%' }}>
                💌 Pesan Cinta 
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Quiz;