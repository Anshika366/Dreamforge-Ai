"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Plus, 
  Sparkles, 
  BookOpen, 
  Swords, 
  Scroll, 
  ShieldAlert, 
  User, 
  Map, 
  Compass, 
  Clock, 
  ArrowRight,
  Terminal,
  Layers,
  GitMerge,
  Play
} from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const { worlds, loading, fetchWorlds } = useWorldStore();

  useEffect(() => {
    fetchWorlds();
  }, [fetchWorlds]);

  const quickActions = [
    {
      title: "Create Story",
      desc: "Turn business reviews into novels",
      icon: BookOpen,
      color: "from-blue-600 to-indigo-600",
      type: "story"
    },
    {
      title: "Create RPG",
      desc: "Generate campaign rules from spec files",
      icon: Swords,
      color: "from-purple-600 to-pink-600",
      type: "rpg"
    },
    {
      title: "Create Comic",
      desc: "Script graphic panels from project briefs",
      icon: Scroll,
      color: "from-pink-600 to-rose-600",
      type: "comic"
    },
    {
      title: "Create Escape Room",
      desc: "Solve code bugs as locks & puzzles",
      icon: ShieldAlert,
      color: "from-red-600 to-amber-600",
      type: "escape-room"
    },
    {
      title: "Create Character AI",
      desc: "Convert team profiles into NPCs",
      icon: User,
      color: "from-amber-600 to-yellow-600",
      type: "character"
    }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      
      {/* 3D scrolling grid and organic drifting background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="animate-grid" style={{ opacity: 0.4 }} />
        <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-3xl animate-drift-slow" />
        <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl animate-drift-slower" />
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold font-display text-white tracking-tight">
            DreamForge AI Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your fantasy realms, create new simulations, and check character rosters.
          </p>
        </div>
        <Link href="/upload">
          <Button variant="glow" className="gap-2">
            <Plus className="h-4 w-4" />
            Forge New World
          </Button>
        </Link>
      </div>

      {/* Onboarding Checklist Guide (30-Second Demo Path) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 p-6 md:p-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-slate-950 via-primary/5 to-slate-950 relative overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.1)] border-glow"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs text-accent font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>New Here?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white uppercase">
              30-Second Demo Walkthrough
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Experience the entire DreamForge AI value loop in seconds. Watch a real-world document convert into a fantasy map, chat with characters, and play the RPG.
            </p>
            
            {/* Checklist items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              {[
                { step: "1", text: "Load Demo Spec" },
                { step: "2", text: "Generate World" },
                { step: "3", text: "Talk to NPC" },
                { step: "4", text: "Open RPG" },
                { step: "5", text: "Complete Quest" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg p-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-[10px] font-bold font-mono">
                    {item.step}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-300 font-mono">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 w-full lg:w-auto flex flex-col gap-2">
            <Link href="/demo" className="w-full">
              <Button variant="glow" size="lg" className="w-full justify-center px-8 shadow-xl shadow-primary/20 font-bold uppercase tracking-wider text-xs gap-2">
                <Play className="h-4 w-4 fill-white animate-pulse" />
                Start Demo Path
              </Button>
            </Link>
            <span className="text-[10px] text-slate-500 font-mono text-center block">Ideal for Hackathon Judges</span>
          </div>

        </div>
      </motion.div>


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Section */}
        <div className="lg:col-span-3 space-y-10">
          
          {/* Quick Actions Grid */}
          <div>
            <h2 className="text-lg font-bold font-display text-slate-200 mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Quick Forge Templates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="relative block"
                  >
                    <Link href={`/upload?type=${action.type}`}>
                      <Card className="h-full border-white/5 bg-slate-950/40 glow-card-hover cursor-pointer">
                        <CardHeader className="p-5">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} p-[1px] mb-3`}>
                            <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center">
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <CardTitle className="text-base text-white">{action.title}</CardTitle>
                          <CardDescription className="text-xs text-slate-400 mt-1">
                            {action.desc}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Recent Worlds Section */}
          <div>
            <h2 className="text-lg font-bold font-display text-slate-200 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-light" />
              Recent Worlds
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-40 rounded-xl bg-white/5 animate-pulse border border-white/5" />
                ))}
              </div>
            ) : worlds.length === 0 ? (
              <Card className="text-center p-12 border-dashed border-primary/20 bg-slate-950/20 relative overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.05)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)] pointer-events-none" />
                <div className="relative z-10 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary-light shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                    <Compass className="h-7 w-7 animate-spin [animation-duration:15s]" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-bold font-display text-white uppercase tracking-wider">
                      The Realm Ledger Is Empty
                    </CardTitle>
                    <CardDescription className="max-w-xs mx-auto mt-2 text-slate-400 text-xs sm:text-sm">
                      Forge your first universe from a PRD, meeting note, or wiki. Let your documents write their legend.
                    </CardDescription>
                  </div>
                  <div className="pt-2">
                    <Link href="/upload">
                      <Button variant="glow" size="lg" className="px-6 font-bold uppercase tracking-wider text-xs">
                        Create World
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {worlds.map((world) => (
                  <motion.div
                    key={world.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Link href={`/world/${world.id}`}>
                      <Card className="h-full flex flex-col justify-between border-white/5 bg-slate-950/30 glow-card-hover cursor-pointer overflow-hidden group">
                        
                        {/* Map Image preview block */}
                        <div className="h-24 w-full relative overflow-hidden bg-slate-900 border-b border-white/5">
                          <img 
                            src={world.mapUrl} 
                            alt={world.title} 
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                          <span className="absolute bottom-2 left-4 font-display font-bold text-lg text-white">
                            {world.title}
                          </span>
                        </div>

                        <CardHeader className="p-4 pb-2">
                          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                            {world.lore}
                          </p>
                        </CardHeader>

                        <CardContent className="p-4 pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-white/5 mt-4">
                          <div className="flex gap-4">
                            <span>🎭 {world.characters?.length || 0} NPCs</span>
                            <span>⚔️ {world.quests?.length || 0} Quests</span>
                          </div>
                          <span className="text-primary-light font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Enter <ArrowRight className="h-3 w-3" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Panel */}
        <div className="space-y-6">
          
          {/* Quick Stats */}
          <Card className="border-white/5 bg-slate-950/50 p-6">
            <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2 text-sm uppercase tracking-wider">
              <Layers className="h-4 w-4 text-secondary-light" />
              Your Forge Ledger
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Realms</span>
                <span className="font-mono text-white font-bold">{worlds.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">NPCs Commissioned</span>
                <span className="font-mono text-white font-bold">
                  {worlds.reduce((sum, w) => sum + (w.characters?.length || 0), 0)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Quests Created</span>
                <span className="font-mono text-white font-bold">
                  {worlds.reduce((sum, w) => sum + (w.quests?.length || 0), 0)}
                </span>
              </div>
            </div>
          </Card>

          {/* Developer Panel */}
          <Card className="border-white/5 bg-slate-950/50 p-6 relative overflow-hidden border-glow">
            <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2 text-sm uppercase tracking-wider text-primary-light">
              <Terminal className="h-4 w-4 text-primary-light" />
              Developer Panel
            </h3>
            <div className="space-y-3">
              <Link href="/mcp" className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-2.5">
                  <Terminal className="h-4 w-4 text-slate-400 group-hover:text-primary-light transition-colors" />
                  <span className="text-xs text-slate-300 font-medium font-mono">MCP Developer Console</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link href="/integrations" className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-2.5">
                  <GitMerge className="h-4 w-4 text-slate-400 group-hover:text-primary-light transition-colors" />
                  <span className="text-xs text-slate-300 font-medium font-mono">Enterprise Integrations</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link href="/demo" className="flex items-center justify-between p-2.5 rounded-lg bg-primary/10 hover:bg-primary/15 border border-primary/20 hover:border-primary/30 transition-all group shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-primary-light animate-pulse" />
                  <span className="text-xs text-white font-bold font-mono">⚡ Hackathon Demo Mode</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-primary-light group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>

          {/* Builder Tip */}
          <Card className="border-white/5 bg-slate-950/50 p-6">
            <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider text-accent">
              <Terminal className="h-4 w-4 text-accent" />
              Forge Master Tip
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When creating a world, try uploading documents with specific team rosters or code snippets. The AI translates variable names and roles directly into corresponding classes, items, and spells!
            </p>
          </Card>

        </div>

      </div>

      </div>
    </div>
  );
}
