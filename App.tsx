
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import GameUI from './components/GameUI';
import RoomSetup from './components/RoomSetup';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-indigo-500/30">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Routes>
            <Route path="/" element={<RoomSetup />} />
            <Route path="/room/:roomId" element={<GameUI />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
