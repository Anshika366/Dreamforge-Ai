"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Terminal, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Activity,
  Play,
  Save,
  Music,
  Volume2,
  VolumeX
} from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAudio } from "@/lib/audio";

interface ToolRun {
  tool: string;
  status: "idle" | "running" | "success";
  durationMs: number;
  output: any;
}

interface HistoryItem {
  prompt: string;
  timeAgo: string;
  status: "Success" | "Failure";
}

export default function MCPConsolePage() {
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

  const [promptInput, setPromptInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusLog, setStatusLog] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([
    { prompt: "Generate RPG from spec v1.0", timeAgo: "10 mins ago", status: "Success" },
    { prompt: "Synthesize marketing wiki campaign", timeAgo: "1 hour ago", status: "Success" }
  ]);

  // Tool runs state
  const [toolRuns, setToolRuns] = useState<ToolRun[]>([
    { tool: "generate_world", status: "idle", durationMs: 0, output: null },
    { tool: "generate_character", status: "idle", durationMs: 0, output: null },
    { tool: "generate_story", status: "idle", durationMs: 0, output: null },
    { tool: "generate_comic", status: "idle", durationMs: 0, output: null },
    { tool: "generate_escape_room", status: "idle", durationMs: 0, output: null }
  ]);

  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [realityMappings, setRealityMappings] = useState<Array<{ reality: string; fantasy: string }>>([]);
  const [finalPayload, setFinalPayload] = useState<any>(null);

  // Auto-load ambient
  useEffect(() => {
    startAmbient();
    fetchWorlds();
  }, [startAmbient, fetchWorlds]);

  const addLog = (log: string) => {
    setStatusLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  const handleExecutePrompt = async () => {
    if (!promptInput.trim() || loading) return;
    
    setLoading(true);
    setStatusLog([]);
    setFinalPayload(null);
    setRealityMappings([]);
    setExpandedTool(null);
    
    // Set all tools to idle
    setToolRuns(prev => prev.map(t => ({ ...t, status: "idle", durationMs: 0, output: null })));

    addLog("Initializing Model Context Protocol (MCP) handshake...");
    
    // Simulate tools executing in sequence
    const executeSequence = async () => {
      // 1. generate_world
      setToolRuns(prev => prev.map(t => t.tool === "generate_world" ? { ...t, status: "running" } : t));
      addLog("Executing tool: generate_world...");
      await new Promise(r => setTimeout(r, 600));
      
      // 2. generate_character
      setToolRuns(prev => prev.map(t => 
        t.tool === "generate_world" ? { ...t, status: "success", durationMs: 450 } :
        t.tool === "generate_character" ? { ...t, status: "running" } : t
      ));
      addLog("Executing tool: generate_character...");
      await new Promise(r => setTimeout(r, 500));

      // 3. generate_story
      setToolRuns(prev => prev.map(t => 
        t.tool === "generate_character" ? { ...t, status: "success", durationMs: 320 } :
        t.tool === "generate_story" ? { ...t, status: "running" } : t
      ));
      addLog("Executing tool: generate_story...");
      await new Promise(r => setTimeout(r, 500));

      // 4. generate_comic
      setToolRuns(prev => prev.map(t => 
        t.tool === "generate_story" ? { ...t, status: "success", durationMs: 280 } :
        t.tool === "generate_comic" ? { ...t, status: "running" } : t
      ));
      addLog("Executing tool: generate_comic...");
      await new Promise(r => setTimeout(r, 600));

      // 5. generate_escape_room
      setToolRuns(prev => prev.map(t => 
        t.tool === "generate_comic" ? { ...t, status: "success", durationMs: 380 } :
        t.tool === "generate_escape_room" ? { ...t, status: "running" } : t
      ));
      addLog("Executing tool: generate_escape_room...");
      await new Promise(r => setTimeout(r, 500));

      setToolRuns(prev => prev.map(t => t.tool === "generate_escape_room" ? { ...t, status: "success", durationMs: 310 } : t));
    };

    // Parallel execution call
    try {
      const apiPromise = fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptInput })
      });

      await executeSequence();
      
      const res = await apiPromise;
      if (!res.ok) throw new Error("MCP prompt failed");
      const data = await res.json();

      addLog("All tools completed successfully. Merging outputs...");
      
      // Update output previews in the state
      setToolRuns(prev => prev.map(t => {
        const matchingRun = data.toolRuns.find((r: any) => r.tool === t.tool);
        return {
          ...t,
          output: matchingRun ? matchingRun.output : null
        };
      }));

      setRealityMappings(data.mappings);
      setFinalPayload(data.generatedWorld);

      // Add to execution history list
      setHistory(prev => [
        { prompt: promptInput, timeAgo: "Just now", status: "Success" },
        ...prev
      ]);

      // Play successful chime
      getAudio().playDoorUnlocked();

    } catch (e: any) {
      addLog(`Error: ${e.message}`);
      setHistory(prev => [
        { prompt: promptInput, timeAgo: "Just now", status: "Failure" },
        ...prev
      ]);
      getAudio().playBossEncounter();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToLedger = async () => {
    if (!finalPayload) return;
    try {
      // Create a new world using our standard generation pipeline endpoint
      const res = await fetch("/api/world/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: promptInput })
      });
      if (!res.ok) throw new Error("Failed to commit generated world");
      const data = await res.json();

      alert(`Commited successfully! Saved under postgres ID: ${data.world.id}`);
      router.push(`/world/${data.world.id}`);
    } catch(e) {
      alert("Failed to save world.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary selection:text-black">
      
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back Overview</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-accent" />
              <span className="font-display font-black tracking-tight text-lg uppercase">MCP Console</span>
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
              className={`p-1 rounded-full hover:bg-white/10 transition-colors ${ambientPlaying ? 'text-accent animate-pulse' : 'text-slate-400'}`}
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
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-12 max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Command & Tools Controls */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Title */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs text-accent font-bold uppercase tracking-widest bg-accent/10 border border-accent/10 px-3 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              Model Context Protocol (MCP) Interface
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight uppercase leading-none">
              Orchestrator Pipeline
            </h1>
            <p className="text-slate-400 text-sm">
              Trigger, execute, and monitor individual tool blocks inside the compiler model context. Enter requirements prompts to coordinate and preview generated outputs.
            </p>
          </div>

          {/* Prompt Entry Box */}
          <Card className="bg-slate-950/40 border-white/5">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="e.g. Generate RPG from requirements doc (auth bugs, revenue drops)..."
                  value={promptInput}
                  onChange={(e: any) => setPromptInput(e.target.value)}
                  className="bg-slate-900 border-white/10 text-white flex-1"
                  disabled={loading}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter') handleExecutePrompt();
                  }}
                />
                <Button
                  onClick={handleExecutePrompt}
                  disabled={loading || !promptInput.trim()}
                  className="bg-accent hover:bg-purple-600 disabled:opacity-50 text-white font-extrabold uppercase tracking-wider px-8 gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Run MCP</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Blinking Tool Status Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {toolRuns.map((run, idx) => (
              <Card key={idx} className={`border-white/5 bg-slate-950/30 overflow-hidden relative ${
                run.status === "running" ? "border-accent/40" : run.status === "success" ? "border-emerald-500/20" : ""
              }`}>
                {run.status === "running" && (
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-accent animate-pulse" />
                )}
                <CardContent className="p-4 flex flex-col items-center text-center justify-between min-h-[90px]">
                  <span className="text-[10px] text-slate-500 font-mono block uppercase">{run.tool}</span>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      run.status === "running"
                        ? "bg-accent animate-ping"
                        : run.status === "success"
                          ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                          : "bg-slate-800"
                    }`} />
                    <span className="text-xs font-bold font-mono">
                      {run.status === "running" ? "RUNNING" : run.status === "success" ? "SUCCESS" : "IDLE"}
                    </span>
                  </div>

                  {run.durationMs > 0 && (
                    <span className="text-[8px] text-slate-500 font-mono mt-2">{run.durationMs}ms</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interactive Logs Terminal Output */}
          <div className="bg-slate-950 border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="bg-slate-900 px-4 py-2 border-b border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/70" />
                <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <span className="ml-2">Console Output Logs</span>
              </span>
              <span>MCP Server (Port 8080)</span>
            </div>
            
            <div className="p-5 font-mono text-xs text-cyan-400 space-y-2 max-h-[200px] overflow-y-auto min-h-[140px] leading-relaxed">
              {statusLog.length === 0 ? (
                <p className="text-slate-600 italic">No instructions running. Handshake index: Idle.</p>
              ) : (
                statusLog.map((log, index) => (
                  <p key={index}>{log}</p>
                ))
              )}
            </div>
          </div>

          {/* Tool-by-Tool Previews */}
          {finalPayload && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-300">
                Tool-by-Tool Output preview
              </h3>
              
              <div className="space-y-3">
                {toolRuns.map((run) => {
                  const isExpanded = expandedTool === run.tool;
                  return (
                    <Card key={run.tool} className="border-white/5 bg-slate-950/20 overflow-hidden">
                      <button
                        onClick={() => setExpandedTool(isExpanded ? null : run.tool)}
                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                          <span className="text-xs font-mono font-bold uppercase">{run.tool}</span>
                        </div>
                        {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-white/5 bg-slate-950/40 p-5 text-xs text-slate-400 leading-relaxed font-mono"
                          >
                            <pre className="max-h-[180px] overflow-y-auto">{JSON.stringify(run.output, null, 2)}</pre>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Timeline, Mapping, JSON Inspector */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* History list */}
          <Card className="border-white/5 bg-slate-950/50 p-6">
            <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2 text-sm uppercase tracking-wider">
              <Clock className="h-4 w-4 text-slate-400" />
              Execution History
            </h3>
            <div className="space-y-4">
              {history.map((h, index) => (
                <div key={index} className="flex justify-between items-start text-xs border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className="space-y-1 pr-4">
                    <p className="text-slate-300 font-medium line-clamp-2">{h.prompt}</p>
                    <span className="text-[10px] text-slate-500 block">{h.timeAgo}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] uppercase ${
                    h.status === "Success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Reality -> Fantasy mapping cards */}
          {realityMappings.length > 0 && (
            <Card className="border-white/5 bg-slate-950/50 p-6">
              <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2 text-sm uppercase tracking-wider text-accent">
                <Activity className="h-4 w-4 text-accent" />
                Reality ➔ Fantasy Mapping
              </h3>
              
              <div className="space-y-3">
                {realityMappings.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs bg-slate-950/60 p-3 rounded-lg border border-white/5">
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase block">Reality</span>
                      <span className="font-mono text-slate-300">{m.reality}</span>
                    </div>
                    <ArrowLeft className="h-3.5 w-3.5 text-accent rotate-180" />
                    <div className="text-right">
                      <span className="text-[8px] text-slate-500 uppercase block">Fantasy</span>
                      <span className="text-accent font-semibold">{m.fantasy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Full payload JSON inspector */}
          {finalPayload && (
            <Card className="border-white/5 bg-slate-950/50 p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
                  Compiled Payload
                </h3>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(finalPayload, null, 2));
                      alert("Copied to clipboard!");
                    }}
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Copy Payload"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => {
                      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(finalPayload, null, 2))}`;
                      const downloadAnchor = document.createElement("a");
                      downloadAnchor.setAttribute("href", jsonString);
                      downloadAnchor.setAttribute("download", `mcp-world-payload.json`);
                      downloadAnchor.click();
                    }}
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Download JSON File"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* JSON tree viewport */}
              <div className="bg-slate-950 rounded-xl p-4 text-[10px] text-slate-400 font-mono leading-relaxed max-h-[220px] overflow-y-auto border border-white/5">
                <pre>{JSON.stringify(finalPayload, null, 2)}</pre>
              </div>

              {/* Commit changes */}
              <Button
                onClick={handleSaveToLedger}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold uppercase tracking-wider gap-2 py-6 text-xs rounded-xl"
              >
                <Save className="h-4 w-4" />
                Commit World to Database Ledger
              </Button>
            </Card>
          )}

        </div>

      </main>
    </div>
  );
}
