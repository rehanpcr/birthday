import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';

const ProtectedRoute = ({ children }) => {
  const { currentStep } = useJourney();
  const location = useLocation();

  // Peta Alur: Halaman ini butuh Step nomor berapa?
  const stepPaths = {
    '/landing': 1,
    '/about': 2,
    '/moments': 3,
    '/memory-game': 4,
    '/quiz': 5,
    '/messages': 6,
    '/pause': 7,
    '/letter': 8,
    '/video': 9,
    '/candle': 10,
    '/final': 11
  };

  // 1. Cek step berapa yang dibutuhkan halaman ini
  const requiredStep = stepPaths[location.pathname];

  // 2. Jika halaman ini tidak ada di daftar (misal halaman 404), loloskan saja
  if (!requiredStep) {
    return children;
  }

  // 3. LOGIKA PROTEKSI UTAMA:
  // Jika step user saat ini (currentStep) LEBIH KECIL dari step halaman ini,
  // Berarti dia mencoba lompat/skip. KITA TENDANG BALIK!
  if (currentStep < requiredStep) {
    
    // Cari halaman yang seharusnya dia buka sekarang
    const validPath = Object.keys(stepPaths).find(path => stepPaths[path] === currentStep) || '/';
    
    // Redirect paksa ke halaman yang benar
    return <Navigate to={validPath} replace />;
  }

  // 4. Jika lolos pengecekan, tampilkan halamannya
  return children;
};

export default ProtectedRoute;