"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Compass, 
  User, 
  Swords, 
  Map, 
  ArrowLeft, 
  Calendar,
  Sparkles,
  Terminal,
  Trophy,
  RefreshCw,
  BookOpen,
  Play,
  Lock,
  Settings,
  Tv,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BossCard } from "@/components/BossCard";

export default function WorldOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const { 
    currentWorld, 
    currentCharacters,
    currentQuests,
    currentBoss,
    currentProgress,
    loading, 
    fetchWorldDetails,
    regenerateWorld
  } = useWorldStore();
  
  const [activeSection, setActiveSection] = useState<"overview" | "characters" | "quests">("overview");
  const [reforging, setReforging] = useState(false);

  // Refs for scrolling
  const overviewRef = useRef<HTMLDivElement>(null);
  const charactersRef = useRef<HTMLDivElement>(null);
  const questsRef = useRef<HTMLDivElement>(null);

  // Helper to determine the mapping translation list (What Just Happened?)
  const getTranslationMappings = () => {
    if (!currentWorld) return [];
    const title = currentWorld.title.toLowerCase();
    if (title.includes("techoria")) {
      return [
        { reality: "Authentication Bug (Heap Overflow)", fantasy: "The Authentication Curse (Auth Crypts)" },
        { reality: "Server Outage (Memory Leak crash)", fantasy: "Crystal Core Collapse (Infra Vault)" },
        { reality: "Quarterly Revenue Drop (-15% gold)", fantasy: "The Dragon Tax Crisis (Deploy Dome)" }
      ];
    }
    if (title.includes("aurum") || title.includes("gold")) {
      return [
        { reality: "Discretionary Budget Inflation", fantasy: "Inflation, the Gold-Eating Behemoth" },
        { reality: "Customer Retention Churn rate", fantasy: "The Churn rate Ritual (Amulet of Loyalty)" },
        { reality: "Tax Overdue Audit & Penalties", fantasy: "Slay the Cost-Overrun Drake (Ledger of Exemption)" }
      ];
    }
    if (title.includes("aetheria") || title.includes("creative")) {
      return [
        { reality: "Click-Through Rate (CTR) drop-offs", fantasy: "Exorcise the Clickbait Mimics" },
        { reality: "Overlapping CSS Margins & padding", fantasy: "The Grid Alignment Lock (Stylus of Pixels)" },
        { reality: "User Impressions decline", fantasy: "The Algorithm, Lord of Attention" }
      ];
    }
    return [
      { reality: "Project Delay Bottleneck", fantasy: "Bureaucracy, the Red-Tape Hydra" },
      { reality: "Regulatory Operations Triplicate Stamps", fantasy: "Untangle the Red-Tape Labyrinth (SOP Certificate)" },
      { reality: "Unoptimized Supply routes", fantasy: "The Supply Chain Ambush (Logistics Boots)" }
    ];
  };

  useEffect(() => {
    if (id) {
      fetchWorldDetails(id);
    }
  }, [id, fetchWorldDetails]);

  const scrollToSection = (section: "overview" | "characters" | "quests", ref: React.RefObject<HTMLDivElement | null>) => {
    setActiveSection(section);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleRegenerate = async () => {
    if (!id || reforging) return;
    if (confirm("Are you sure you want to re-forge this world? This will wipe progress and generate new NPCs, quests, story chapters, and regions based on the original template.")) {
      setReforging(true);
      try {
        await regenerateWorld(id);
        alert("Realm re-forged successfully! Loading new elements...");
      } catch (e) {
        console.error(e);
      } finally {
        setReforging(false);
      }
    }
  };

  if (loading || reforging) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-slate-400 text-sm font-medium">
          {reforging ? "Re-forging Reality Matrix..." : "Entering World Portal..."}
        </p>
      </div>
    );
  }

  if (!currentWorld) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <Compass className="h-16 w-16 text-slate-600 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">Realm Lost in the Void</h2>
        <p className="text-slate-400 max-w-sm mt-2">
          We couldn&apos;t locate this world. It may have been dissolved back into raw documents.
        </p>
        <Link href="/dashboard" className="pt-4">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Generate a map preview image URL based on name
  const getMapPreview = () => {
    const title = currentWorld.title.toLowerCase();
    if (title.includes("techoria")) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60";
    }
    if (title.includes("aurum")) {
      return "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=60";
    }
    return "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=60";
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      
      {/* 3D scrolling grid and organic drifting background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="animate-grid" style={{ opacity: 0.35 }} />
        <div className="absolute top-[15%] left-[5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl animate-drift-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-3xl animate-drift-slower" />
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
      
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          <Calendar className="h-3.5 w-3.5" />
          <span>Forged on {new Date(currentWorld.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar */}
        <aside className="lg:sticky lg:top-24 space-y-4">
          
          {/* Scroll Navigation */}
          <div className="glass-panel rounded-xl p-4 space-y-1">
            <button
              onClick={() => scrollToSection("overview", overviewRef)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeSection === "overview"
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Compass className="h-4 w-4" />
              Overview Summary
            </button>
            <button
              onClick={() => scrollToSection("characters", charactersRef)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeSection === "characters"
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <User className="h-4 w-4" />
              Characters ({currentCharacters.length})
            </button>
            <button
              onClick={() => scrollToSection("quests", questsRef)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeSection === "quests"
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Swords className="h-4 w-4" />
              Quests ({currentQuests.length})
            </button>
          </div>

          {/* Quick World Stats Sidebar panel */}
          <div className="glass-panel rounded-xl p-5 border-white/5 bg-slate-950/40 text-xs text-slate-400 leading-relaxed">
            <h4 className="font-display font-semibold text-white uppercase tracking-wider text-[10px] mb-3 flex items-center gap-1.5 text-accent">
              <Terminal className="h-3.5 w-3.5" />
              Realm Signatures
            </h4>
            <div className="space-y-2">
              <p><strong className="text-slate-300">Name:</strong> {currentWorld.title}</p>
              <p><strong className="text-slate-300">Database Entry:</strong> Prisma PostgreSQL</p>
              <p><strong className="text-slate-300">Progress:</strong> {currentProgress?.completedQuests.length || 0} Quests Completed</p>
            </div>

            {/* ⚡ Regenerate World Button */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <Button
                variant="glow"
                size="sm"
                onClick={handleRegenerate}
                className="w-full h-8 text-[11px] gap-1.5 font-bold uppercase tracking-wider"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate World
              </Button>
            </div>
          </div>

        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-12">
          
          {/* Section 1: Overview & Summary */}
          <div ref={overviewRef} className="scroll-mt-24 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                DreamForge Realm
              </div>
              <h1 className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight">
                {currentWorld.title}
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed bg-white/5 border border-white/5 rounded-2xl p-6">
                {currentWorld.lore}
              </p>
            </div>
            {/* What Just Happened? Reality -> Fantasy Comparative Panel */}
            <div className="p-6 rounded-2xl border border-primary/20 bg-slate-950/40 relative overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.05)] border-glow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <h3 className="text-sm font-bold font-display uppercase tracking-widest text-accent flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                  What Just Happened? (Reality ➔ Fantasy Mapping)
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed text-left">
                  DreamForge AI parsed your document's technical and operational constraints, converting them into active fantasy RPG mechanics:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {getTranslationMappings().map((m, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-slate-950/60 p-3 rounded-lg border border-white/5 relative group hover:border-primary/25 transition-all">
                      <div className="w-[45%] text-left">
                        <span className="text-[8px] text-slate-500 uppercase block font-mono">Reality Doc Input</span>
                        <strong className="text-slate-300 font-mono text-[10px] sm:text-[11px] line-clamp-2">{m.reality}</strong>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary-light shrink-0" />
                      <div className="w-[45%] text-right">
                        <span className="text-[8px] text-slate-500 uppercase block font-mono">Fantasy Translation</span>
                        <strong className="text-primary-light text-[10px] sm:text-[11px] line-clamp-2">{m.fantasy}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Play Mode Navigation Cards (CTA Grid Hub) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-2 pl-1 text-left">
                <Compass className="h-4 w-4 text-primary-light" />
                Select Play Mode or Activity
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Play Sandbox RPG",
                    desc: "Venture into region nodes on the interactive map, resolve quest logs, and earn experience buffers.",
                    icon: Swords,
                    link: `/world/${id}/play`,
                    color: "border-primary/20 hover:border-primary/60 hover:bg-primary/5 text-primary-light"
                  },
                  {
                    title: "Consult NPC Team",
                    desc: "Consult compiled NPC professionals in real-time, leveraging their specialized memory logs.",
                    icon: User,
                    link: `/world/${id}/characters`,
                    color: "border-secondary/20 hover:border-secondary/60 hover:bg-secondary/5 text-secondary-light"
                  },
                  {
                    title: "Story & Chronicles",
                    desc: "Read the generated chronicles detail chapters summarizing key enterprise events.",
                    icon: BookOpen,
                    link: `/world/${id}/story`,
                    color: "border-accent/20 hover:border-accent/60 hover:bg-accent/5 text-accent"
                  },
                  {
                    title: "Storyboard Comic",
                    desc: "Inspect visual comic cells mapping business conflicts onto storyboard frames.",
                    icon: Tv,
                    link: `/world/${id}/comic`,
                    color: "border-emerald-500/20 hover:border-emerald-500/60 hover:bg-emerald-500/5 text-emerald-400"
                  },
                  {
                    title: "Escape Mainframe",
                    desc: "Decipher Null Reference code overrides and solve logic collision riddles.",
                    icon: Lock,
                    link: `/world/${id}/escape-room`,
                    color: "border-cyan-500/20 hover:border-cyan-500/60 hover:bg-cyan-500/5 text-cyan-400"
                  },
                  {
                    title: "Configure Settings",
                    desc: "Adjust database schema details, direct API configurations, or re-forge the world.",
                    icon: Settings,
                    link: `/world/${id}/settings`,
                    color: "border-purple-500/20 hover:border-purple-500/60 hover:bg-purple-500/5 text-purple-400"
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link href={item.link} key={idx} className="group">
                      <Card className={`h-full border bg-slate-950/40 glow-card-hover cursor-pointer flex flex-col justify-between p-6 ${item.color}`}>
                        <div className="space-y-4 text-left">
                          <div className="flex justify-between items-center">
                            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center">
                              <Icon className="h-5 w-5" />
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                          <div className="space-y-1">
                            <CardTitle className="text-base text-white">{item.title}</CardTitle>
                            <CardDescription className="text-xs text-slate-400 leading-relaxed">
                              {item.desc}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="pt-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider font-mono">
                          <span>Enter Portal</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Boss & Map Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Boss Fight Card */}
              <BossCard boss={currentBoss} />

              {/* Map Preview Card */}
              <Link href={`/world/${id}/map`} className="group">
                <Card className="border-white/5 bg-slate-950/50 hover:border-primary/50 overflow-hidden flex flex-col justify-between h-full transition-all duration-300">
                  <div className="h-44 w-full relative bg-slate-900 overflow-hidden">
                    <img 
                      src={getMapPreview()} 
                      alt="World Map Preview" 
                      className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-xs bg-slate-950/60 border border-white/10 px-2 py-1 rounded-md text-white font-mono flex items-center gap-1.5 backdrop-blur-sm">
                      <Map className="h-3.5 w-3.5 text-primary-light" />
                      World Map Projection
                    </span>
                  </div>
                  <CardContent className="p-4 pt-3 text-xs text-slate-400 leading-relaxed text-left">
                    <p className="mb-3">
                      Topographical grid generated from structure charts. Areas correspond to modules: registry labyrinths, main assembly hubs, and cloud deployment fortresses.
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider font-mono text-primary-light">
                      <span>Open Map Portal</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

            </div>
          </div>

          {/* Section 2: Characters */}
          <div ref={charactersRef} className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold font-display text-white border-b border-white/5 pb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-primary-light" />
              Fantasy NPC Directory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentCharacters?.map((char) => (
                <Card key={char.id} className="border-white/5 bg-slate-950/20 flex flex-col justify-between glow-card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-primary/20 border border-primary/20 text-primary-light px-2 py-0.5 rounded-full font-mono uppercase">
                        {char.role}
                      </span>
                      <span className="text-slate-500 text-xs font-mono">
                        Base: {char.name}
                      </span>
                    </div>
                    <CardTitle className="text-lg text-white font-display mt-2">
                      <Link href={`/world/${id}/character/${char.id}`} className="hover:text-primary-light transition-colors">
                        {char.fantasyName}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-400 text-xs leading-relaxed space-y-3">
                    <p className="border-l-2 border-primary/40 pl-3 italic">
                      &quot;{char.personality}&quot;
                    </p>
                    {char.voiceStyle && (
                      <p className="text-[10px] text-slate-500 font-mono">
                        Speech Style: {char.voiceStyle}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section 3: Quests */}
          <div ref={questsRef} className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold font-display text-white border-b border-white/5 pb-3 flex items-center gap-2">
              <Swords className="h-5 w-5 text-secondary-light" />
              Active Realm Quests
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentQuests?.map((quest) => (
                <Card key={quest.id} className="border-white/5 bg-slate-950/20 flex flex-col justify-between relative overflow-hidden glow-card-hover">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/5 rounded-full blur-xl" />
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-white flex items-start gap-2.5">
                      {quest.title}
                    </CardTitle>
                    <CardDescription className="text-slate-300 text-xs mt-2 leading-relaxed">
                      {quest.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Trophy className="h-3.5 w-3.5 text-accent" />
                        Loot Reward
                      </span>
                      <span className="text-xs font-semibold text-accent font-mono">
                        {quest.reward}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        </div>

      </div>

      </div>
    </div>
  );
}
