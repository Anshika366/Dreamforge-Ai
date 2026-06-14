import { Brain, Database, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface MemoryVaultProps {
  memories: string[] | null | any;
  characterName: string;
}

export function MemoryVault({ memories, characterName }: MemoryVaultProps) {
  let memoryList: string[] = [];

  if (memories) {
    if (typeof memories === "string") {
      try {
        memoryList = JSON.parse(memories);
      } catch (e) {
        memoryList = [memories];
      }
    } else if (Array.isArray(memories)) {
      memoryList = memories;
    }
  }

  return (
    <div className="glass-panel p-5 rounded-xl border border-white/5 bg-slate-950/50 shadow-md">
      
      {/* Vault Header */}
      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
        <Brain className="h-4 w-4 text-accent animate-pulse" />
        <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
          Memory Vault
        </h3>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-4">
        Below are the key document facts locked inside the memory cortex of **{characterName}**. These details will dictate their conversation responses.
      </p>

      {/* Memories Container */}
      {memoryList.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-white/10 rounded-lg text-slate-500 text-xs">
          No memory cores locked in.
        </div>
      ) : (
        <div className="space-y-2.5">
          {memoryList.map((mem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2.5 bg-slate-900/40 border border-white/5 hover:border-accent/20 px-3.5 py-2.5 rounded-lg transition-colors group"
            >
              <Database className="h-3.5 w-3.5 text-accent/70 mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="text-xs text-slate-200 font-mono tracking-tight leading-relaxed select-none">
                {mem}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Synaptic status */}
      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono mt-4 pt-3 border-t border-white/5">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>SYNAPSE CONNECTION: ENCRYPTED & ACTIVE</span>
      </div>

    </div>
  );
}
