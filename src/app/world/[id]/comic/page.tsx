"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Tv, 
  Sparkles, 
  MessageSquare,
  Music,
  Volume2,
  VolumeX,
  Play
} from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAudio } from "@/lib/audio";

export default function ComicPage() {
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

  useEffect(() => {
    if (id) {
      fetchWorldDetails(id);
    }
  }, [id, fetchWorldDetails]);

  // Start ambient on mount
  useEffect(() => {
    // Enable audio on user click, but we can call startAmbient in case the context is already active
    startAmbient();
  }, [startAmbient]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Assembling Narrative Panels...</p>
      </div>
    );
  }

  if (!currentWorld) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-center px-4">
        <Tv className="h-16 w-16 text-slate-600 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">Comic Book Lost</h2>
        <p className="text-slate-400 max-w-sm mt-2">
          This world details could not be found. Let&apos;s return to the dashboard.
        </p>
        <Link href="/dashboard" className="pt-4">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Get comic panels (default to empty if not generated yet)
  const panels = (currentWorld as any).comic || [];

  // Visual gradients based on world type
  const getPanelGradient = (idx: number) => {
    const title = currentWorld.title.toLowerCase();
    if (title.includes("techoria")) {
      const colors = [
        "from-blue-600/20 to-indigo-900/40 border-blue-500/30",
        "from-indigo-600/20 to-purple-900/40 border-purple-500/30",
        "from-cyan-600/20 to-blue-900/40 border-cyan-500/30",
        "from-violet-600/20 to-fuchsia-900/40 border-violet-500/30",
        "from-teal-600/20 to-indigo-950/40 border-teal-500/30"
      ];
      return colors[idx % colors.length];
    } else if (title.includes("aurum")) {
      const colors = [
        "from-amber-600/20 to-yellow-950/40 border-amber-500/30",
        "from-yellow-600/20 to-orange-900/40 border-yellow-500/30",
        "from-orange-600/20 to-amber-950/40 border-orange-500/30",
        "from-amber-700/20 to-yellow-900/40 border-amber-600/30",
        "from-yellow-500/20 to-orange-950/40 border-yellow-400/30"
      ];
      return colors[idx % colors.length];
    } else if (title.includes("aetheria")) {
      const colors = [
        "from-pink-600/20 to-rose-950/40 border-pink-500/30",
        "from-purple-600/20 to-violet-900/40 border-purple-500/30",
        "from-rose-600/20 to-pink-900/40 border-rose-500/30",
        "from-fuchsia-600/20 to-purple-950/40 border-fuchsia-500/30",
        "from-pink-500/20 to-rose-900/40 border-pink-400/30"
      ];
      return colors[idx % colors.length];
    } else {
      // Kingdom of Process
      const colors = [
        "from-slate-600/20 to-zinc-900/40 border-slate-500/30",
        "from-zinc-600/20 to-stone-900/40 border-zinc-500/30",
        "from-stone-600/20 to-neutral-900/40 border-stone-500/30",
        "from-neutral-600/20 to-slate-950/40 border-neutral-500/30",
        "from-slate-500/20 to-zinc-950/40 border-slate-400/30"
      ];
      return colors[idx % colors.length];
    }
  };

  const playPanelSFX = (panelType: string) => {
    const audio = getAudio();
    if (panelType === "Problem") {
      audio.playDoorUnlocked();
    } else if (panelType === "Conflict") {
      audio.playBossEncounter();
    } else if (panelType === "Investigation") {
      audio.playTone ? audio.playTone([440, 554, 659], 'sine', 0.3, 0.4) : audio.playQuestAccepted();
    } else if (panelType === "Solution") {
      audio.playQuestCompleted();
    } else if (panelType === "Ending") {
      audio.playWorldGenerated();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500 selection:text-black">
      
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
              <Tv className="h-5 w-5 text-emerald-400" />
              <span className="font-display font-black tracking-tight text-lg uppercase">Comic Chronicles</span>
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
              className={`p-1 rounded-full hover:bg-white/10 transition-colors ${ambientPlaying ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`}
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
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
        
        {/* Title Block */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/10 px-3 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5" />
            Comic Generator Active
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-none">
            The Legend of <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{currentWorld.title}</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Every business document harbors a saga. Here is the visual chronicle of {currentWorld.title}&apos;s challenges, struggles, and core triumphs. Click any panel to play its chiptune sound!
          </p>
        </div>

        {/* Comic Strip Layout */}
        {panels.length === 0 ? (
          <Card className="border-dashed border-white/10 bg-slate-900/20 py-16 text-center space-y-4">
            <Tv className="h-12 w-12 text-slate-500 mx-auto animate-bounce" />
            <h3 className="font-display font-semibold text-white text-lg">No Panels Generated</h3>
            <p className="text-slate-400 max-w-sm mx-auto text-xs">
              This world does not have a comic layout. Try regenerating this world on the overview panel to compile the narrative frames!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {panels.map((p: any, idx: number) => {
              const gradientClass = getPanelGradient(idx);
              const isFullRow = idx === 4; // Final Ending panel spans wider on grid

              return (
                <motion.div
                  key={idx}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-gradient-to-b ${gradientClass} transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl cursor-pointer p-6 min-h-[360px] ${
                    isFullRow ? "md:col-span-12" : "md:col-span-6"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  onClick={() => playPanelSFX(p.type)}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                    <span className="text-[10px] bg-white/15 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono font-bold text-emerald-300">
                      Panel {p.panel}: {p.type}
                    </span>
                    <button
                      className="p-1 rounded-full bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 transition-colors"
                      title="Play Panel Theme Sound"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Panel Image Placeholder with SVG Art */}
                  <div className="flex-1 min-h-[160px] bg-slate-950/60 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-center p-4 text-center select-none group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5 opacity-50" />
                    
                    {/* SVG Illustration Placeholder */}
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Tv className="h-6 w-6 text-emerald-400" />
                    </div>
                    
                    <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block mb-1">Illustration Placeholder</span>
                    <p className="text-[10px] text-slate-500 italic max-w-[240px] leading-relaxed">
                      &quot;Scene depicting: {p.narrative}&quot;
                    </p>
                  </div>

                  {/* Speech Bubble / Dialogue Block */}
                  {p.dialogue && (
                    <div className="mt-4 relative bg-white text-slate-950 rounded-2xl p-4 shadow-xl text-xs leading-relaxed font-bold tracking-tight">
                      {/* Triangle pointer of speech bubble */}
                      <div className="absolute bottom-full left-6 w-0 h-0 border-8 border-transparent border-b-white" />
                      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-emerald-600 mb-1">
                        <MessageSquare className="h-3 w-3" />
                        Dialogue Box
                      </div>
                      <p className="font-display font-medium text-[11px] leading-relaxed">
                        {p.dialogue}
                      </p>
                    </div>
                  )}

                  {/* Narrative footer text */}
                  <div className="mt-4 text-[11px] text-slate-300 font-serif leading-relaxed italic bg-slate-900/50 p-3 rounded-xl border border-white/5">
                    {p.narrative}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Comic Footer Portal */}
        <div className="text-center pt-8">
          <Link href={`/world/${id}/escape-room`}>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold px-8 py-6 rounded-full text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/15">
              Proceed to Escape Room Puzzles →
            </Button>
          </Link>
        </div>

      </main>
    </div>
  );
}
