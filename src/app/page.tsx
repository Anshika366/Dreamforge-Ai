"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ChevronRight, 
  Play, 
  Terminal, 
  ShieldAlert, 
  BookOpen, 
  Compass, 
  User, 
  Map, 
  Scroll, 
  Swords,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [demoMode, setDemoMode] = useState<"doc" | "world">("doc");

  // Cycle through steps in the How It Works section automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: "Story Generator",
      description: "Convert dry business reports and metrics into epic fantasy chronicles and narratives.",
      icon: BookOpen,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "RPG Generator",
      description: "Generate stats, rulesets, and environments for tabletop campaigns based on project scopes.",
      icon: Swords,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Comic Generator",
      description: "Turn text descriptions into scripted comic panels with visual descriptions and dialogue.",
      icon: Scroll,
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Escape Room Generator",
      description: "Translate complex bugs or system designs into logical puzzles and escape adventures.",
      icon: ShieldAlert,
      color: "from-red-500 to-amber-600"
    },
    {
      title: "Character AI",
      description: "Translate your team members, partners, or client profiles into fantasy NPCs and heroes.",
      icon: User,
      color: "from-amber-500 to-yellow-600"
    },
    {
      title: "World Builder",
      description: "Map your organizational architecture onto kingdoms, guilds, castles, and dungeons.",
      icon: Map,
      color: "from-emerald-500 to-teal-600"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Drop Your Document",
      desc: "Upload PDFs, DOCX files, TXT briefs, or paste raw text. Project reports, API docs, codebases, or resumes work perfectly."
    },
    {
      number: "02",
      title: "Forge the Reality",
      desc: "Our AI engine analyzes the structure, key actors, bottlenecks, and milestones inside your business files."
    },
    {
      number: "03",
      title: "Play Your World",
      desc: "Export rich lore, side quests, custom bosses, NPC rosters, and interactive maps to play or share."
    }
  ];

  return (
    <div className="relative overflow-hidden flex flex-col items-center w-full min-h-screen">
      
      {/* 3D scrolling grid and organic drifting background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="animate-grid" />
        <div className="absolute top-[10%] left-[15%] w-[450px] h-[450px] bg-primary/10 rounded-full blur-3xl animate-drift-slow" />
        <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl animate-drift-slower" />
      </div>
      
      {/* 1. Hero Section */}
      <section className="relative w-full pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          
          {/* Animated Glow Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary-light font-medium mb-6 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
            <span>Next-Gen Document Transformation</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              DreamForge
            </span>{" "}
            <span className="bg-gradient-to-r from-primary-light via-secondary to-accent bg-clip-text text-transparent glow-text">
              AI
            </span>
          </motion.h1>

          {/* Subtitle & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto space-y-4 mb-10"
          >
            <p className="text-xl sm:text-2xl font-semibold text-slate-200">
              Transform Documents Into Adventures
            </p>
            <p className="text-base sm:text-lg text-slate-400">
              Upload anything. Play everything. Convert boring project specs, logs, and corporate reports into thriving interactive fantasy worlds.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md"
          >
            <Link href="/upload" className="w-full sm:w-auto">
              <Button variant="glow" size="lg" className="w-full sm:w-auto font-display">
                Create World
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#demo" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                <Play className="h-4 w-4 text-secondary-light fill-secondary-light" />
                Watch Demo
              </Button>
            </a>
          </motion.div>

          {/* Down Indicator */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-16 text-slate-500 cursor-pointer hidden md:block"
          >
            <a href="#features" className="flex flex-col items-center text-xs gap-1 hover:text-white transition-colors">
              Explore DreamForge
              <ChevronDown className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. Interactive Live Demo Preview */}
      <section id="demo" className="w-full py-16 bg-slate-950/40 border-y border-white/5 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              See the Forge in Action
            </h2>
            <p className="text-slate-400 mt-3">
              Witness a standard project specifications document transform into a rich fantasy realm instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Left Side: Input Document */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between bg-slate-900 border border-white/10 rounded-t-xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Terminal className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-mono text-slate-300">source_document.txt</span>
                </div>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">txt</span>
              </div>
              <div className="bg-slate-950 border border-t-0 border-white/10 rounded-b-xl p-5 flex-grow font-mono text-sm text-slate-300 leading-relaxed min-h-[300px]">
                <span className="text-slate-500 font-bold block mb-2">// Business Requirement Document</span>
                <p className="mb-4">
                  <strong className="text-slate-200">Project:</strong> Q3 API Integration Portal. <br />
                  <strong className="text-slate-200">Goal:</strong> Establish connection to legacy databases and eliminate memory bottlenecks.
                </p>
                <p className="mb-4">
                  <strong className="text-slate-200">Key Roles:</strong> <br />
                  - <strong className="text-slate-200">Jonas:</strong> Lead Dev, handles schema compiling. <br />
                  - <strong className="text-slate-200">Sarah:</strong> Operations Lead, optimizes process pipelines. <br />
                  - <strong className="text-slate-200">Alex:</strong> Security Auditor, reviews firewalls.
                </p>
                <p>
                  <strong className="text-slate-200">Risk Assessment:</strong> System failure will occur if memory leak overflows the servers. High security firewall blocks authorization credentials.
                </p>
              </div>
            </div>

            {/* Right Side: Fantasy output */}
            <div className="flex flex-col relative">
              <div className="flex items-center justify-between bg-slate-900 border border-white/10 rounded-t-xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-primary-light" />
                  <span className="text-xs font-display text-white font-semibold">DreamForge Engine Output</span>
                </div>
                <span className="text-xs bg-primary/20 text-primary-light px-2 py-0.5 rounded font-medium">World Generated</span>
              </div>
              <div className="bg-slate-950 border border-t-0 border-white/10 rounded-b-xl p-5 flex-grow font-sans text-sm text-slate-300 leading-relaxed min-h-[300px] flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-display text-transparent bg-gradient-to-r from-primary-light to-secondary bg-clip-text mb-2">
                    Realm of Techoria
                  </h3>
                  <p className="text-slate-400 text-xs italic mb-4">
                    &quot;A soaring sky-archipelago where coding syntax manifests as elemental magic. Compiling errors materialize as glitch-sprites...&quot;
                  </p>

                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <h4 className="text-xs font-bold text-accent font-display uppercase tracking-wider">Compiling Archmage Jonas</h4>
                      <p className="text-slate-300 text-xs mt-1">Wizard of Rust. Obsessively debugs his spellbook, casting strictly typed spells.</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <h4 className="text-xs font-bold text-primary-light font-display uppercase tracking-wider">Active Quest: The Great Memory Leak</h4>
                      <p className="text-slate-300 text-xs mt-1">Cleanse the floating stack overflow temple of the memory daemon before the server crashes.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Characters: 3 | Quests: 3</span>
                  <Link href="/upload">
                    <Button variant="primary" size="sm" className="glow-btn">
                      Try It Yourself
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="w-full py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white">
              Forge Anything You Imagine
            </h2>
            <p className="text-slate-400 mt-4 text-lg">
              DreamForge AI breaks down business variables and builds rich fantasy interfaces for diverse formats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col justify-between border-white/5 bg-slate-950/40 glow-card-hover">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} p-[1px] mb-4`}>
                        <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <CardTitle>{feat.title}</CardTitle>
                      <CardDescription className="text-slate-400 mt-2">
                        {feat.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-primary-light font-semibold flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                        Learn More <ChevronRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="w-full py-20 bg-slate-950/20 border-t border-white/5 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              How It Works
            </h2>
            <p className="text-slate-400 mt-3">
              A simple three-step process turns your documents into playable lore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`relative p-8 rounded-2xl transition-all duration-500 border glow-card-hover ${
                  activeStep === idx 
                    ? "bg-gradient-to-b from-primary/15 to-purple-950/20 border-primary/40 shadow-xl shadow-primary/10" 
                    : "bg-slate-950/20 border-white/5"
                }`}
              >
                <div className="font-display text-5xl font-black bg-gradient-to-b from-primary-light/40 to-transparent bg-clip-text text-transparent mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-display">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA / Demo Player Section */}
      <section className="w-full py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto p-12 rounded-3xl border border-primary/20 bg-gradient-to-r from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl sm:text-5xl font-bold font-display text-white">
                Ready to Forge Your World?
              </h2>
              <p className="text-slate-300 max-w-xl mx-auto text-base">
                Upload your business guidelines, design sheets, or logs, and let DreamForge AI write your legend today.
              </p>
              <div className="pt-4 flex justify-center">
                <Link href="/upload">
                  <Button variant="glow" size="lg" className="px-8 shadow-xl shadow-primary/20">
                    Get Started Free
                    <Sparkles className="h-4 w-4 text-accent" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
