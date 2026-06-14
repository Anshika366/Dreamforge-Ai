"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Upload, 
  FileText, 
  FileCode, 
  Edit3, 
  Sparkles, 
  Trash2, 
  Terminal, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAudio } from "@/lib/audio";

function UploadPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetType = searchParams.get("type") || "general";
  const { generateWorld, loading, generating, error: storeError } = useWorldStore();
  const isGeneratingOrLoading = loading || generating;
  
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [pastedText, setPastedText] = useState("");

  // UI/UX Polish States
  const [forgedWorld, setForgedWorld] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [cinematicLogs, setCinematicLogs] = useState<string[]>([]);
  const [cinematicProgress, setCinematicProgress] = useState(0);

  // Get presets based on type
  const getPresetDescription = () => {
    switch (presetType) {
      case "story":
        return "Creating Story: Transform reports, emails, or journals into epic chronicles.";
      case "rpg":
        return "Creating RPG: Translate API schemas, config files, or manuals into rulebooks.";
      case "comic":
        return "Creating Comic: Translate product design sheets or scripts into visual grids.";
      case "escape-room":
        return "Creating Escape Room: Turn server logs, bug lists, or structures into puzzles.";
      case "character":
        return "Creating Character AI: Forge team lists or biographies into fantasy NPCs.";
      default:
        return "Forge custom lore, characters, quests, and battles from your files.";
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = [".pdf", ".docx", ".txt", ".md"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    
    if (validExtensions.includes(fileExtension)) {
      setSelectedFile(file);
      setErrorMsg(null);
    } else {
      setErrorMsg(`Invalid file type. Please upload a PDF, DOCX, TXT, or MD file.`);
      setSelectedFile(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const readUploadedFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      // For binary files (PDF/DOCX), we simulate text extraction
      const isBinary = file.name.endsWith(".pdf") || file.name.endsWith(".docx");
      
      if (isBinary) {
        // Build representative meta-text that the mock AI can consume
        let textResult = `[Binary File Extraction: ${file.name}]\n`;
        textResult += `Type: ${file.type}\n`;
        textResult += `Size: ${file.size} bytes\n`;
        
        // Custom generation keywords based onpreset type or filename
        const fn = file.name.toLowerCase();
        if (fn.includes("code") || fn.includes("bug") || fn.includes("spec") || fn.includes("dev") || fn.includes("api")) {
          textResult += `Content Summary: software architecture, git repository, microservice connection, memory bottleneck debugging pipelines. Lead developer Jonas handles compiling, operations lead Sarah handles queues, security Alex handles firewalls.`;
        } else if (fn.includes("sale") || fn.includes("quarter") || fn.includes("finance") || fn.includes("marketing") || fn.includes("ads")) {
          textResult += `Content Summary: quarterly marketing campaigns, brand values, customer feedback metrics. Marketing Lyra leads viral outreach, UX designer Kaelen builds layouts, copywriter Thomas drafts stories.`;
        } else {
          textResult += `Content Summary: general operations procedures, administrative protocols, project timelines, supply chain logistics. High Chancellor Reginald handles tasks, HR Elena handles complaints, logistics coordinator Hadrin handles supplies.`;
        }
        resolve(textResult);
      } else {
        reader.onload = (e) => {
          resolve(e.target?.result as string || "");
        };
        reader.onerror = () => {
          reject(new Error("Failed to read text file."));
        };
        reader.readAsText(file);
      }
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    let textToProcess = "";

    try {
      if (activeTab === "file") {
        if (!selectedFile) {
          setErrorMsg("Please select or drop a file to upload.");
          return;
        }
        textToProcess = await readUploadedFile(selectedFile);
      } else {
        if (!pastedText.trim()) {
          setErrorMsg("Please paste or type some text to generate.");
          return;
        }
        textToProcess = pastedText;
      }

      // Start simulating cinematic logs
      setCinematicLogs([]);
      setCinematicProgress(0);
      
      const logTemplates = [
        "🤖 [HANDSHAKE] Establishing connection to Model Context Protocol...",
        "⚡ [PARSING] Scanning input document structure & semantics...",
        "👥 [MAPPING] Transmuting team members and variables to NPC characters...",
        "⚔️ [MAPPING] Translating server bottlenecks and issues to RPG quests...",
        "🗺️ [MAPPING] Forging region nodes & coordinates from architecture map...",
        "📖 [STORY] Writing narrative chronicles Chapters 1, 2, and 3...",
        "🎨 [COMIC] Drawing storyboard panels matching visual themes...",
        "🧩 [SECURITY] Instantiating logical escape puzzles and code gates...",
        "💾 [DATABASE] Syncing indexes with Supabase PostgreSQL sandbox..."
      ];

      let currentLogIdx = 0;
      const logInterval = setInterval(() => {
        if (currentLogIdx < logTemplates.length) {
          setCinematicLogs(prev => [...prev, logTemplates[currentLogIdx]]);
          setCinematicProgress(Math.floor(((currentLogIdx + 1) / logTemplates.length) * 100));
          currentLogIdx++;
        } else {
          clearInterval(logInterval);
        }
      }, 400);

      const generatedWorld = await generateWorld(textToProcess);
      
      clearInterval(logInterval);
      setCinematicProgress(100);
      
      if (generatedWorld) {
        setForgedWorld(generatedWorld);
        setShowCelebration(true);

        // Fire confetti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });

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
          window.dispatchEvent(new CustomEvent("dreamforge_achievement", { 
            detail: { title: "First World Forged", description: "You forged your first interactive realm!" } 
          }));
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong during generation.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl flex flex-col items-center">
      
      {/* Title */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs text-primary-light font-medium">
          <Sparkles className="h-3 w-3 text-accent animate-pulse" />
          <span>DreamForge AI Compiler</span>
        </div>
        <h1 className="text-4xl font-bold font-display text-white tracking-tight">
          Forge Your Documents Into Lore
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          {getPresetDescription()}
        </p>
      </div>

      <Card className="w-full border-white/5 bg-slate-950/40 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <CardContent className="p-6 md:p-8">
          
          <Tabs value={activeTab} onValueChange={(val) => {
            setActiveTab(val as any);
            setErrorMsg(null);
          }}>
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="file" className="gap-2">
                  <Upload className="h-4 w-4" />
                  File Upload
                </TabsTrigger>
                <TabsTrigger value="paste" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  Paste Text
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Error alerts */}
            <AnimatePresence>
              {(errorMsg || storeError) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex items-start gap-2.5"
                >
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Generation Failed:</span> {errorMsg || storeError}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={onSubmit} className="space-y-6">
              
              {/* Tab 1: File Upload */}
              <TabsContent value="file">
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`relative group border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                    dragActive 
                      ? "border-primary bg-primary/5" 
                      : selectedFile 
                      ? "border-emerald-500/50 bg-emerald-500/5" 
                      : "border-white/10 hover:border-primary/50 hover:bg-white/5"
                  }`}
                >
                  {!selectedFile && (
                    <input
                      type="file"
                      id="file-upload"
                      accept=".pdf,.docx,.txt,.md"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      disabled={isGeneratingOrLoading}
                    />
                  )}

                  {selectedFile ? (
                    <div className="space-y-4 flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        {selectedFile.name.endsWith(".md") || selectedFile.name.endsWith(".txt") ? (
                          <FileCode className="h-7 w-7" />
                        ) : (
                          <FileText className="h-7 w-7" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <div className="flex gap-3 relative z-10">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-950/20 border-red-500/20"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveFile();
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 mx-auto group-hover:text-primary-light transition-colors">
                        <Upload className="h-6 w-6 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">
                          Drag and drop your file here
                        </p>
                        <p className="text-xs text-slate-400">
                          Supports PDF, DOCX, TXT, or MD files (max 10MB)
                        </p>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="pointer-events-none">
                        Browse Files
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Tab 2: Paste Text */}
              <TabsContent value="paste">
                <div className="space-y-4">
                  
                  {/* Preset Buttons */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      💡 Try Sample Worlds (One-Click Presets)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          title: "⚙️ Techoria spec",
                          subtitle: "Software Spec",
                          desc: "Memory leaks, auth bugs, Mage Jonas",
                          text: `[Software Spec Brief]\nSystem: Secure Authentication Gateways.\nLead Developer: Jonas\nOperations Lead: Sarah\nSecurity Auditor: Alex\nBottlenecks: Memory leak overflows, system crash error logs, firewall blocks authorization credentials.`
                        },
                        {
                          title: "📊 Aurum Ridge",
                          subtitle: "Revenue Sheet",
                          desc: "Expenses, churn, Sir Gareth, Balin",
                          text: `[Quarterly Revenue Review]\nProject: Aurum Ridge Treasury\nSales Bard: Sir Gareth\nChief Financial Officer: Balin\nSupport Lead: Freya\nConcerns: Customer churn rate increases, high expenses budget inflation, gold reserve depreciation.`
                        },
                        {
                          title: "🎨 Aetheria brief",
                          subtitle: "Marketing Brief",
                          desc: "Impressions drop, margins, Lyra",
                          text: `[Marketing Outreach Spec]\nRealm: Aetheria Creative Studio\nMarketing Lead: Lyra\nUI Designer: Kaelen\nScribe: Thomas\nIssues: Overlapping margins layout collision, click-through CTR drop-offs, user impressions decline.`
                        }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPastedText(preset.text);
                            const audio = getAudio();
                            audio.playTone ? audio.playTone([261, 329, 392], 'sine', 0.2, 0.25) : audio.playDoorUnlocked();
                          }}
                          className="text-left p-3 rounded-xl border border-white/5 bg-slate-900/40 hover:border-primary/45 hover:bg-slate-900/80 transition-all select-none group"
                        >
                          <strong className="text-xs text-white group-hover:text-primary-light block font-display tracking-tight transition-colors">
                            {preset.title}
                          </strong>
                          <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                            {preset.subtitle}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">
                            {preset.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="pastedText" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Document Text Content
                    </label>
                    <textarea
                      id="pastedText"
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      disabled={isGeneratingOrLoading}
                      placeholder="Paste your business requirements, project summaries, system error logs, or codebases here..."
                      className="w-full min-h-[180px] rounded-xl bg-slate-950 border border-white/10 p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors resize-none leading-relaxed"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Markdown formatting is supported</span>
                    <span>{pastedText.length} characters</span>
                  </div>
                </div>
              </TabsContent>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/5 flex justify-end">
                <Button 
                  type="submit" 
                  variant="glow" 
                  size="lg" 
                  className="w-full sm:w-auto min-w-[200px]"
                  isLoading={isGeneratingOrLoading}
                >
                  {isGeneratingOrLoading ? "Forging Reality..." : "Generate World"}
                  <Sparkles className="h-4 w-4 text-accent" />
                </Button>
              </div>

            </form>
          </Tabs>

        </CardContent>
      </Card>
      
      {/* Loading Overlay (Cinematic Terminal) */}
      <AnimatePresence>
        {isGeneratingOrLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-lg"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0%,transparent_65%)] pointer-events-none" />
            <div className="relative flex flex-col items-center space-y-6 max-w-md w-full px-6 text-center">
              
              {/* Spinner */}
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-t-accent animate-spin" />
                <div className="absolute inset-4 rounded-full border-2 border-secondary/20 animate-spin [animation-direction:reverse]" />
                <div className="absolute inset-6 bg-slate-950 rounded-full flex items-center justify-center border border-white/5">
                  <Terminal className="h-5 w-5 text-primary-light animate-pulse" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black font-display text-white uppercase tracking-wider">Forging Reality Matrix</h3>
                <span className="text-[10px] text-accent font-mono font-bold uppercase tracking-widest animate-pulse">
                  ⚡ Compilation in Progress ⚡
                </span>
              </div>

              {/* Progress Simulation */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>PROGRESS BUFFER</span>
                  <span>{cinematicProgress}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div 
                    style={{ width: `${cinematicProgress}%` }}
                    className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                  />
                </div>
              </div>

              {/* Terminal Logs View */}
              <div className="w-full bg-slate-950/90 border border-white/5 rounded-xl p-4 text-left font-mono text-[10px] leading-relaxed text-cyan-400 h-44 overflow-y-auto shadow-inner">
                {cinematicLogs.map((log, idx) => (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={idx} 
                    className="mb-1.5"
                  >
                    {log}
                  </motion.p>
                ))}
                <div className="h-2 w-2 bg-cyan-400 rounded-full animate-ping inline-block ml-1" />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Screen Modal */}
      <AnimatePresence>
        {showCelebration && forgedWorld && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0%,transparent_60%)] pointer-events-none" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full mx-4 glass-panel border border-glow p-8 rounded-3xl bg-slate-950/95 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center space-y-6 relative overflow-hidden"
            >
              
              <div className="absolute top-0 right-0 w-44 h-44 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-2 text-center">
                <span className="text-xs text-accent font-bold uppercase tracking-widest font-mono block animate-pulse">
                  ✨ REALM STABILITY REACHED ✨
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight uppercase leading-none">
                  World Forged!
                </h2>
                <div className="inline-block px-3 py-1 rounded bg-accent/10 border border-accent/20 text-xs font-mono font-bold text-accent uppercase tracking-wider mt-2">
                  {forgedWorld.title}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: "Legendary NPCs", count: "3 Created", icon: "🎭" },
                  { label: "Active Quests", count: "3 Generated", icon: "⚔️" },
                  { label: "Map Regions", count: "4 Mapped", icon: "🗺️" },
                  { label: "Story Chronicles", count: "3 Chapters", icon: "📖" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-900/60 border border-white/5 rounded-xl p-3 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{stat.icon}</span>
                      <div className="text-left">
                        <span className="text-[9px] text-slate-500 font-mono uppercase block">{stat.label}</span>
                        <strong className="text-white text-xs sm:text-sm font-display">{stat.count}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                Reality specifications compiled cleanly to fantasy variables. Database ledger sync status: 200 OK.
              </p>

              <div className="pt-2">
                <Button
                  onClick={() => {
                    setShowCelebration(false);
                    router.push(`/world/${forgedWorld.id}`);
                  }}
                  className="w-full bg-gradient-to-r from-accent to-secondary hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] text-white font-extrabold py-6 rounded-2xl text-xs uppercase tracking-wider gap-2 shadow-lg shadow-accent/20"
                >
                  Enter Playable Universe
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-slate-400 text-sm font-medium animate-pulse">Loading Forge Portal...</p>
      </div>
    }>
      <UploadPageContent />
    </Suspense>
  );
}
