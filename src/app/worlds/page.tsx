"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Compass, 
  Search, 
  Plus, 
  Calendar, 
  Sparkles, 
  BookOpen, 
  User, 
  Clock,
  ArrowRight,
  Music,
  Volume2,
  VolumeX
} from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAudio } from "@/lib/audio";

export default function WorldsDirectoryPage() {
  const { 
    worlds, 
    loading, 
    fetchWorlds,
    isMuted,
    volume,
    ambientPlaying,
    toggleMute,
    setVolume,
    startAmbient,
    stopAmbient
  } = useWorldStore();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchWorlds();
  }, [fetchWorlds]);

  // Start ambient on mount
  useEffect(() => {
    startAmbient();
  }, [startAmbient]);

  // Filters
  const filteredWorlds = worlds.filter((w) => {
    const titleMatch = w.title.toLowerCase().includes(searchQuery.toLowerCase());
    const loreMatch = w.lore?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return titleMatch || loreMatch;
  });

  const getMapThumbnail = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("techoria")) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60";
    }
    if (t.includes("aurum")) {
      return "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60";
    }
    if (t.includes("aetheria")) {
      return "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&auto=format&fit=crop&q=60";
    }
    return "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary selection:text-black">
      
      {/* Navbar Header */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center space-x-6">
            <Link href="/" className="font-display font-black tracking-tight text-xl bg-gradient-to-r from-primary-light via-secondary-light to-accent bg-clip-text text-transparent uppercase">
              DreamForge AI
            </Link>
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/upload" className="text-sm text-slate-400 hover:text-white transition-colors">
                Forge World
              </Link>
              <Link href="/worlds" className="text-sm text-white font-semibold">
                Directory
              </Link>
            </nav>
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
              className={`p-1 rounded-full hover:bg-white/10 transition-colors ${ambientPlaying ? 'text-primary animate-pulse' : 'text-slate-400'}`}
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
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      </header>

      {/* Main Directory Dashboard */}
      <main className="container mx-auto px-4 py-16 max-w-7xl space-y-12">
        
        {/* Title and Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs text-primary-light font-bold uppercase tracking-widest bg-primary/10 border border-primary/10 px-3 py-1 rounded-full">
              <Compass className="h-3.5 w-3.5 text-primary-light" />
              World Directory Index
            </div>
            <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight uppercase leading-none">
              Forged Realms
            </h1>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              Explore your library of procedurally generated worlds, synthesized from software documentation, spreadsheets, and design specs.
            </p>
          </div>
          <Link href="/upload">
            <Button variant="primary" className="h-12 px-6 uppercase font-bold tracking-wider gap-2">
              <Plus className="h-4 w-4" />
              Forge New World
            </Button>
          </Link>
        </div>

        {/* Filter controls panel */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white/5 border border-white/5 rounded-2xl p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-500" />
            <Input
              placeholder="Search worlds by title or lore keywords..."
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border-white/10 pl-10 text-white h-12"
            />
          </div>
        </div>

        {/* Worlds Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">Syncing reality buffers...</p>
          </div>
        ) : filteredWorlds.length === 0 ? (
          <Card className="border-dashed border-primary/20 bg-slate-950/20 py-24 text-center space-y-5 relative overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.05)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative z-10 space-y-5">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary-light shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                <Compass className="h-7 w-7 animate-spin [animation-duration:15s]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display text-white uppercase tracking-wider">The Realm Ledger Is Empty</h3>
                <p className="text-slate-400 max-w-sm mx-auto text-xs sm:text-sm">
                  We couldn&apos;t find any forged worlds matching your search. Forge your first universe from a PRD, meeting note, or wiki.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/upload">
                  <Button variant="glow" size="lg" className="px-6 font-bold uppercase tracking-wider text-xs">
                    Forge Your First World
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorlds.map((w, idx) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card className="border-white/5 bg-slate-950/20 overflow-hidden flex flex-col justify-between h-[420px] hover:border-primary/30 transition-all duration-300 group">
                  
                  {/* Thumbnail Banner */}
                  <div className="h-40 w-full relative bg-slate-900 overflow-hidden">
                    <img 
                      src={getMapThumbnail(w.title)} 
                      alt={w.title}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                    
                    {/* Timestamp badge */}
                    <span className="absolute bottom-3 left-4 text-[9px] bg-slate-950/70 border border-white/10 px-2 py-1 rounded-md text-white font-mono flex items-center gap-1 backdrop-blur-sm">
                      <Clock className="h-3 w-3 text-primary-light" />
                      <span>{new Date(w.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  {/* Body Details */}
                  <CardHeader className="pb-2">
                    <div className="inline-flex items-center gap-1 text-[9px] font-bold text-accent uppercase tracking-wider font-mono">
                      <Sparkles className="h-3 w-3" />
                      ACTIVE RPG REALM
                    </div>
                    <CardTitle className="text-xl text-white font-display mt-2 group-hover:text-primary-light transition-colors">
                      {w.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between p-6 pt-0 space-y-4">
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {w.lore}
                    </p>

                    {/* Footer / Link */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        NPCs: {w.characters?.length || 1}
                      </span>
                      
                      <Link href={`/world/${w.id}`} className="inline-flex items-center gap-1.5 text-xs text-primary-light font-bold hover:underline">
                        <span>Enter Realm</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </CardContent>

                </Card>
              </motion.div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
