import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Compass, Lock, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Region } from "@/store/useWorldStore";

interface WorldMapProps {
  regions: Region[];
  unlockedRegionIds: string[];
  activeRegionId: string | null;
  onSetActiveRegion: (regionId: string | null) => void;
  onUnlockRegion: (regionId: string) => void;
  onAddLog: (log: string) => void;
  onGainXp?: (amount: number, reason: string) => void;
}

export function WorldMap({
  regions,
  unlockedRegionIds,
  activeRegionId,
  onSetActiveRegion,
  onUnlockRegion,
  onAddLog,
  onGainXp
}: WorldMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const activeRegion = regions.find((r) => r.id === activeRegionId);

  // Traversal/Exploration logic
  const handleExplore = (region: Region) => {
    onAddLog(`🗺️ EXPLORATION: You ventured deep into the [${region.name}]...`);
    if (onGainXp) {
      onGainXp(25, `Explored ${region.name}`);
    }
    const randomVal = Math.random();
    if (randomVal < 0.4) {
      // Find a locked region and unlock it
      const locked = regions.filter((r) => !unlockedRegionIds.includes(r.id));
      if (locked.length > 0) {
        const nextToUnlock = locked[Math.floor(Math.random() * locked.length)];
        onUnlockRegion(nextToUnlock.id);
        onAddLog(`✨ DISCOVERY: You charted a safe path from [${region.name}] to [${nextToUnlock.name}]!`);
      } else {
        onAddLog(`🌲 OBSERVATION: You scouted the area and confirmed the borders are entirely secure.`);
      }
    } else if (randomVal < 0.7) {
      onAddLog(`⚔️ ENCOUNTER: You bypassed a pack of wild glitch-sprites hidden in the brush.`);
    } else {
      onAddLog(`🎒 FORAGE: You searched the ruins but found only standard compiler logs.`);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-white/5 bg-slate-950/40 shadow-lg flex flex-col justify-between h-full min-h-[420px]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-primary-light" />
          <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
            Interactive World Map
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          DISCOVERED: {unlockedRegionIds.length} / {regions.length}
        </span>
      </div>

      {/* Map Canvas / SVG Area */}
      <div className="relative w-full h-[220px] bg-slate-950/70 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 300">
          
          {/* Paths connecting nodes */}
          {regions.length > 1 && 
            regions.map((reg, idx) => {
              if (idx === regions.length - 1) return null;
              const nextReg = regions[idx + 1];
              const isPathUnlocked = unlockedRegionIds.includes(reg.id) && unlockedRegionIds.includes(nextReg.id);
              return (
                <line
                  key={`path-${idx}`}
                  x1={reg.x}
                  y1={reg.y}
                  x2={nextReg.x}
                  y2={nextReg.y}
                  stroke={isPathUnlocked ? "url(#path-glow)" : "rgba(255,255,255,0.04)"}
                  strokeWidth={isPathUnlocked ? "1.5" : "1"}
                  strokeDasharray={isPathUnlocked ? "0" : "4 4"}
                />
              );
            })
          }

          {/* Definitions for SVG gradients */}
          <defs>
            <linearGradient id="path-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Region Node Circles */}
          {regions.map((region) => {
            const isUnlocked = unlockedRegionIds.includes(region.id);
            const isActive = activeRegionId === region.id;

            return (
              <g 
                key={region.id} 
                className="cursor-pointer"
                onClick={() => isUnlocked && onSetActiveRegion(region.id)}
                onMouseEnter={() => setHoveredRegion(region.name)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                
                {/* Outer pulsing ring for active node */}
                {isActive && (
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r="14"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-ping"
                    style={{ transformOrigin: `${region.x}px ${region.y}px` }}
                  />
                )}

                {/* Node Base Circle */}
                <circle
                  cx={region.x}
                  cy={region.y}
                  r="8"
                  fill={isUnlocked ? (isActive ? "#3b82f6" : "#6366f1") : "#1e293b"}
                  stroke={isUnlocked ? "#ffffff" : "rgba(255,255,255,0.1)"}
                  strokeWidth="1.5"
                  className="transition-all duration-300 hover:r-10"
                />

                {/* Internal symbol/status dot */}
                {!isUnlocked && (
                  <circle cx={region.x} cy={region.y} r="2" fill="#ef4444" />
                )}

              </g>
            );
          })}
        </svg>

        {/* Floating Node Label */}
        {hoveredRegion && (
          <div className="absolute top-2 left-2 bg-slate-950/90 border border-white/10 rounded px-2.5 py-1 text-[9px] font-mono text-white tracking-wider uppercase select-none">
            {hoveredRegion}
          </div>
        )}

        {regions.length === 0 && (
          <div className="text-xs text-slate-500 font-mono">MAP DATA CORRUPTED</div>
        )}

      </div>

      {/* Selected Region Drawer */}
      <div className="mt-4 flex-1 flex flex-col justify-between gap-4">
        
        {activeRegion ? (
          <div className="bg-slate-900/30 border border-white/5 rounded-lg p-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-primary-light" />
                  {activeRegion.name}
                </h4>
                <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${
                  activeRegion.difficulty === "Easy"
                    ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
                    : activeRegion.difficulty === "Medium"
                    ? "bg-amber-950/40 border-amber-500/20 text-amber-400"
                    : "bg-red-950/40 border-red-500/20 text-red-400"
                }`}>
                  {activeRegion.difficulty.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
                {activeRegion.description}
              </p>
            </div>

            <div className="flex justify-end pt-3 mt-4 border-t border-white/5">
              <Button
                variant="glow"
                size="sm"
                onClick={() => handleExplore(activeRegion)}
                className="h-7 text-[10px] py-0 px-4 gap-1.5 font-bold"
              >
                <Eye className="h-3.5 w-3.5" />
                Explore Region
              </Button>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-white/5 rounded-lg p-6 text-center text-slate-500 flex flex-col items-center justify-center flex-1">
            <Lock className="h-7 w-7 text-slate-600 mb-2" />
            <span className="text-[10px] font-mono">SELECT AN UNLOCKED NODE TO NAVIGATE</span>
          </div>
        )}

      </div>

    </div>
  );
}
