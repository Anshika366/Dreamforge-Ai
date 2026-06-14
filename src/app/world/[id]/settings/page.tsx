"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Settings, 
  Trash2, 
  Edit3, 
  Download, 
  AlertTriangle,
  Music,
  Volume2,
  VolumeX,
  Sparkles
} from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAudio } from "@/lib/audio";

export default function SettingsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
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

  const [renameTitle, setRenameTitle] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    if (id) {
      fetchWorldDetails(id).then((data) => {
        if (data && data.world) {
          setRenameTitle(data.world.title);
        }
      });
    }
  }, [id, fetchWorldDetails]);

  // Start ambient on mount
  useEffect(() => {
    startAmbient();
  }, [startAmbient]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Entering Settings Vault...</p>
      </div>
    );
  }

  if (!currentWorld) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-center px-4">
        <Settings className="h-16 w-16 text-slate-600 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">Settings Lost</h2>
        <p className="text-slate-400 max-w-sm mt-2">
          This world details could not be found. Let&apos;s return to the dashboard.
        </p>
        <Link href="/dashboard" className="pt-4">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const handleRename = async () => {
    if (!renameTitle.trim() || renaming) return;
    setRenaming(true);
    try {
      const res = await fetch(`/api/world/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: renameTitle })
      });
      if (!res.ok) throw new Error("Failed to rename world");
      alert("Realm renamed successfully in the PostgreSQL index!");
      getAudio().playDoorUnlocked();
      fetchWorldDetails(id);
    } catch (e: any) {
      alert(e.message || "Failed to rename");
    } finally {
      setRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== currentWorld.title) {
      alert(`Please type "${currentWorld.title}" exactly to authorize deletion.`);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/world/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete world");
      alert("Realm completely dissolved back into document void.");
      getAudio().playBossEncounter();
      router.push("/dashboard");
    } catch (e: any) {
      alert(e.message || "Failed to delete");
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    try {
      // Trigger a GET request to obtain all details
      const res = await fetch(`/api/world/${id}`);
      if (!res.ok) throw new Error("Failed to fetch world details for export");
      const fullData = await res.json();

      // Convert to JSON and trigger client-side download
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(fullData, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `dreamforge-world-${currentWorld.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      // Play successful export SFX
      getAudio().playQuestCompleted();
    } catch (e: any) {
      alert(e.message || "Failed to export");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-black">
      
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center space-x-4">
            <Link href={`/world/${id}`} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back Overview</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-400" />
              <span className="font-display font-black tracking-tight text-lg uppercase">Realm Control Panel</span>
            </div>
          </div>

          {/* Audio controls widget */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-3 py-1.5">
            <button
              onClick={() => {
                if (ambientPlaying) {
                  stopAmbient();
                } else {
                  startAmbient();
                }
              }}
              className={`p-1 rounded-full hover:bg-white/10 transition-colors ${ambientPlaying ? 'text-purple-400 animate-pulse' : 'text-slate-400'}`}
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
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>
        </div>
      </header>

      {/* Main Panel */}
      <main className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
        
        {/* Intro */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-bold uppercase tracking-widest bg-purple-500/10 border border-purple-500/10 px-3 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5" />
            Realm Core Operations
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight uppercase">
            Manage <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{currentWorld.title}</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Control reality matrix bindings, perform database updates, download full system backups, or decommission the sector permanently.
          </p>
        </div>

        <div className="space-y-6">
          
          {/* Card 1: Rename Realm */}
          <Card className="bg-slate-950/40 border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="h-4.5 w-4.5 text-purple-400" />
                Rename Reality Matrix
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 leading-relaxed">
                Update the visual index title of this world. This modifies the name across NPC dialogs, map logs, and save indices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Enter new world title..."
                  value={renameTitle}
                  onChange={(e: any) => setRenameTitle(e.target.value)}
                  className="bg-slate-900 border-white/10 text-white"
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter') handleRename();
                  }}
                />
                <Button
                  onClick={handleRename}
                  disabled={renaming || !renameTitle.trim() || renameTitle === currentWorld.title}
                  className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold px-6"
                >
                  {renaming ? "Updating..." : "Update Title"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Export Realm */}
          <Card className="bg-slate-950/40 border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Download className="h-4.5 w-4.5 text-emerald-400" />
                Export World Backup
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 leading-relaxed">
                Compile the database records (world lore, chapters, NPC profiles, active inventory items, escape puzzles, and active progress) into a portable JSON package.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleExport}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold flex items-center gap-2 px-6"
              >
                <Download className="h-4 w-4" />
                Download JSON Package
              </Button>
            </CardContent>
          </Card>

          {/* Card 3: Decommission / Delete World */}
          <Card className="bg-rose-950/5 border-rose-500/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Trash2 className="h-4.5 w-4.5 text-rose-500" />
                Dissolve Reality Matrix (Delete)
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 leading-relaxed">
                <span className="text-rose-400 font-semibold">WARNING:</span> This action is final. It cascades through the PostgreSQL storage, deleting all characters, quests, maps, and inventory progress permanently.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-rose-950/20 border border-rose-500/10 rounded-xl p-4 flex gap-3 items-start">
                <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-400 leading-relaxed">
                  To proceed, type the exact name of the world <strong className="text-white font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 select-all">{currentWorld.title}</strong> in the confirmation input below.
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Type world name to confirm..."
                  value={deleteConfirm}
                  onChange={(e: any) => setDeleteConfirm(e.target.value)}
                  className="bg-slate-900 border-rose-500/10 text-white"
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter') handleDelete();
                  }}
                />
                <Button
                  onClick={handleDelete}
                  disabled={deleting || deleteConfirm !== currentWorld.title}
                  className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold px-6"
                >
                  {deleting ? "Decommissioning..." : "Dissolve World"}
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link href={`/world/${id}`} className="text-slate-500 hover:text-white transition-colors text-xs font-mono">
            ← Return to World Dashboard Overview
          </Link>
        </div>

      </main>
    </div>
  );
}
