import { Skull, HelpCircle, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface Boss {
  id: string;
  worldId: string;
  name: string;
  title: string;
  weakness: string;
  description: string;
}

interface BossCardProps {
  boss: Boss | null;
}

export function BossCard({ boss }: BossCardProps) {
  if (!boss) return null;

  // Static HP values for hackathon demo purposes
  const hp = 2500;
  const maxHp = 2500;

  return (
    <div className="relative overflow-hidden glass-panel border border-red-500/20 bg-slate-950/50 p-6 rounded-xl shadow-lg shadow-red-950/5">
      
      {/* Background Red Ambient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-red-500/10 pb-3">
        <div className="flex items-center gap-2">
          <Skull className="h-5 w-5 text-red-500 animate-bounce" />
          <div>
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">
              FINAL ENCOUNTER OBSTACLE
            </span>
            <h3 className="text-base font-bold font-display text-white mt-0.5">
              {boss.name}
            </h3>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-red-400 bg-red-950/50 border border-red-950/20 px-2.5 py-1 rounded">
          BOSS LEVEL
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed mb-4 italic">
        &ldquo;{boss.description}&rdquo;
      </p>

      {/* HP Bar */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-red-400 font-bold flex items-center gap-1">
            <Activity className="h-3.5 w-3.5" /> HP MONITOR
          </span>
          <span className="text-white font-bold">{hp} / {maxHp}</span>
        </div>
        <div className="h-3 w-full bg-red-950/40 rounded-full overflow-hidden border border-red-900/30 p-[1px]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full"
          />
        </div>
      </div>

      {/* Weakness */}
      <div className="bg-red-950/20 border border-red-900/10 rounded-lg p-3 flex items-start gap-2.5">
        <HelpCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
            CORE WEAKNESS
          </span>
          <span className="text-xs font-semibold text-slate-200 mt-0.5 block font-mono">
            {boss.weakness}
          </span>
        </div>
      </div>

    </div>
  );
}
