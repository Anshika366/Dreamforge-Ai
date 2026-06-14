import { Backpack, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export interface RPGInventoryItem {
  id: string;
  name: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  description: string;
  source: string;
}

interface InventoryBarProps {
  items: RPGInventoryItem[];
}

export function InventoryBar({ items }: InventoryBarProps) {
  // Empty slots calculation (standard RPG grid of 6 slots)
  const totalSlots = 6;
  const filledSlots = items.length;
  const emptySlotsCount = Math.max(0, totalSlots - filledSlots);

  return (
    <div className="glass-panel p-5 rounded-xl border border-white/5 bg-slate-950/40 shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Backpack className="h-4 w-4 text-primary-light" />
          <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
            Player Inventory
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          SLOTS: {filledSlots} / {totalSlots}
        </span>
      </div>

      {/* Grid Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        
        {/* Filled Slots */}
        {items.map((item, idx) => {
          const rarityLower = item.rarity.toLowerCase();
          const bg = rarityLower === "epic" 
            ? "bg-purple-950/30 border-purple-500/30 text-purple-400 shadow-purple-500/5"
            : rarityLower === "rare"
            ? "bg-blue-950/30 border-blue-500/30 text-blue-400 shadow-blue-500/5"
            : rarityLower === "legendary"
            ? "bg-amber-950/30 border-amber-500/30 text-amber-400 shadow-amber-500/5"
            : "bg-slate-900/40 border-slate-700/30 text-slate-300 shadow-transparent";

          return (
            <motion.div
              key={item.id || idx}
              whileHover={{ scale: 1.03, y: -2 }}
              className={`relative flex flex-col justify-between border ${bg} p-3 rounded-lg min-h-[90px] shadow-md cursor-help group`}
            >
              <span className="text-[8px] font-bold tracking-widest uppercase mb-1 opacity-70">
                {item.rarity}
              </span>
              <div className="text-xs font-bold text-white font-mono leading-tight pr-1 line-clamp-2 text-left">
                {item.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                <Sparkles className="h-3 w-3 text-accent animate-pulse" /> Ready
              </div>
              
              {/* Tooltip description */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-slate-950 border border-white/10 rounded-lg p-2.5 shadow-2xl text-[10px] text-slate-300 leading-relaxed z-50 text-left">
                <div className="font-bold text-white mb-0.5">{item.name}</div>
                <div className="text-[8px] font-mono text-accent uppercase tracking-widest mb-1.5">{item.rarity}</div>
                <p className="leading-relaxed">{item.description}</p>
                <div className="text-[7px] text-slate-500 font-mono mt-1">Source: {item.source}</div>
              </div>
            </motion.div>
          );
        })}

        {/* Empty Slots */}
        {Array.from({ length: emptySlotsCount }).map((_, idx) => (
          <div
            key={idx}
            className="border border-dashed border-white/5 bg-slate-900/10 rounded-lg min-h-[90px] flex items-center justify-center text-[10px] text-slate-600 font-mono select-none"
          >
            EMPTY
          </div>
        ))}

      </div>

      {filledSlots === 0 && (
        <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-500 font-mono">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Complete quests in the region map to claim rewards and fill slots.</span>
        </div>
      )}

    </div>
  );
}
