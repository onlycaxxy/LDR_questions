import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig'; // Ensure this matches your file path
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { fetchQuestionsFromSheet } from '../services/sheetService';

// Define the clean "Hardwired" state shape
interface GameState {
  dice_roll: number;
  category: string;
  question_a: string; // The question text for Partner A
  question_b: string; // The question text for Partner B
  a_answer: string;
  b_answer: string;
  a_finished: boolean;
  b_finished: boolean;
}

const GameUI: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const activeRoomId = roomId || "room-1"; // Fallback to a default room
  
  const [role, setRole] = useState<"A" | "B" | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myInput, setMyInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. THE LISTENER: This hardwires your screen to the cloud.
  // When Firebase changes, this code runs instantly.
  useEffect(() => {
    const docRef = doc(db, "sessions", activeRoomId);
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setGameState(snapshot.data() as GameState);
      } else {
        // Create the room if it doesn't exist yet
        setDoc(docRef, {
            dice_roll: 0,
            category: "Waiting to roll...",
            question_a: "",
            question_b: "",
            a_answer: "",
            b_answer: "",
            a_finished: false,
            b_finished: false
        });
      }
    });
    
  
    return () => unsubscribe();
  }, [activeRoomId]);

  // 2. THE DICE ROLL: Generates number -> Fetches Sheet -> Updates Cloud
  const handleRoll = async () => {
    setLoading(true);
    const roll = Math.floor(Math.random() * 6) + 1;
    
    // Hardwire: Fetch from your Google Sheet
    const sheetData = await fetchQuestionsFromSheet(roll);
    
    if (sheetData) {
      // Update Firebase so BOTH phones see the new question
      const docRef = doc(db, "sessions", activeRoomId);
      await updateDoc(docRef, {
        dice_roll: roll,
        category: sheetData.category,
        question_a: sheetData.for_partner_a,
        question_b: sheetData.for_partner_b,
        // Reset the round
        a_finished: false,
        b_finished: false,
        a_answer: "",
        b_answer: ""
      });
    }
    setLoading(false);
  };

  // 3. THE SUBMIT: Locks in your answer
  const handleSubmit = async () => {
    if (!gameState || !role) return;
    
    // We use setDoc with { merge: true } to safely update just YOUR fields
    // without breaking the other person's data.
    const docRef = doc(db, "sessions", activeRoomId);
    
    const updateData = role === 'A' 
      ? { a_answer: myInput, a_finished: true }
      : { b_answer: myInput, b_finished: true };

    try {
      await setDoc(docRef, updateData, { merge: true });
    } catch (error) {
      console.error("Error saving answer:", error);
      alert("Failed to save! Check console for permission errors.");
    }
  };

  // 4. THE UI: Clean, "Vibe" based rendering
if (!role) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8 bg-yellow-50 text-blue-500">
      <h1 className="text-9xl font-bold">⊱ ✧Let's go｡𖦹°‧</h1>

      {/* --- PASTE THIS BLOCK HERE --- */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-slate-500 uppercase tracking-widest">Room Code: {activeRoomId}</span>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied! Send it to your partner.");
          }}
          className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:border-orange-500 px-4 py-2 rounded-full transition-all text-sm text-indigo-300"
        >
          <span>Copy Invite Link</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
      </div>
      {/* ----------------------------- */}

      <div className="flex gap-4">
        <button onClick={() => setRole("A")} className="px-8 py-4 bg-blue-800 text-white rounded-xl font-bold text-xl hover:scale-105 transition shadow-lg">Partner A</button>
        <button onClick={() => setRole("B")} className="px-8 py-4 bg-red-800 text-white rounded-xl font-bold text-xl hover:scale-105 transition shadow-lg">Partner B</button>
      </div>
    </div>
  );

  if (!gameState) return <div className="text-white text-center mt-20">Loading Game State...</div>;

  const myQuestion = role === 'A' ? gameState.question_a : gameState.question_b;
  const amIFinished = role === 'A' ? gameState.a_finished : gameState.b_finished;
  const isPartnerFinished = role === 'A' ? gameState.b_finished : gameState.a_finished;
  const bothFinished = gameState.a_finished && gameState.b_finished;
  const debugView = (
    <div className="fixed top-0 left-0 bg-black/80" text-green-400 p-2 text-xs font-mono z-50 w-full>
      DEBUG: 
      A_Fin: {gameState?.a_finished ? "TRUE" : "FALSE"} | 
      B_Fin: {gameState?.b_finished ? "TRUE" : "FALSE"} | 
      My Role: {role}
    </div>
  );
  return (
    <div className="min-h-screen bg-yellow-50 text-blue-500 p-6 flex flex-col items-center max-w-md mx-auto">
      {debugView} 
      {/* HEADER: Dice & Category */}
      <div className="w-full bg-sky-200 p-6 rounded-3xl mb-6 text-center border border-sky-500">
        <div className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">
          {gameState.category || "Ready to Start"}
        </div>
        <div className="text-5xl font-black text-white mb-4">
          {gameState.dice_roll > 0 ? `🎲 ${gameState.dice_roll}` : "🎲"}
        </div>
        <button 
          onClick={handleRoll} 
          disabled={loading}
          className="bg-cyan-700 hover:bg-cyan-600 px-4 py-2 rounded-full text-white text-sm font-bold transition"
        >
          {loading ? "Fetching..." : "Roll Dice"}
        </button>
      </div>

      {/* GAME AREA */}
      {gameState.dice_roll > 0 && (
        <div className="w-full space-y-6 animate-in fade-in duration-500">
          
          {/* Question Card */}
          <div className="text-xl md:text-2xl font-bold text-center leading-relaxed">
             {myQuestion}
          </div>

          {/* INPUT PHASE: Show if I haven't finished */}
          {!amIFinished && !bothFinished && (
            <div className="space-y-4">
              <textarea 
                className="w-full bg-amber-200 border border-yellow-300 rounded-2xl p-4 text-lg focus:outline-none focus:border-indigo-500 h-32"
                placeholder="Type your answer..."
                value={myInput}
                onChange={(e) => setMyInput(e.target.value)}
              />
              <button 
                onClick={handleSubmit}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition ${
                  role === 'A' ? 'bg-blue-500 hover:bg-blue-400' : 'bg-red-400 hover:bg-red-300'
                }`}
              >
                Lock Answer 
              </button>
            </div>
          )}

          {/* WAITING PHASE: I am done, waiting for partner */}
          {amIFinished && !bothFinished && (
            <div className="p-8 bg-amber-200/50 rounded-3xl text-center border border-dashed border-yellow-300 animate-pulse">
              <h3 className="text-white-xl font-bold mb-2">Waiting for Partner...</h3>
              <p className="text-slate-600 text-sm">You are locked in. The reveal happens when they finish.</p>
            </div>
          )}

          {/* REVEAL PHASE: Both are done */}
          {bothFinished && (
            <div className="space-y-4 animate-in zoom-in-95 duration-500">
              <div className="bg-blue-900/30 border border-blue-500/30 p-6 rounded-2xl">
                <div className="text-xs font-bold uppercase text-blue-400 mb-2">Partner A said:</div>
                <div className="text-lg italic">"{gameState.a_answer}"</div>
              </div>

              <div className="bg-red-900/30 border border-red-500/30 p-6 rounded-2xl">
                <div className="text-xs font-bold uppercase text-red-400 mb-2">Partner B said:</div>
                <div className="text-lg italic">"{gameState.b_answer}"</div>
              </div>
              
            
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameUI;