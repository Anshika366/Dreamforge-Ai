"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Map, Scroll } from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { WorldMap } from "@/components/WorldMap";

export default function MapPage() {
  const { id } = useParams<{ id: string }>();
  const { 
    currentWorld, 
    currentRegions, 
    currentProgress,
    activeRegionId,
    explorerLogs,
    loading, 
    fetchWorldDetails,
    setActiveRegion,
    unlockRegion,
    addExplorerLog
  } = useWorldStore();

  useEffect(() => {
    if (id) {
      fetchWorldDetails(id);
    }
  }, [id, fetchWorldDetails]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Unfolding Map Grid...</p>
      </div>
    );
  }

  if (!currentWorld || !currentProgress) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <h2 className="text-2xl font-bold text-white font-display">Map Data Lost</h2>
        <Link href="/dashboard" className="text-primary hover:underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleUnlockRegion = (regId: string) => {
    unlockRegion(regId);
  };

  const handleAddLog = (log: string) => {
    addExplorerLog(log);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
      
      {/* Header Breadcrumbs */}
      <div className="mb-8 flex items-center justify-between">
        <Link 
          href={`/world/${id}`} 
          className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to World
        </Link>
        <span className="text-xs text-slate-500 font-mono">
          SECTOR: MAPS
        </span>
      </div>

      {/* Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-primary-light">
          <Map className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest font-mono">WORLD MAP REGIONS</span>
        </div>
        <h1 className="text-3xl font-bold text-white font-display mt-2">
          Chart {currentWorld.title}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Explore map coordinate nodes. Traverse unlocked regions to survey anomalies and discover new paths.
        </p>
      </div>

      {/* Two-Column Explorer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Map visualizer */}
        <div className="lg:col-span-2">
          <WorldMap
            regions={currentRegions}
            unlockedRegionIds={currentProgress.unlockedRegions}
            activeRegionId={activeRegionId}
            onSetActiveRegion={setActiveRegion}
            onUnlockRegion={handleUnlockRegion}
            onAddLog={handleAddLog}
          />
        </div>

        {/* Right: Explorer Logs feed */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-5 rounded-xl border border-white/5 bg-slate-950/40 shadow-lg flex flex-col h-[420px]">
            
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <Scroll className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                Explorer Logs
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {explorerLogs.map((log, index) => (
                <div 
                  key={index} 
                  className="text-xs leading-relaxed text-slate-400 border-l border-white/10 pl-3.5 py-1 font-mono"
                >
                  {log}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
