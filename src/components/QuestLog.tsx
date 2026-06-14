import { CheckCircle2, Circle, Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Quest } from "@/store/useWorldStore";

interface QuestLogProps {
  quests: Quest[];
  completedQuestIds: string[];
  onResolveQuest: (questId: string, rewardName: string) => void;
}

export function QuestLog({ quests, completedQuestIds, onResolveQuest }: QuestLogProps) {
  return (
    <div className="glass-panel p-5 rounded-xl border border-white/5 bg-slate-950/40 shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
            Quest Log
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          RESOLVED: {completedQuestIds.length} / {quests.length}
        </span>
      </div>

      {/* Quests List */}
      {quests.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-xs">
          No quests found in this world.
        </div>
      ) : (
        <div className="space-y-4">
          {quests.map((quest) => {
            const isCompleted = completedQuestIds.includes(quest.id);
            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  if (!isCompleted) {
                    onResolveQuest(quest.id, quest.reward);
                  }
                }}
                className={`p-4 rounded-lg border transition-all duration-300 select-none ${
                  isCompleted 
                    ? "bg-emerald-950/5 border-emerald-500/10 opacity-70 cursor-default" 
                    : "bg-slate-900/30 border-white/5 hover:border-primary/20 hover:bg-slate-900/50 cursor-pointer"
                }`}
              >
                <div className="flex gap-3">
                  
                  {/* Status Icon */}
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-600 mt-0.5 flex-shrink-0" />
                  )}

                  <div className="flex-1 space-y-1">
                    
                    {/* Title */}
                    <h4 className={`text-xs font-bold font-mono tracking-tight leading-tight ${
                      isCompleted ? "text-emerald-300/80 line-through" : "text-white"
                    }`}>
                      {quest.title}
                    </h4>

                    {/* Description */}
                    <p className={`text-[11px] leading-relaxed ${
                      isCompleted ? "text-slate-500" : "text-slate-400"
                    }`}>
                      {quest.description}
                    </p>

                    {/* Reward & Button block */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 mt-2 border-t border-white/5">
                      
                      {/* Reward Badge */}
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-accent bg-accent/5 border border-accent/10 px-2 py-0.5 rounded">
                        <Star className="h-2.5 w-2.5" />
                        REWARD: {quest.reward}
                      </span>
                      {/* Action Button */}
                      {!isCompleted && (
                        <Button
                          variant="glow"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onResolveQuest(quest.id, quest.reward);
                          }}
                          className="h-6 text-[10px] font-bold py-0 px-3 flex-shrink-0"
                        >
                          Complete Quest
                        </Button>
                      )}

                    </div>

                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
