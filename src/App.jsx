import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { JourneyProvider } from "./context/JourneyContext";

// Import Komponen Pengaman (Agar pacar gabisa lompat halaman)
import ProtectedRoute from "./components/ProtectedRoute"; 

// Import Halaman
import PreLanding from "./pages/0_PreLanding";
import Landing from "./pages/1_Landing";
import About from "./pages/2_About";
import Moments from "./pages/3_Moments";
import MemoryGame from "./pages/4_MemoryGame";
import Quiz from "./pages/5_Quiz";
import LoveMessages from "./pages/6_LoveMessages";
import Pause from "./pages/7_Pause";
import Letter from "./pages/8_Letter";
import VideoMessages from "./pages/9_VideoMessages";
import Candle from "./pages/10_Candle";
import Final from "./pages/11_Final";
import Upload from './pages/12_Upload';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* =========================================
            JALUR 1: PUBLIC / UMUM
            (Bisa diakses siapa saja tanpa syarat)
           ========================================= */}
        
        {/* Halaman Upload untuk Teman/Keluarga */}
        <Route path="/upload-ucapan" element={<Upload />} />

        {/* Halaman Awal (Pintu Masuk) */}
        <Route path="/" element={<PreLanding />} />


        {/* =========================================
            JALUR 2: BIRTHDAY JOURNEY (KHUSUS PACAR)
            (Diproteksi: Harus urut, gabisa lompat)
           ========================================= */}

        <Route 
          path="/landing" 
          element={
            <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/about" 
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/moments" 
          element={
            <ProtectedRoute>
              <Moments />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/memory-game" 
          element={
            <ProtectedRoute>
              <MemoryGame />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/quiz" 
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <LoveMessages />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/pause" 
          element={
            <ProtectedRoute>
              <Pause />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/letter" 
          element={
            <ProtectedRoute>
              <Letter />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/video" 
          element={
            <ProtectedRoute>
              <VideoMessages />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/star" 
          element={
            <ProtectedRoute>
              <Candle />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/final" 
          element={
            <ProtectedRoute>
              <Final />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <JourneyProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </JourneyProvider>
  );
}

export default App;