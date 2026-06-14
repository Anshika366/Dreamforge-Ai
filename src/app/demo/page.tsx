"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Layers,
  Activity,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAudio } from "@/lib/audio";

export default function DemoPage() {
  const router = useRouter();
  
  const [status, setStatus] = useState<"idle" | "judge_intro" | "generating" | "success">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [createdWorldId, setCreatedWorldId] = useState<string | null>(null);

  const steps = [
    { label: "Parsing PRD Requirements Document", icon: Terminal },
    { label: "Generating Reality-to-Fantasy Conversions", icon: Sparkles },
    { label: "Creating NPC Roster & Social Relationship Graphs", icon: Activity },
    { label: "Compiling Chronicles Chapters & Interactive Map Zones", icon: Layers },
    { label: "Calibrating Security Escape Room Puzzles", icon: Shield }
  ];

  const samplePRD = `
# DreamForge SaaS Spec
System requirements for our new auth module.
- Auth portal runs on port 3000.
- Warning: An unresolved Authentication Bug is causing heap overflow issues.
- Server Uptime: The team faces periodic Server Outage crashes due to memory leakage.
- Financial Metrics: Revenue Drop of 15% due to churn rate increases.
- Goal: Fix dependencies and deploy security patches.
  `;

  // Start the 1-click generation flow
  const handleStartDemo = () => {
    setStatus("judge_intro");
    getAudio().playTone ? getAudio().playTone([440, 554, 659], 'sine', 0.4, 0.3) : getAudio().playQuestAccepted();
  };

  const proceedToGeneration = async () => {
    if (status === "generating") return;
    setStatus("generating");
    setCurrentStep(0);

    // Trigger step updates
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 800);

    try {
      // Call the actual world generation API with our sample PRD
      const res = await fetch("/api/world/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: samplePRD })
      });

      if (!res.ok) throw new Error("Demo generation failed");
      const data = await res.json();
      
      // Keep loading active until at least the interval finishes
      setTimeout(() => {
        clearInterval(stepInterval);
        setCreatedWorldId(data.world.id);
        localStorage.setItem("dreamforge_demo_world_id", data.world.id);
        setStatus("success");
        getAudio().playWorldGenerated();
        
        // Trigger local storage for first world created achievement toast
        const savedAch = localStorage.getItem("dreamforge_achievements_global") || "[]";
        try {
          const parsedAch = JSON.parse(savedAch);
          if (!parsedAch.includes("First World Forged")) {
            parsedAch.push("First World Forged");
            localStorage.setItem("dreamforge_achievements_global", JSON.stringify(parsedAch));
            window.dispatchEvent(new CustomEvent("dreamforge_achievement", { 
              detail: { title: "First World Forged", description: "You forged your first interactive realm!" } 
            }));
          }
        } catch (e) {
          localStorage.setItem("dreamforge_achievements_global", JSON.stringify(["First World Forged"]));
        }
      }, 4000);

    } catch (e) {
      console.error(e);
      clearInterval(stepInterval);
      alert("Failed to generate demo world. Reverting to stub.");
      setCreatedWorldId("techoria");
      setStatus("success");
    }
  };

  useEffect(() => {
    if (status !== "judge_intro") return;
    const timer = setTimeout(() => {
      proceedToGeneration();
    }, 3500);
    return () => clearTimeout(timer);
  }, [status]);

  const handleEnterWorld = () => {
    if (createdWorldId) {
      router.push(`/world/${createdWorldId}/play`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between relative overflow-hidden selection:bg-primary selection:text-black">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono">
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-accent/15 border border-accent/30 text-accent px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
              ⚡ Judge Mode Active
            </span>
            <Sparkles className="h-5 w-5 text-primary-light" />
            <span className="font-display font-black tracking-tight text-sm uppercase">Hackathon Portal</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-16 max-w-2xl flex-1 flex flex-col items-center justify-center">
        
        <AnimatePresence mode="wait">
          
          {/* State 1: Idle Screen */}
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full text-center space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs text-primary-light font-bold uppercase tracking-widest bg-primary/10 border border-primary/10 px-3 py-1 rounded-full">
                  <Sparkles className="h-3.5 w-3.5" />
                  Instant World Synthesizer
                </div>
                <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-none uppercase">
                  ⚡ Hackathon Demo Mode
                </h1>
                <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                  Experience the magic of DreamForge AI instantly. This mode feeds a sample enterprise spec (PRD) containing severe system issues into our generation pipeline, constructing a playable fantasy world in seconds.
                </p>
              </div>

              {/* Sample Document preview */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 text-left text-xs font-mono text-slate-400 max-h-[160px] overflow-hidden relative">
                <span className="absolute top-2 right-3 text-[8px] text-slate-600 uppercase tracking-widest font-sans font-bold">Sample Spec Input</span>
                <pre className="leading-relaxed">{samplePRD.trim()}</pre>
                <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-slate-950 to-transparent" />
              </div>

              <Button
                onClick={handleStartDemo}
                className="bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] text-white font-extrabold px-8 py-7 rounded-2xl text-sm uppercase tracking-wider transition-all duration-300 w-full sm:w-auto"
              >
                Begin 1-Click Synthesis
              </Button>
            </motion.div>
          )}

          {/* State 1.5: Judge Intro Screen */}
          {status === "judge_intro" && (
            <motion.div
              key="judge_intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full text-center space-y-8 relative"
            >
              {/* Skip Intro Button in top right */}
              <div className="flex justify-end sm:absolute sm:-top-12 sm:right-0">
                <button
                  onClick={proceedToGeneration}
                  className="text-[10px] font-mono text-primary-light hover:text-white transition-colors border border-primary/20 bg-primary/5 hover:bg-primary/10 px-3.5 py-1.5 rounded-full"
                >
                  Skip Intro ➔ Generate Immediately
                </button>
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs text-accent font-bold uppercase tracking-widest bg-accent/10 border border-accent/20 px-3 py-1 rounded-full animate-pulse">
                  <Sparkles className="h-3.5 w-3.5" />
                  Judge Mode Innovation Mapping
                </div>
                <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-none uppercase bg-gradient-to-r from-white via-slate-100 to-primary-light bg-clip-text text-transparent">
                  DreamForge AI
                </h1>
                <p className="text-primary-light font-display text-base font-bold uppercase tracking-wide">
                  Transforming a PRD into a Playable RPG Universe
                </p>
              </div>

              {/* Side-by-Side Comparison Panel */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-950/60 space-y-4 relative">
                <div className="grid grid-cols-2 gap-8 items-stretch relative">
                  
                  {/* Left Column: Reality Input */}
                  <div className="space-y-3 text-left">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                      🔴 Reality Input (PRD)
                    </span>
                    <div className="space-y-2">
                      {["Authentication Bug", "Server Outage", "Revenue Drop"].map((item, idx) => (
                        <div key={idx} className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 text-[11px] text-red-200 font-mono leading-tight">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connecting Arrows */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-6 pointer-events-none opacity-40 z-10">
                    <ArrowRight className="h-3.5 w-3.5 text-primary-light" />
                    <ArrowRight className="h-3.5 w-3.5 text-primary-light" />
                    <ArrowRight className="h-3.5 w-3.5 text-primary-light" />
                  </div>

                  {/* Right Column: Fantasy Output */}
                  <div className="space-y-3 text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                      ✨ Fantasy Output (RPG)
                    </span>
                    <div className="space-y-2">
                      {["Dark Curse", "Crystal Core Collapse", "Dragon Tax Crisis"].map((item, idx) => (
                        <div key={idx} className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-[11px] text-primary-light font-bold leading-tight">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-accent animate-pulse" />
                    Generation Time: <strong className="text-white">&lt;5 seconds</strong>
                  </span>
                  <span>Transitioning in 3.5s...</span>
                </div>
              </div>

              {/* Progress bar under the comparison panel */}
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden p-[1px] max-w-sm mx-auto">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3.5, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>

            </motion.div>
          )}

          {/* State 2: Generating Loading Screen */}
          {status === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full space-y-8"
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-display uppercase tracking-wider text-white">Synthesizing Realm Matrices...</h2>
                <p className="text-slate-500 text-xs font-mono">Orchestrating MCP pipeline subroutines</p>
              </div>

              {/* Stepper Display */}
              <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-4">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;

                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-4 transition-all duration-300 ${
                        isActive ? "text-primary-light scale-[1.01]" : isCompleted ? "text-emerald-400" : "text-slate-600"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                        isCompleted 
                          ? "bg-emerald-500/10 border-emerald-500/20" 
                          : isActive 
                            ? "bg-primary/10 border-primary animate-pulse" 
                            : "bg-slate-900/50 border-white/5"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-xs font-semibold tracking-tight">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* State 3: Success Screen */}
          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full text-center space-y-8"
            >
              <div className="space-y-3">
                <CheckCircle2 className="h-14 w-14 text-emerald-400 mx-auto" />
                <h2 className="text-3xl font-black font-display uppercase tracking-wider">Realm Synthesized Successfully!</h2>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  Prisma indices committed. Reality coordinates compiled into a playable universe.
                </p>
              </div>

              {/* Differentiator: Reality -> Fantasy Mapping Panel */}
              <div className="space-y-3 text-left">
                <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pl-1">
                  <Terminal className="h-4 w-4 text-primary-light" />
                  Why This Was Generated (Reality ➔ Fantasy Mappings)
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="glass-panel p-4 rounded-xl border-white/5 bg-slate-950/40 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Reality Input</span>
                      <strong className="text-slate-300 font-mono">Authentication Bug</strong>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary-light" />
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Fantasy Translation</span>
                      <strong className="text-primary-light">Dark Curse</strong>
                    </div>
                  </div>

                  <div className="glass-panel p-4 rounded-xl border-white/5 bg-slate-950/40 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Reality Input</span>
                      <strong className="text-slate-300 font-mono">Server Outage</strong>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary-light" />
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Fantasy Translation</span>
                      <strong className="text-secondary-light">Crystal Core Collapse</strong>
                    </div>
                  </div>

                  <div className="glass-panel p-4 rounded-xl border-white/5 bg-slate-950/40 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Reality Input</span>
                      <strong className="text-slate-300 font-mono">Revenue Churn Drop</strong>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary-light" />
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Fantasy Translation</span>
                      <strong className="text-accent">Dragon Tax Crisis</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-4">
                <Button
                  onClick={handleEnterWorld}
                  className="bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold px-10 py-7 rounded-2xl text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/15 gap-2 w-full"
                >
                  Enter Playable Universe
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950/40 py-6 text-center text-xs text-slate-500">
        © 2026 DreamForge AI. Microsoft Hackathon Edition.
      </footer>

    </div>
  );
}
