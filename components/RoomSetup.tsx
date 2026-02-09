
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomSetup: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${newId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/room/${roomId.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-12 text-center">
      <div className="space-y-4 max-w-lg">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          Reveal <span className="text-orange-400">Deeply</span>.
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="p-8 rounded-3xl bg-amber-500/40 border border-blue-700/50 hover:border-indigo-500/50 transition-colors group">
          <h2 className="text-xl font-bold mb-4">Start Fresh</h2>
          <p className="text-slate-600 mb-6 text-sm">Create a new private session and invite your partner.</p>
          <button 
            onClick={handleCreateRoom}
            className="w-full py-3 px-6 bg-blue-700 hover:bg-blue-500 rounded-xl font-semibold transition-all transform active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            Create New Room
          </button>
        </div>

        <div className="p-8 rounded-3xl bg-amber-500/40 border border-blue-700/50 hover:border-indigo-500/50 transition-colors">
          <h2 className="text-xl font-bold mb-4">Join Session</h2>
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <input 
              type="text" 
              placeholder="Enter Room ID" 
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-orange-600 border border-orange-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all uppercase tracking-widest text-center font-mono"
            />
            <button 
              type="submit"
              className="w-full py-3 px-6 bg-blue-700 hover:bg-blue-500 rounded-xl font-semibold transition-all transform active:scale-95"
            >
              Join Existing Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomSetup;
