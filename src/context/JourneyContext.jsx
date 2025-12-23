import React, { createContext, useContext, useState } from 'react';

const JourneyContext = createContext();

export const JourneyProvider = ({ children }) => {
  // Simpan step di localStorage agar kalau di-refresh tidak ulang dari 0
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('birthday_step');
    return saved ? parseInt(saved) : 0;
  });

  // Fungsi Lanjut ke Step Berikutnya
  const nextStep = () => {
    setCurrentStep((prev) => {
      const newStep = prev + 1;
      localStorage.setItem('birthday_step', newStep);
      return newStep;
    });
  };

  // Fungsi Reset (Buat main ulang dari awal)
  const resetJourney = () => {
    setCurrentStep(0);
    localStorage.setItem('birthday_step', 0);
  };

  // Fungsi Lompat ke Step Tertentu (Opsional, buat debugging enak)
  const setStep = (step) => {
    setCurrentStep(step);
    localStorage.setItem('birthday_step', step);
  };

  return (
    <JourneyContext.Provider value={{ currentStep, nextStep, resetJourney, setStep }}>
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => useContext(JourneyContext);