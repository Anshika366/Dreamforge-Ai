"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Key, 
  HelpCircle, 
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Music,
  Volume2,
  VolumeX
} from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAudio } from "@/lib/audio";

export default function EscapeRoomPage() {
  const { id } = useParams<{ id: string }>();
  const { 
    currentWorld, 
    loading, 
    fetchWorldDetails,
    isMuted,
    volume,
    ambientPlaying,
    toggleMute,
    setVolume,
    startAmbient,
    stopAmbient
  } = useWorldStore();

  const [puzzleAnswers, setPuzzleAnswers] = useState<{ [puzzleId: string]: string }>({});
  const [unlockedPuzzles, setUnlockedPuzzles] = useState<{ [puzzleId: string]: boolean }>({});
  const [revealedHints, setRevealedHints] = useState<{ [puzzleId: string]: boolean }>({});
  const [puzzleErrors, setPuzzleErrors] = useState<{ [puzzleId: string]: string }>({});
  const [puzzleSuccess, setPuzzleSuccess] = useState<{ [puzzleId: string]: boolean }>({});

  // Final Boss Lock State
  const [bossAnswer, setBossAnswer] = useState("");
  const [bossUnlocked, setBossUnlocked] = useState(false);
  const [bossError, setBossError] = useState("");
  const [bossSuccess, setBossSuccess] = useState(false);
  const [bossHintRevealed, setBossHintRevealed] = useState(false);

  useEffect(() => {
    if (id) {
      fetchWorldDetails(id);
    }
  }, [id, fetchWorldDetails]);

  // Start ambient on mount
  useEffect(() => {
    startAmbient();
  }, [startAmbient]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Calibrating Runic Security Locks...</p>
      </div>
    );
  }

  if (!currentWorld) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-center px-4">
        <Lock className="h-16 w-16 text-slate-600 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">Escape Room Lost</h2>
        <p className="text-slate-400 max-w-sm mt-2">
          This world details could not be found. Let&apos;s return to the dashboard.
        </p>
        <Link href="/dashboard" className="pt-4">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Get puzzles
  const puzzlesPayload = (currentWorld as any).puzzles || {};
  const puzzles = puzzlesPayload.puzzles || [];
  const finalBoss = puzzlesPayload.finalBossPuzzle;

  const handleCheckAnswer = (puzzleId: string, correctAnswer: string) => {
    const userAnswer = puzzleAnswers[puzzleId]?.trim() || "";
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setUnlockedPuzzles(prev => ({ ...prev, [puzzleId]: true }));
      setPuzzleSuccess(prev => ({ ...prev, [puzzleId]: true }));
      setPuzzleErrors(prev => ({ ...prev, [puzzleId]: "" }));
      
      // Play unlocked sound effect
      const audio = getAudio();
      audio.playDoorUnlocked();
    } else {
      setPuzzleErrors(prev => ({ ...prev, [puzzleId]: "Incorrect passcode combination. Inspect logs and clues." }));
      setPuzzleSuccess(prev => ({ ...prev, [puzzleId]: false }));
      
      // Play low error note
      const audio = getAudio();
      if (audio.playTone) {
        audio.playTone([120], 'sawtooth', 0.2, 0.4);
      }
    }
  };

  const handleCheckBossAnswer = () => {
    if (!finalBoss) return;
    const userAnswer = bossAnswer.trim();
    if (userAnswer.toLowerCase() === finalBoss.answer.toLowerCase()) {
      setBossUnlocked(true);
      setBossSuccess(true);
      setBossError("");
      
      // Play major victory sound effect
      const audio = getAudio();
      audio.playQuestCompleted();
    } else {
      setBossError("Mainframe rejected decrypt token. System override failed.");
      setBossSuccess(false);
      
      // Play heavy low rumble
      const audio = getAudio();
      audio.playBossEncounter();
    }
  };

  // Check if all normal locks are resolved
  const allNormalUnlocked = puzzles.length > 0 && puzzles.every((p: any) => unlockedPuzzles[p.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Top Banner / Audio Controls */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center space-x-4">
            <Link href={`/world/${id}`} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-cyan-400" />
              <span className="font-display font-black tracking-tight text-lg uppercase">Security Escape Room</span>
            </div>
          </div>

          {/* Interactive Audio Widget */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-3 py-1.5">
            <button
              onClick={() => {
                if (ambientPlaying) {
                  stopAmbient();
                } else {
                  startAmbient();
                }
              }}
              className={`p-1 rounded-full hover:bg-white/10 transition-colors ${ambientPlaying ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`}
              title={ambientPlaying ? "Pause Ambient" : "Play Ambient"}
            >
              <Music className="h-4 w-4" />
            </button>
            
            <button
              onClick={toggleMute}
              className="text-slate-400 hover:text-white transition-colors p-1"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/10 px-3 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5" />
            Decrypt Business Cryptograms
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-none">
            Escape the <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">{currentWorld.title}</span> Mainframe
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            The security grid has sealed this sector using encryptions forged from the uploaded files. Solve all auxiliary locks to lift the firewall blocking the Final Boss Mainframe decryption terminal!
          </p>
        </div>

        {/* Puzzle Grids */}
        {puzzles.length === 0 ? (
          <Card className="border-dashed border-white/10 bg-slate-900/20 py-16 text-center space-y-4">
            <HelpCircle className="h-12 w-12 text-slate-500 mx-auto" />
            <h3 className="font-display font-semibold text-white text-lg">No Lock Codes Found</h3>
            <p className="text-slate-400 max-w-sm mx-auto text-xs">
              No escape puzzles exist in this world database structure. Try re-forging reality to compile the cryptograms!
            </p>
          </Card>
        ) : (
          <div className="space-y-8">
            
            {/* Auxiliary Locks Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Key className="h-4.5 w-4.5 text-cyan-400" />
                Auxiliary Logic Locks ({puzzles.filter((p: any) => unlockedPuzzles[p.id]).length} / {puzzles.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {puzzles.map((p: any) => {
                  const isUnlocked = unlockedPuzzles[p.id];
                  const hasError = puzzleErrors[p.id];
                  const isHintRevealed = revealedHints[p.id];

                  return (
                    <Card key={p.id} className={`border-white/5 overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                      isUnlocked 
                        ? "bg-emerald-950/20 border-emerald-500/30 shadow-lg shadow-emerald-950/10" 
                        : "bg-slate-950/40 border-white/5 hover:border-cyan-500/30"
                    }`}>
                      <CardHeader className="pb-3 border-b border-white/5 bg-slate-950/50">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                            LOCK: {p.id.toUpperCase()}
                          </span>
                          {isUnlocked ? (
                            <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                              <Unlock className="h-3.5 w-3.5" />
                              UNLOCKED
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 font-mono font-bold flex items-center gap-1">
                              <Lock className="h-3.5 w-3.5" />
                              LOCKED
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-base font-bold font-display text-white mt-2">
                          {p.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {p.description}
                        </p>
                        
                        <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 text-xs font-mono leading-relaxed text-cyan-300 relative">
                          <span className="absolute top-2 right-3 text-[8px] text-slate-500 uppercase tracking-widest font-bold font-sans">Challenge</span>
                          <p className="pr-12">{p.challenge}</p>
                        </div>

                        {/* Interactive Unlock Input */}
                        {!isUnlocked ? (
                          <div className="space-y-3 pt-2">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Enter unlock code..."
                                value={puzzleAnswers[p.id] || ""}
                                onChange={(e: any) => setPuzzleAnswers(prev => ({ ...prev, [p.id]: e.target.value }))}
                                className="bg-slate-900 border-white/15 text-xs text-white"
                                onKeyDown={(e: any) => {
                                  if (e.key === 'Enter') handleCheckAnswer(p.id, p.answer);
                                }}
                              />
                              <Button
                                onClick={() => handleCheckAnswer(p.id, p.answer)}
                                className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-4 text-xs uppercase"
                              >
                                Decrypt
                              </Button>
                            </div>

                            {/* Error Alert */}
                            {hasError && (
                              <div className="text-[10px] text-rose-400 flex items-center gap-1.5 bg-rose-500/5 p-2.5 rounded-lg border border-rose-500/10">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span>{hasError}</span>
                              </div>
                            )}

                            {/* Hint Panel */}
                            <div className="pt-1">
                              <button
                                onClick={() => setRevealedHints(prev => ({ ...prev, [p.id]: !isHintRevealed }))}
                                className="text-[10px] text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1 underline font-mono"
                              >
                                {isHintRevealed ? "Hide Encryption Tip" : "Request Decryption Tip"}
                              </button>
                              <AnimatePresence>
                                {isHintRevealed && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden mt-2"
                                  >
                                    <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-3 text-[11px] text-cyan-300 leading-relaxed italic">
                                      <HelpCircle className="h-3.5 w-3.5 inline mr-1 text-cyan-400" />
                                      {p.hint}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                          </div>
                        ) : (
                          <div className="text-xs text-emerald-400 flex items-center gap-2 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 justify-center">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="font-bold tracking-tight">Decrypted Code successfully synced! Lock cleared.</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Final Boss Terminals (Locked until all normal puzzles solved) */}
            <div className="pt-6 border-t border-white/5">
              {finalBoss && (
                <Card className={`border overflow-hidden transition-all duration-500 ${
                  bossUnlocked
                    ? "bg-emerald-950/20 border-emerald-500/40 shadow-2xl shadow-emerald-500/5"
                    : allNormalUnlocked
                      ? "bg-slate-900/30 border-cyan-500/40 shadow-lg shadow-cyan-500/5 animate-pulse"
                      : "bg-slate-950/80 border-white/5 opacity-60 pointer-events-none select-none"
                }`}>
                  <CardHeader className="p-6 border-b border-white/5 bg-slate-950/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <span className="text-[9px] bg-cyan-950/80 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-mono uppercase font-bold tracking-widest">
                        🛡️ MAINFRAME BACKBONE TERMINAL
                      </span>
                      <CardTitle className="text-xl font-black font-display text-white mt-3 flex items-center gap-2">
                        {bossUnlocked ? <Unlock className="h-5 w-5 text-emerald-400" /> : <Lock className="h-5 w-5 text-cyan-400" />}
                        {finalBoss.title}
                      </CardTitle>
                    </div>
                    
                    {!allNormalUnlocked && (
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider font-mono flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <Lock className="h-3.5 w-3.5" />
                        Resolve Auxiliary Locks First
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {finalBoss.description}
                    </p>
                    
                    <div className="bg-slate-950 border border-white/10 rounded-2xl p-6 text-sm font-mono text-cyan-300 relative">
                      <span className="absolute top-3 right-4 text-[9px] text-slate-500 uppercase tracking-widest font-bold font-sans">Final Override Decryption Vector</span>
                      <p className="leading-relaxed leading-7 pr-12">{finalBoss.challenge}</p>
                    </div>

                    {!bossUnlocked ? (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Input
                            placeholder="Enter final override code..."
                            value={bossAnswer}
                            onChange={(e: any) => setBossAnswer(e.target.value)}
                            className="bg-slate-950 border-white/15 h-12 text-sm text-white"
                            onKeyDown={(e: any) => {
                              if (e.key === 'Enter') handleCheckBossAnswer();
                            }}
                          />
                          <Button
                            onClick={handleCheckBossAnswer}
                            className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white font-extrabold px-8 h-12 text-sm uppercase tracking-wider shadow-md shadow-cyan-500/10"
                          >
                            Decipher Matrix
                          </Button>
                        </div>

                        {bossError && (
                          <div className="text-xs text-rose-400 flex items-center gap-1.5 bg-rose-500/5 p-3.5 rounded-xl border border-rose-500/10">
                            <AlertCircle className="h-4 w-4" />
                            <span>{bossError}</span>
                          </div>
                        )}

                        <div className="pt-2">
                          <button
                            onClick={() => setBossHintRevealed(!bossHintRevealed)}
                            className="text-xs text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1 underline font-mono"
                          >
                            {bossHintRevealed ? "Hide Overlord Clue" : "Request Overlord Clue"}
                          </button>
                          <AnimatePresence>
                            {bossHintRevealed && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mt-3"
                              >
                                <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4 text-xs text-cyan-300 leading-relaxed italic">
                                  <HelpCircle className="h-4.5 w-4.5 inline mr-2 text-cyan-400" />
                                  {finalBoss.hint}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4">
                        <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                        <h3 className="font-display font-black text-white text-xl uppercase tracking-wider">Mainframe Breached successfully!</h3>
                        <p className="text-slate-300 text-xs max-w-sm mx-auto">
                          You have cleared the security overrides and completely escaped the {currentWorld.title} reality matrix!
                        </p>
                      </div>
                    )}

                  </CardContent>
                </Card>
              )}
            </div>

          </div>
        )}

        {/* Exit Portal */}
        <div className="text-center pt-4">
          <Link href={`/world/${id}/settings`}>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white font-extrabold px-8 py-6 rounded-full text-sm uppercase tracking-wider shadow-lg shadow-purple-500/15">
              Proceed to World Settings →
            </Button>
          </Link>
        </div>

      </main>
    </div>
  );
}
