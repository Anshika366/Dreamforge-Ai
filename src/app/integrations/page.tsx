"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Sparkles, 
  GitMerge, 
  Mail, 
  MessageSquare, 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Coins, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Music,
  ArrowRight,
  Database,
  Info
} from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAudio } from "@/lib/audio";

interface Relationship {
  from: string;
  relation: string;
  to: string;
}

interface WorkIQResult {
  characters: Array<{
    name: string;
    fantasyName: string;
    role: string;
    personality: string;
    memory: string[];
    backstory: string;
  }>;
  relationships: Relationship[];
  quests: Array<{
    title: string;
    description: string;
    reward: string;
  }>;
}

interface FoundryIQResult {
  facts: string[];
  timeline: Array<{
    year: string;
    event: string;
  }>;
}

interface FabricIQResult {
  mechanics: {
    economyRate: string;
    manaTaxes: string;
    worldDifficulty: string;
  };
  events: Array<{
    metric: string;
    fantasyEvent: string;
    consequence: string;
    severity: string;
  }>;
}

export default function IntegrationsPage() {
  const router = useRouter();
  
  const { 
    isMuted,
    volume,
    ambientPlaying,
    toggleMute,
    setVolume,
    startAmbient,
    stopAmbient,
    worlds,
    fetchWorlds
  } = useWorldStore();

  // Selected Integration Tab
  const [activeTab, setActiveTab] = useState("workiq");
  
  // Inputs
  const [workIQInput, setWorkIQInput] = useState(
    "Subject: Urgent Auth Portal Deployment Issues\n" +
    "Hi team, we are seeing recurring Authentication Bugs in the login loop. Kael (Lead SysEng) suggests a temporary bypass, but Arkon (High Mage) strongly objects due to compliance rules. They had a heated debate in the workspace today. Please mediate before production."
  );
  
  const [foundryIQInput, setFoundryIQInput] = useState(
    "# Enterprise Architecture Wiki\n" +
    "- Year 1: Initial deployment of our Authentication Portal (Prisma Database Initialized).\n" +
    "- Year 2: Encountered severe memory leaks (The Dark Curse Exception) in Compiler Core.\n" +
    "- Year 3: Sudden server outage crash (Crystal Core Collapse) caused partial sector lockouts.\n" +
    "- Year 4: Scheduled Sacred Launch Ceremony to unlock full continuous delivery channels."
  );
  
  const [fabricIQInput, setFabricIQInput] = useState(
    "KPI Metrics summary:\n" +
    "- Revenue Drop of 12% below target threshold.\n" +
    "- High traffic surges creating response bottlenecks.\n" +
    "- Database outages triggered alert codes last night."
  );

  // Loading states
  const [loading, setLoading] = useState(false);
  const [mergeLoading, setMergeLoading] = useState(false);
  
  // Results
  const [workIQResult, setWorkIQResult] = useState<WorkIQResult | null>(null);
  const [foundryIQResult, setFoundryIQResult] = useState<FoundryIQResult | null>(null);
  const [fabricIQResult, setFabricIQResult] = useState<FabricIQResult | null>(null);

  // Merge Targets
  const [selectedWorldId, setSelectedWorldId] = useState<string>("");
  const [mergeStatus, setMergeStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  useEffect(() => {
    startAmbient();
    fetchWorlds();
  }, [startAmbient, fetchWorlds]);

  // Set default selected world when worlds load
  useEffect(() => {
    if (worlds.length > 0 && !selectedWorldId) {
      setSelectedWorldId(worlds[0].id);
    }
  }, [worlds, selectedWorldId]);

  const handleTriggerAnalysis = async (source: "workiq" | "foundryiq" | "fabriciq") => {
    setLoading(true);
    setMergeStatus(null);
    const inputs = source === "workiq" ? workIQInput : source === "foundryiq" ? foundryIQInput : fabricIQInput;
    
    try {
      const res = await fetch("/api/integrations/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, inputs })
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();

      if (source === "workiq") {
        setWorkIQResult(data.result);
        getAudio().playQuestAccepted();
      } else if (source === "foundryiq") {
        setFoundryIQResult(data.result);
        getAudio().playDoorUnlocked();
      } else {
        setFabricIQResult(data.result);
        getAudio().playBossEncounter();
      }
    } catch (e: any) {
      alert(`Error triggering integration: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMergeToWorld = async () => {
    if (!selectedWorldId) {
      alert("Please select a target world first");
      return;
    }

    let payload: any = null;
    if (activeTab === "workiq") payload = workIQResult;
    else if (activeTab === "foundryiq") payload = foundryIQResult;
    else if (activeTab === "fabriciq") payload = fabricIQResult;

    if (!payload) {
      alert("Please trigger and generate the preview payload first.");
      return;
    }

    setMergeLoading(true);
    setMergeStatus(null);

    try {
      const res = await fetch(`/api/world/${selectedWorldId}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: activeTab, payload })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to merge data");

      setMergeStatus({ success: true, message: data.message });
      getAudio().playWorldGenerated();
    } catch (e: any) {
      setMergeStatus({ success: false, message: e.message });
      getAudio().playBossEncounter();
    } finally {
      setMergeLoading(false);
    }
  };

  // Pre-filled template click handlers
  const useTemplate = (source: string, text: string) => {
    if (source === "workiq") setWorkIQInput(text);
    else if (source === "foundryiq") setFoundryIQInput(text);
    else setFabricIQInput(text);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary selection:text-black">
      
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span>Back Overview</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <GitMerge className="h-5 w-5 text-primary-light" />
              <span className="font-display font-black tracking-tight text-lg uppercase">Integrations</span>
            </div>
          </div>

          {/* Audio controls */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-3 py-1.5">
            <button
              onClick={() => {
                if (ambientPlaying) {
                  stopAmbient();
                } else {
                  startAmbient();
                }
              }}
              className={`p-1 rounded-full hover:bg-white/10 transition-colors ${ambientPlaying ? 'text-primary-light animate-pulse' : 'text-slate-400'}`}
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
              onChange={(e: any) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        
        {/* Title */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs text-primary-light font-bold uppercase tracking-widest bg-primary/10 border border-primary/10 px-3 py-1 rounded-full">
            <Zap className="h-3.5 w-3.5" />
            Enterprise Data Bridge
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight uppercase leading-none">
            Enterprise Integrations Dashboard
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Bridge your real-world communication threads, handbook documentation, and KPI databases directly into custom sandbox mechanics. Preview outputs visually and merge changes.
          </p>
        </div>

        {/* Tab Selection */}
        <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setMergeStatus(null); }} className="space-y-8">
          
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <TabsList>
              <TabsTrigger value="workiq" className="gap-2">
                <Mail className="h-4 w-4" />
                <span>Work IQ</span>
              </TabsTrigger>
              <TabsTrigger value="foundryiq" className="gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Foundry IQ</span>
              </TabsTrigger>
              <TabsTrigger value="fabriciq" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Fabric IQ</span>
              </TabsTrigger>
            </TabsList>
            
            <span className="text-xs font-mono text-slate-500 hidden md:inline-block">
              Connection Status: <strong className="text-emerald-400">ONLINE</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Input Form & Specs */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Tab 1 Input: Work IQ */}
              <TabsContent value="workiq" className="space-y-4 m-0">
                <Card className="bg-slate-950/40 border-white/5">
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary-light" />
                      Work IQ: Communication Feed
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Parses team emails, chat transcripts, and slack backlogs into characters, relationship matrices, and social quests.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 font-mono block uppercase">Paste Slack Thread / Email Digest</label>
                      <textarea
                        value={workIQInput}
                        onChange={(e) => setWorkIQInput(e.target.value)}
                        className="w-full min-h-[160px] bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-slate-300 font-mono leading-relaxed focus:border-primary focus:outline-none animate-fadeIn"
                      />
                    </div>

                    {/* Pre-filled chips */}
                    <div className="space-y-2">
                      <span className="text-[9px] text-slate-500 font-mono block uppercase">Templates</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => useTemplate("workiq", "Subject: Urgent Auth Portal Deployment Issues\nHi team, we are seeing recurring Authentication Bugs in the login loop. Kael (Lead SysEng) suggests a temporary bypass, but Arkon (High Mage) strongly objects due to compliance rules. They had a heated debate in the workspace today. Please mediate.")}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 font-mono transition-colors cursor-pointer"
                        >
                          Auth Conflict Thread
                        </button>
                        <button
                          onClick={() => useTemplate("workiq", "Manager Daily: Aurora assigned a new refactoring checklist task to Arkon and Kael. The two engineers need to collaborate, but Kael expresses frustration about the lack of sandbox data.")}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 font-mono transition-colors cursor-pointer"
                        >
                          Refactor Team Log
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleTriggerAnalysis("workiq")}
                      disabled={loading || !workIQInput.trim()}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold uppercase text-xs tracking-wider py-5 rounded-xl gap-2 mt-2"
                    >
                      {loading ? "Analyzing Logs..." : "Trigger Work IQ Scan"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 2 Input: Foundry IQ */}
              <TabsContent value="foundryiq" className="space-y-4 m-0">
                <Card className="bg-slate-950/40 border-white/5">
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary-light" />
                      Foundry IQ: Wiki & Policies
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Imports handbook documents, wiki guidelines, and compliance standards into fantasy historical timelines and facts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 font-mono block uppercase">Paste Handbook Wiki Markdown</label>
                      <textarea
                        value={foundryIQInput}
                        onChange={(e) => setFoundryIQInput(e.target.value)}
                        className="w-full min-h-[160px] bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-slate-300 font-mono leading-relaxed focus:border-primary focus:outline-none"
                      />
                    </div>

                    {/* Pre-filled chips */}
                    <div className="space-y-2">
                      <span className="text-[9px] text-slate-500 font-mono block uppercase">Templates</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => useTemplate("foundryiq", "# Enterprise Architecture Wiki\n- Year 1: Initial deployment of our Authentication Portal (Prisma Database Initialized).\n- Year 2: Encountered severe memory leaks (The Dark Curse Exception) in Compiler Core.\n- Year 3: Sudden server outage crash (Crystal Core Collapse) caused partial sector lockouts.\n- Year 4: Scheduled Sacred Launch Ceremony.")}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 font-mono transition-colors cursor-pointer"
                        >
                          System Core Wiki
                        </button>
                        <button
                          onClick={() => useTemplate("foundryiq", "# Policy Document: Security Compliance\n- Year 1: Audits verified security barriers.\n- Year 2: Encountered credential vulnerability anomalies.\n- Year 3: Rebuilt access shields following minor database breaches.")}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 font-mono transition-colors cursor-pointer"
                        >
                          Compliance Chronology
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleTriggerAnalysis("foundryiq")}
                      disabled={loading || !foundryIQInput.trim()}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold uppercase text-xs tracking-wider py-5 rounded-xl gap-2 mt-2"
                    >
                      {loading ? "Parsing Wiki..." : "Trigger Foundry IQ Scan"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 3 Input: Fabric IQ */}
              <TabsContent value="fabriciq" className="space-y-4 m-0">
                <Card className="bg-slate-950/40 border-white/5">
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary-light" />
                      Fabric IQ: Metrics & KPIs
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Syncs system latency, user traffic spike counters, and sales revenue indices to compile live game event modifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 font-mono block uppercase">Paste Revenue Logs / KPI Metrics</label>
                      <textarea
                        value={fabricIQInput}
                        onChange={(e) => setFabricIQInput(e.target.value)}
                        className="w-full min-h-[160px] bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-slate-300 font-mono leading-relaxed focus:border-primary focus:outline-none"
                      />
                    </div>

                    {/* Pre-filled chips */}
                    <div className="space-y-2">
                      <span className="text-[9px] text-slate-500 font-mono block uppercase">Templates</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => useTemplate("fabriciq", "KPI Metrics summary:\n- Revenue Drop of 12% below target threshold.\n- High traffic surges creating response bottlenecks.\n- Database outages triggered alert codes last night.")}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 font-mono transition-colors cursor-pointer"
                        >
                          Server Alert KPI
                        </button>
                        <button
                          onClick={() => useTemplate("fabriciq", "Financial Report:\n- Traffic spike of 300% on payment gateways.\n- Minor infrastructure latency limits.")}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 font-mono transition-colors cursor-pointer"
                        >
                          Growth Spikes KPIs
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleTriggerAnalysis("fabriciq")}
                      disabled={loading || !fabricIQInput.trim()}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold uppercase text-xs tracking-wider py-5 rounded-xl gap-2 mt-2"
                    >
                      {loading ? "Evaluating Metrics..." : "Trigger Fabric IQ Scan"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

            </div>

            {/* Right Column: Dynamic Preview Panel & Unified Merge Drawer */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Preview Box Container */}
              <Card className="bg-slate-950/40 border-white/5 min-h-[460px] flex flex-col justify-between">
                <div>
                  <CardHeader className="p-5 pb-3 border-b border-white/5 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="h-4.5 w-4.5 text-accent animate-pulse" />
                        Live Integration Preview
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400">
                        Interactive sandbox preview generated from the selected scanning source.
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <div className="p-5">
                    {/* State: No data triggered yet */}
                    {((activeTab === "workiq" && !workIQResult) ||
                      (activeTab === "foundryiq" && !foundryIQResult) ||
                      (activeTab === "fabriciq" && !fabricIQResult)) && (
                      <div className="h-[280px] flex flex-col items-center justify-center text-center text-slate-500">
                        <Database className="h-12 w-12 text-slate-600 mb-3 animate-float" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">No Active Preview</h4>
                        <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                          Trigger the scanning module on the left side panel to synthesize simulated lore maps.
                        </p>
                      </div>
                    )}

                    {/* Preview: Work IQ (NPCs, Quests, Relationship Graph) */}
                    {activeTab === "workiq" && workIQResult && (
                      <div className="space-y-6">
                        {/* Dynamic Relationship Graph */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
                            NPC Relationship Graph
                          </h4>
                          <div className="relative h-[220px] rounded-xl border border-white/5 bg-slate-950/75 overflow-hidden flex items-center justify-center">
                            
                            {/* Graphic SVG Nodes & Connections */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                              {/* Aurora to Arkon link */}
                              <line x1="170" y1="50" x2="280" y2="150" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4 3" />
                              {/* Aurora to Kael link */}
                              <line x1="170" y1="50" x2="60" y2="150" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4 3" />
                              {/* Arkon to Kael link */}
                              <line x1="280" y1="150" x2="60" y2="150" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 4" />
                            </svg>

                            {/* Node 1: Queen Aurora (Player Anchor) */}
                            <div className="absolute top-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-slate-900 border border-primary-light flex items-center justify-center shadow-[0_0_12px_rgba(167,139,250,0.3)]">
                                <span className="text-[10px] font-bold text-primary-light">QA</span>
                              </div>
                              <span className="text-[9px] text-slate-300 font-mono mt-1">Queen Aurora</span>
                            </div>

                            {/* Node 2: Mage Arkon */}
                            <div className="absolute bottom-5 right-12 flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-slate-900 border border-secondary-light flex items-center justify-center shadow-[0_0_12px_rgba(244,114,182,0.3)]">
                                <span className="text-[10px] font-bold text-secondary-light">MA</span>
                              </div>
                              <span className="text-[9px] text-slate-300 font-mono mt-1">Mage Arkon</span>
                              <span className="text-[8px] text-slate-500 font-sans">Mentor</span>
                            </div>

                            {/* Node 3: Shadow Architect Kael */}
                            <div className="absolute bottom-5 left-12 flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-slate-900 border border-accent flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                                <span className="text-[10px] font-bold text-accent font-mono">SK</span>
                              </div>
                              <span className="text-[9px] text-slate-300 font-mono mt-1">Shadow Kael</span>
                              <span className="text-[8px] text-slate-500 font-sans">Rival</span>
                            </div>

                            {/* Labels on links */}
                            <span className="absolute top-[80px] right-[75px] text-[8px] text-primary-light font-mono bg-slate-950 px-1 border border-white/5 rounded">Mentored By</span>
                            <span className="absolute top-[80px] left-[75px] text-[8px] text-secondary-light font-mono bg-slate-950 px-1 border border-white/5 rounded">Rivals With</span>
                            <span className="absolute bottom-6 text-[8px] text-accent font-mono bg-slate-950 px-1 border border-white/5 rounded">Distrusts</span>
                          </div>
                        </div>

                        {/* NPCs generated list */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
                            Generated NPCs
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {workIQResult.characters.map((char, index) => (
                              <div key={index} className="glass-panel p-3 rounded-lg border border-white/5 text-xs space-y-1 bg-slate-950/40">
                                <span className="text-[8px] text-slate-500 uppercase font-mono block">Role: {char.role}</span>
                                <strong className="text-primary-light font-mono block">{char.fantasyName}</strong>
                                <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-2">{char.personality}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quests generated list */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
                            Generated Quests
                          </h4>
                          <div className="glass-panel p-3.5 rounded-lg border border-white/5 bg-slate-950/40 space-y-1.5">
                            {workIQResult.quests.map((q, idx) => (
                              <div key={idx} className="text-xs space-y-0.5">
                                <strong className="text-accent font-mono">{q.title}</strong>
                                <p className="text-slate-400 text-[10px] leading-relaxed">{q.description}</p>
                                <span className="text-[9px] text-emerald-400 font-mono block mt-1">🎁 Reward: {q.reward}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preview: Foundry IQ (Facts & History Timeline) */}
                    {activeTab === "foundryiq" && foundryIQResult && (
                      <div className="space-y-6">
                        
                        {/* Vertical History Timeline */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
                            Chronicle History Timeline
                          </h4>

                          <div className="relative pl-6 border-l border-white/10 space-y-4 mt-2">
                            {foundryIQResult.timeline.map((item, idx) => (
                              <div key={idx} className="relative text-xs">
                                
                                {/* Bullet indicator */}
                                <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-slate-950 border border-primary-light shadow-[0_0_8px_#a78bfa] flex items-center justify-center">
                                  <div className="w-1 h-1 rounded-full bg-primary" />
                                </div>

                                <span className="text-[10px] font-mono font-bold text-primary-light uppercase block">{item.year}</span>
                                <p className="text-slate-300 leading-relaxed mt-0.5">{item.event}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Facts list */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
                            Analyzed Lore Rules
                          </h4>
                          <div className="space-y-2">
                            {foundryIQResult.facts.map((fact, index) => (
                              <div key={index} className="flex gap-2 items-start text-xs bg-slate-950/60 p-3 rounded-lg border border-white/5">
                                <Info className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                                <p className="text-slate-400 leading-relaxed font-mono">{fact}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preview: Fabric IQ (Modifiers & Event Cards) */}
                    {activeTab === "fabriciq" && fabricIQResult && (
                      <div className="space-y-6">
                        
                        {/* Modifiers List */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
                            Gameplay Mechanics Calibration
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="glass-panel p-3 rounded-lg border border-white/5 text-center bg-slate-950/50">
                              <span className="text-[8px] text-slate-500 uppercase block font-mono">Economy Scale</span>
                              <strong className="text-slate-200 text-[10px] font-mono block mt-1">{fabricIQResult.mechanics.economyRate}</strong>
                            </div>
                            <div className="glass-panel p-3 rounded-lg border border-white/5 text-center bg-slate-950/50">
                              <span className="text-[8px] text-slate-500 uppercase block font-mono">Mana Taxes</span>
                              <strong className="text-slate-200 text-[10px] font-mono block mt-1">{fabricIQResult.mechanics.manaTaxes}</strong>
                            </div>
                            <div className="glass-panel p-3 rounded-lg border border-white/5 text-center bg-slate-950/50">
                              <span className="text-[8px] text-slate-500 uppercase block font-mono">Difficulty Modifier</span>
                              <strong className="text-slate-200 text-[10px] font-mono block mt-1">{fabricIQResult.mechanics.worldDifficulty}</strong>
                            </div>
                          </div>
                        </div>

                        {/* World Events Section */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
                            Fabric IQ World Events
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {fabricIQResult.events.map((e, idx) => (
                              <div key={idx} className="glass-panel p-3 rounded-xl border border-white/5 bg-slate-950/40 flex flex-col justify-between space-y-3 relative overflow-hidden group">
                                <span className={`absolute top-2 right-3 px-1.5 py-0.5 rounded font-mono font-bold text-[8px] uppercase ${
                                  e.severity === "Critical" 
                                    ? "bg-rose-500/15 text-rose-400 border border-rose-500/20" 
                                    : e.severity === "High"
                                      ? "bg-amber-500/15 text-accent border border-amber-500/20"
                                      : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                                }`}>
                                  {e.severity}
                                </span>

                                <div className="space-y-1">
                                  <span className="text-[9px] text-slate-500 font-mono block uppercase truncate max-w-[80%]">{e.metric}</span>
                                  <strong className="text-primary-light font-display text-[11px] block">{e.fantasyEvent}</strong>
                                </div>
                                <p className="text-slate-400 text-[9px] leading-relaxed mt-1">{e.consequence}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                </div>

                {/* Unified Merge Drawer panel inside card bottom */}
                <div className="border-t border-white/5 bg-slate-950/80 p-5 rounded-b-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    
                    {/* World Target Dropdown */}
                    <div className="w-full sm:flex-1 space-y-1 text-left">
                      <span className="text-[9px] text-slate-500 font-mono block uppercase">Target Sandbox Realm</span>
                      {worlds.length === 0 ? (
                        <div className="text-xs text-amber-500">No active worlds found. Please create one.</div>
                      ) : (
                        <select
                          value={selectedWorldId}
                          onChange={(e) => setSelectedWorldId(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none"
                        >
                          {worlds.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.title} ({w.id})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Merge button */}
                    <Button
                      onClick={handleMergeToWorld}
                      disabled={
                        mergeLoading || 
                        !selectedWorldId || 
                        (activeTab === "workiq" && !workIQResult) ||
                        (activeTab === "foundryiq" && !foundryIQResult) ||
                        (activeTab === "fabriciq" && !fabricIQResult)
                      }
                      className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-extrabold uppercase text-xs tracking-wider px-8 py-5 rounded-xl gap-2 mt-auto"
                    >
                      {mergeLoading ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-slate-950/20 border-t-slate-950 animate-spin" />
                          <span>Merging...</span>
                        </>
                      ) : (
                        <>
                          <GitMerge className="h-4 w-4" />
                          <span>Merge to Sandbox</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Merge Action Feedback */}
                  <AnimatePresence>
                    {mergeStatus && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className={`p-3 rounded-lg border text-xs leading-relaxed ${
                          mergeStatus.success 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        <div className="flex gap-2 items-start">
                          <CheckCircle2 className={`h-4.5 w-4.5 shrink-0 ${mergeStatus.success ? 'text-emerald-400' : 'text-rose-400'}`} />
                          <p>{mergeStatus.message}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </Card>

            </div>

          </div>

        </Tabs>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950/40 py-6 text-center text-xs text-slate-500">
        © 2026 DreamForge AI. Microsoft Hackathon Edition.
      </footer>

    </div>
  );
}
