"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Swords, 
  Scroll, 
  MessageSquare, 
  Trophy, 
  Sparkles, 
  Backpack,
  Star,
  CheckCircle2,
  Tv,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorldStore } from "@/store/useWorldStore";
import { QuestLog } from "@/components/QuestLog";
import { WorldMap } from "@/components/WorldMap";
import { CharacterChat } from "@/components/CharacterChat";
import { InventoryBar, RPGInventoryItem } from "@/components/InventoryBar";
import { Button } from "@/components/ui/button";
import { getAudio } from "@/lib/audio";

interface PlayerProfile {
  level: number;
  xp: number;
  totalXp: number;
  title: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

interface RPGToast {
  id: string;
  type: "xp" | "level" | "achievement" | "loot" | "quest";
  title: string;
  description: string;
}

export default function PlayPage() {
  const { id } = useParams<{ id: string }>();
  const {
    worlds,
    currentWorld,
    currentQuests,
    currentCharacters,
    currentRegions,
    currentProgress,
    currentInventoryItems,
    playerInventory,
    chatHistory,
    activeRegionId,
    explorerLogs,
    loading,
    fetchWorldDetails,
    completeQuest,
    unlockRegion,
    discoverCharacter,
    addExplorerLog,
    setActiveRegion,
    sendChatMessage,
    clearChatHistory,
    addInventoryItem
  } = useWorldStore();

  const [activeChatCharId, setActiveChatCharId] = useState<string>("");

  // RPG Progression States
  const [profile, setProfile] = useState<PlayerProfile>({
    level: 1,
    xp: 0,
    totalXp: 0,
    title: "Novice Explorer"
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "ach-1", title: "First Steps", description: "Explore first region coordinate node", unlocked: false, icon: "🗺️" },
    { id: "ach-2", title: "Quest Seeker", description: "Complete first compiled quest", unlocked: false, icon: "⚔️" },
    { id: "ach-3", title: "Lore Keeper", description: "Reach 200 total Experience Points", unlocked: false, icon: "📖" },
    { id: "ach-4", title: "Realm Guardian", description: "Reach Level 5 in sandbox settings", unlocked: false, icon: "🌟" },
    { id: "ach-5", title: "World Forger", description: "Reach Level 10 of master configuration", unlocked: false, icon: "👑" },
    { id: "ach-6", title: "Realm Creator", description: "Forge at least one sandbox world", unlocked: false, icon: "🏗️" },
    { id: "ach-7", title: "Explorer Supreme", description: "Unlock all region nodes on map", unlocked: false, icon: "🎓" }
  ]);

  const [toasts, setToasts] = useState<RPGToast[]>([]);
  const [xpSources, setXpSources] = useState<Array<{ amount: number; reason: string; id: string }>>([]);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number; title: string; reward: string | null }>({
    oldLevel: 1,
    newLevel: 1,
    title: "Novice Explorer",
    reward: null
  });

  // Title Vignette State
  const [titleUpgrade, setTitleUpgrade] = useState<{ active: boolean; title: string; level: number } | null>(null);

  // Guided RPG Tour States
  const [tourStep, setTourStep] = useState<number | null>(null);
  
  // Demo Completion Screen State
  const [showDemoCompletion, setShowDemoCompletion] = useState(false);

  const tourSteps = [
    {
      title: `Welcome to ${currentWorld?.title || "Realm"}`,
      description: "Let's get you familiarized with your playable RPG universe in under 15 seconds.",
      targetId: null
    },
    {
      title: "⚔️ Your Quest Log",
      description: "This is your Quest Log. Click here to accept, view details, and resolve quests, which maps raw business bugs into completed fantasy adventures.",
      targetId: "rpg-quest-log"
    },
    {
      title: "🗺️ Interactive World Map",
      description: "This is your World Map. Explore region nodes to inspect coordinate mappings and unlock new areas as you resolve tasks.",
      targetId: "rpg-world-map"
    },
    {
      title: "🤖 NPC Portal Chat",
      description: "This is your NPC chat portal. Select a character and consult your team members translated into fantasy NPCs in real-time.",
      targetId: "rpg-npc-chat"
    },
    {
      title: "🎒 Collected Loot Inventory",
      description: "This is your Inventory. Unlocked artifacts and rare items from resolving issues appear here as tangible digital assets.",
      targetId: "rpg-inventory"
    }
  ];

  // Load world details
  useEffect(() => {
    if (id) {
      fetchWorldDetails(id);
    }
  }, [id, fetchWorldDetails]);

  // Load RPG states from LocalStorage on mount
  useEffect(() => {
    if (!id) return;
    const key = `dreamforge_rpg_progress_${id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.achievements) setAchievements(parsed.achievements);
        if (parsed.xpSources) setXpSources(parsed.xpSources);
      } catch (e) {
        console.error("Failed to parse RPG progress", e);
      }
    }

    // Initialize the tour if not completed before
    const tourCompleted = localStorage.getItem(`dreamforge_rpg_tour_completed_${id}`);
    if (!tourCompleted) {
      const timer = setTimeout(() => {
        setTourStep(0);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [id]);

  // Set initial chat character when loaded
  useEffect(() => {
    if (currentCharacters.length > 0 && !activeChatCharId) {
      setActiveChatCharId(currentCharacters[0].id);
    }
  }, [currentCharacters, activeChatCharId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Entering Simulation Domain...</p>
      </div>
    );
  }

  if (!currentWorld || !currentProgress) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <h2 className="text-2xl font-bold text-white font-display">Play Session Lost</h2>
        <Link href="/dashboard" className="text-primary hover:underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const activeChatChar = currentCharacters.find(c => c.id === activeChatCharId);
  const activeCharHistory = activeChatChar ? (chatHistory[activeChatChar.id] || []) : [];

  // Helper Title Mapping
  const getProfileTitle = (level: number) => {
    if (level >= 10) return "World Forger";
    if (level >= 5) return "Archmage";
    if (level >= 3) return "Realm Guardian";
    return "Novice Explorer";
  };

  // Helper XP Target Formula
  const getXpRequired = (level: number) => {
    return Math.floor(100 * Math.pow(level, 1.25));
  };

  // Toast Helper
  const addToast = (type: RPGToast["type"], title: string, description: string) => {
    const toastId = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id: toastId, type, title, description }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 4500);
  };

  // Save Progress State
  const saveRPGState = (newProfile: PlayerProfile, newAch: Achievement[], newSources: any[]) => {
    if (!id) return;
    const key = `dreamforge_rpg_progress_${id}`;
    localStorage.setItem(key, JSON.stringify({
      profile: newProfile,
      achievements: newAch,
      xpSources: newSources
    }));
  };

  // XP Gains handler
  const handleGainXp = (amount: number, reason: string) => {
    let currentXp = profile.xp + amount;
    let currentLevel = profile.level;
    let totalXp = profile.totalXp + amount;
    let leveledUp = false;
    let oldLevel = currentLevel;

    // Check level up loop
    while (currentXp >= getXpRequired(currentLevel)) {
      currentXp -= getXpRequired(currentLevel);
      currentLevel += 1;
      leveledUp = true;
    }

    const oldTitle = getProfileTitle(oldLevel);
    const newTitle = getProfileTitle(currentLevel);
    const updatedProfile: PlayerProfile = {
      level: currentLevel,
      xp: currentXp,
      totalXp,
      title: newTitle
    };

    setProfile(updatedProfile);

    // Save XP Source Log
    const sourceId = Math.random().toString(36).substring(2, 9);
    const updatedSources = [{ amount, reason, id: sourceId }, ...xpSources].slice(0, 8);
    setXpSources(updatedSources);

    // Trigger XP notification toast
    if (reason.includes("Quest Resolved") || reason.includes("Completed")) {
      addToast("quest", "⚔️ QUEST COMPLETED", `${reason} (+${amount} XP)`);
    } else {
      addToast("xp", `+${amount} XP`, reason);
    }

    // Check Achievements unlock conditions
    let achUpdated = false;
    const updatedAchievements = achievements.map(ach => {
      let shouldUnlock = ach.unlocked;

      if (ach.id === "ach-1" && !ach.unlocked && reason.includes("Explored")) {
        shouldUnlock = true;
      }
      if (ach.id === "ach-2" && !ach.unlocked && (reason.includes("Quest") || reason.includes("Resolved"))) {
        shouldUnlock = true;
      }
      if (ach.id === "ach-3" && !ach.unlocked && totalXp >= 200) {
        shouldUnlock = true;
      }
      if (ach.id === "ach-4" && !ach.unlocked && currentLevel >= 5) {
        shouldUnlock = true;
      }
      if (ach.id === "ach-5" && !ach.unlocked && currentLevel >= 10) {
        shouldUnlock = true;
      }
      if (ach.id === "ach-6" && !ach.unlocked && worlds.length > 0) {
        shouldUnlock = true;
      }
      if (ach.id === "ach-7" && !ach.unlocked && currentProgress.unlockedRegions.length >= currentRegions.length && currentRegions.length > 0) {
        shouldUnlock = true;
      }

      if (shouldUnlock && !ach.unlocked) {
        achUpdated = true;
        // Delayed toast for readability
        setTimeout(() => {
          addToast("achievement", ach.title, ach.description);
          getAudio().playDoorUnlocked();
        }, 500);
        return { ...ach, unlocked: true };
      }

      return ach;
    });

    if (achUpdated) {
      setAchievements(updatedAchievements);
    }

    saveRPGState(updatedProfile, updatedAchievements, updatedSources);

    // Handle Level Up modal overlay and rewards
    if (leveledUp) {
      let reward: string | null = null;
      if (currentLevel === 2) reward = "Ring of Silent Commits";
      else if (currentLevel === 3) reward = "Staff of Garbage Collection";
      else if (currentLevel === 5) reward = "Golden KPI Ledger";

      // If we unlocked loot, sync with Zustand store database progress
      if (reward) {
        addInventoryItem(reward);
        setTimeout(() => {
          addToast("loot", "🎒 Rare Reward Unlocked", reward || "");
        }, 800);
      }

      setLevelUpData({
        oldLevel,
        newLevel: currentLevel,
        title: newTitle,
        reward
      });

      // Check for Title Upgrade (Vignette)
      if (oldTitle !== newTitle) {
        setTitleUpgrade({
          title: newTitle,
          level: currentLevel,
          active: true
        });
        getAudio().playWorldGenerated();
        
        // Auto-dismiss title reveal vignette after 3 seconds
        setTimeout(() => {
          setTitleUpgrade(null);
          setShowLevelUpModal(true); // Open normal level details modal after
        }, 3200);
      } else {
        setShowLevelUpModal(true);
        getAudio().playQuestCompleted();
      }
    }
  };

  const handleResolveQuest = (questId: string, rewardName: string) => {
    completeQuest(questId, rewardName);
    handleGainXp(120, "Quest Completed");

    // Trigger local storage and event for First Quest Accepted achievement
    try {
      const savedAch = localStorage.getItem("dreamforge_achievements_global") || "[]";
      const parsedAch = JSON.parse(savedAch);
      if (!parsedAch.includes("First Quest Accepted")) {
        parsedAch.push("First Quest Accepted");
        localStorage.setItem("dreamforge_achievements_global", JSON.stringify(parsedAch));
        window.dispatchEvent(new CustomEvent("dreamforge_achievement", { 
          detail: { title: "First Quest Accepted", description: "You resolved your first translation quest!" } 
        }));
      }
    } catch (e) {
      localStorage.setItem("dreamforge_achievements_global", JSON.stringify(["First Quest Accepted"]));
    }

    // Check if this is a demo world, and if so, trigger Demo Completion Screen
    const isDemo = localStorage.getItem("dreamforge_demo_world_id") === id;
    if (isDemo) {
      setTimeout(() => {
        setShowDemoCompletion(true);
        getAudio().playWorldGenerated();
      }, 1200);
    }
  };

  const handleUnlockRegion = (regId: string) => {
    unlockRegion(regId);
    handleGainXp(50, "Region Unlocked");
  };

  const handleAddLog = (log: string) => {
    addExplorerLog(log);
  };

  const handleSendMessage = async (text: string) => {
    if (activeChatCharId) {
      await sendChatMessage(activeChatCharId, text);
      handleGainXp(10, `Consulted ${activeChatChar?.fantasyName || "NPC"}`);

      // Trigger local storage and event for First NPC Consultation achievement
      try {
        const savedAch = localStorage.getItem("dreamforge_achievements_global") || "[]";
        const parsedAch = JSON.parse(savedAch);
        if (!parsedAch.includes("First NPC Consultation")) {
          parsedAch.push("First NPC Consultation");
          localStorage.setItem("dreamforge_achievements_global", JSON.stringify(parsedAch));
          window.dispatchEvent(new CustomEvent("dreamforge_achievement", { 
            detail: { title: "First NPC Consultation", description: "Consulted your first transformed team member!" } 
          }));
        }
      } catch (e) {
        localStorage.setItem("dreamforge_achievements_global", JSON.stringify(["First NPC Consultation"]));
      }
    }
  };

  const handleClearHistory = () => {
    if (activeChatCharId) {
      clearChatHistory(activeChatCharId);
    }
  };

  // Structured Inventory mapping lookup
  const mappedInventoryItems: RPGInventoryItem[] = playerInventory.map((name, idx) => {
    const dbItem = currentInventoryItems.find(i => i.name.toLowerCase() === name.toLowerCase());
    return {
      id: dbItem?.id || `rpg-loot-${idx}`,
      name: name,
      rarity: (dbItem?.rarity as any) || "Rare",
      description: dbItem?.description || "A magical artifact generated from enterprise constraints.",
      source: "Level Up Milestone"
    };
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      
      {/* 3D scrolling grid and organic drifting background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="animate-grid" style={{ opacity: 0.3 }} />
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl animate-drift-slow" />
        <div className="absolute bottom-[15%] right-[5%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-3xl animate-drift-slower" />
      </div>

      <div className="container mx-auto px-3 py-6 sm:px-6 lg:px-8 max-w-7xl relative">
      
      {/* Dynamic Title Upgrade Vignette Overlay (Priority 4) */}
      <AnimatePresence>
        {titleUpgrade && titleUpgrade.active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-lg select-none"
          >
            {/* Dark outer vignette glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#030014_95%)]" />
            
            {/* Sparkling particles and scale-in content */}
            <motion.div
              initial={{ scale: 0.8, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -10, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center space-y-6 relative max-w-lg px-6"
            >
              <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(245,158,11,0.25)] animate-pulse">
                <Sparkles className="h-10 w-10 text-accent" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-accent font-bold uppercase tracking-widest font-mono block animate-pulse">
                  ⚔️ Realm Title Unlocked ⚔️
                </span>
                <h1 className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight uppercase glow-text">
                  {titleUpgrade.title}
                </h1>
                <p className="text-slate-400 text-sm font-mono tracking-widest uppercase mt-3">
                  System Compiled to Level {titleUpgrade.level}
                </p>
              </div>

              {/* Particle glow ring */}
              <div className="w-56 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto opacity-70" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Stack Toasts (Top Right) */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-3 max-w-xs pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`p-4 rounded-xl border shadow-2xl backdrop-blur flex gap-3 pointer-events-auto max-w-[280px] bg-slate-950/90 border-white/5 ${
                toast.type === "xp"
                  ? "border-primary-light/25 text-white"
                  : toast.type === "level"
                  ? "border-accent/40 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : toast.type === "loot"
                  ? "border-emerald-500/35 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : toast.type === "quest"
                  ? "border-accent/40 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                  : "border-accent/35 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              }`}
            >
              <div className="text-xl flex items-center justify-center shrink-0">
                {toast.type === "xp" && "✨"}
                {toast.type === "level" && "🌟"}
                {toast.type === "loot" && "🎒"}
                {toast.type === "achievement" && "🏆"}
                {toast.type === "quest" && "⚔️"}
              </div>
              <div className="text-left">
                <span className="text-[9px] font-bold font-mono uppercase tracking-widest block opacity-70">
                  {toast.type === "xp" && "Buffer Earned"}
                  {toast.type === "level" && "Level Up!"}
                  {toast.type === "loot" && "Rare Reward"}
                  {toast.type === "achievement" && "Achievement Unlocked"}
                  {toast.type === "quest" && "Quest Complete"}
                </span>
                <h5 className="text-[11px] font-bold font-display text-white mt-0.5 leading-tight">{toast.title}</h5>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono leading-tight">{toast.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fullscreen Level Up Modal overlay */}
      <AnimatePresence>
        {showLevelUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full mx-4 glass-panel border border-glow p-8 rounded-3xl bg-slate-950/90 shadow-[0_0_40px_rgba(139,92,246,0.3)] text-center space-y-6 relative overflow-hidden"
            >
              {/* Pulsing particle background effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_60%)] pointer-events-none" />

              <div className="space-y-2 relative text-center">
                <span className="text-xs text-accent font-bold uppercase tracking-widest font-mono block animate-pulse">
                  ✨ LEVEL UP UNLOCKED ✨
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight uppercase">
                  Level {levelUpData.newLevel} Reached
                </h2>
                <div className="inline-block px-3 py-1 rounded bg-primary/10 border border-primary/20 text-xs font-mono font-bold text-primary-light uppercase tracking-wider mt-2">
                  {levelUpData.title}
                </div>
              </div>

              {/* Reward card block */}
              {levelUpData.reward && (
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 text-left relative overflow-hidden">
                  <span className="absolute top-2 right-3 text-[8px] text-slate-500 uppercase tracking-widest font-mono font-bold">Loot Drop</span>
                  <div className="flex gap-3.5 items-center">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Backpack className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-mono">Rare Inventory Reward</span>
                      <strong className="text-emerald-300 font-mono text-sm">{levelUpData.reward}</strong>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                Your sandbox developer credentials have compiled new level capabilities! Check your active stats and ledger.
              </p>

              <Button
                onClick={() => setShowLevelUpModal(false)}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] text-white font-extrabold py-5 rounded-2xl text-xs uppercase tracking-wider"
              >
                Close Congratulatory Obelisk
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Breadcrumbs */}
      <div className="mb-4 flex items-center justify-between">
        <Link 
          href={`/world/${id}`} 
          className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to World Details
        </Link>
        <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5 animate-pulse">
          <Swords className="h-3.5 w-3.5 text-red-500" />
          RPG SIMULATION ACTIVE
        </span>
      </div>

      {/* Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Play: {currentWorld.title}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Resolve quests, traverse interactive map coordinate nodes, and consult NPCs to unlock paths.
          </p>
        </div>
      </div>

      {/* Top RPG HUD Banner (Priority 3 UI) */}
      <div className="mb-6 glass-panel p-6 rounded-2xl border border-white/5 bg-slate-950/60 relative overflow-hidden shadow-[0_0_25px_rgba(139,92,246,0.15)] border-glow flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left: Level Ring and Title */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-primary-light flex flex-col items-center justify-center shadow-[0_0_15px_rgba(167,139,250,0.3)] relative shrink-0">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none">LVL</span>
            <span className="text-2xl font-bold font-display text-white mt-0.5 leading-none">{profile.level}</span>
          </div>
          <div className="text-left">
            <h4 className="text-base font-bold font-display text-primary-light uppercase tracking-widest leading-none">{profile.title}</h4>
            <div className="flex gap-4 text-[10px] text-slate-500 font-mono mt-2.5">
              <span>Total XP: {profile.totalXp}</span>
              <span>•</span>
              <span>Achievements: {achievements.filter(a => a.unlocked).length}</span>
            </div>
          </div>
        </div>

        {/* Center: XP Progress Bar */}
        <div className="flex-1 w-full max-w-lg space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>EXPERIENCE POINT BUFFER</span>
            <span>{profile.xp} / {getXpRequired(profile.level)} XP</span>
          </div>
          <div className="h-3 w-full bg-slate-900 rounded-full border border-white/5 overflow-hidden p-[1px]">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${(profile.xp / getXpRequired(profile.level)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

      </div>

      {/* Responsive RPG Core Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-6">
        
        {/* Left Column: Quest Log & Achievements (lg:col-span-3) */}
        <div id="rpg-quest-log" className={`lg:col-span-3 space-y-4 transition-all duration-300 ${tourStep === 1 ? "relative z-40 ring-4 ring-primary bg-slate-950 p-3 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.6)]" : ""}`}>
          <QuestLog
            quests={currentQuests}
            completedQuestIds={currentProgress.completedQuests}
            onResolveQuest={handleResolveQuest}
          />

          {/* XP Sources Ledger */}
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-slate-950/40 space-y-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Scroll className="h-3.5 w-3.5 text-primary-light" />
              <span className="text-[10px] font-bold text-slate-300 font-mono uppercase tracking-wider">Recent Progress Ledger</span>
            </div>
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {xpSources.length === 0 ? (
                <p className="text-[10px] text-slate-500 italic font-mono text-left">No progress buffers recorded yet.</p>
              ) : (
                xpSources.map((s) => (
                  <div key={s.id} className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-slate-400 line-clamp-1 text-left">+{s.amount} {s.reason}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Achievements Trophy Board */}
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5 text-accent animate-pulse" />
                <span className="text-[10px] font-bold text-slate-300 font-mono uppercase tracking-wider">Trophies Unlocked</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500">
                {achievements.filter(a => a.unlocked).length} / {achievements.length}
              </span>
            </div>
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {achievements.map((ach) => (
                <div 
                  key={ach.id} 
                  className={`flex gap-2.5 items-start p-2 rounded-lg border transition-colors ${
                    ach.unlocked 
                      ? "bg-accent/5 border-accent/20" 
                      : "bg-slate-900/10 border-white/5 opacity-60"
                  }`}
                >
                  <span className="text-xs shrink-0 mt-0.5">
                    {ach.unlocked ? "✓" : "□"}
                  </span>
                  <div className="text-left">
                    <span className={`text-[10px] font-bold font-mono block ${ach.unlocked ? 'text-accent' : 'text-slate-400'}`}>
                      {ach.title}
                    </span>
                    <span className="text-[9px] text-slate-500 leading-tight block mt-0.5">
                      {ach.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Map & Action Logs Feed (lg:col-span-5) */}
        <div id="rpg-world-map" className={`lg:col-span-5 space-y-4 transition-all duration-300 ${tourStep === 2 ? "relative z-40 ring-4 ring-primary bg-slate-950 p-3 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.6)]" : ""}`}>
          <WorldMap
            regions={currentRegions}
            unlockedRegionIds={currentProgress.unlockedRegions}
            activeRegionId={activeRegionId}
            onSetActiveRegion={setActiveRegion}
            onUnlockRegion={handleUnlockRegion}
            onAddLog={handleAddLog}
            onGainXp={handleGainXp}
          />

          {/* Action Log Box */}
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-slate-950/40 h-[190px] flex flex-col">
            <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
              <Scroll className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-bold text-slate-300 font-mono">ACTIVITY MONITOR FEED</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {explorerLogs.map((log, index) => (
                <div 
                  key={index} 
                  className="text-[10px] leading-relaxed text-slate-400 border-l border-white/10 pl-2.5 py-0.5 font-mono text-left"
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: NPC Chat selection & interface (lg:col-span-4) */}
        <div id="rpg-npc-chat" className={`lg:col-span-4 space-y-4 transition-all duration-300 ${tourStep === 3 ? "relative z-40 ring-4 ring-primary bg-slate-950 p-3 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.6)]" : ""}`}>
          
          {/* NPC selector box */}
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-slate-950/50 flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-secondary-light" /> SELECT ACTIVE NPC CONSULTANT
            </label>
            <select
              value={activeChatCharId}
              onChange={(e) => setActiveChatCharId(e.target.value)}
              className="bg-slate-950 border border-white/10 focus:border-primary/50 text-white rounded px-2.5 py-1.5 text-xs outline-none w-full"
            >
              {currentCharacters.map((char) => (
                <option key={char.id} value={char.id}>
                  {char.fantasyName} ({char.role})
                </option>
              ))}
            </select>
          </div>

          {/* Chat Messenger */}
          {activeChatChar ? (
            <CharacterChat
              characterId={activeChatChar.id}
              characterName={activeChatChar.fantasyName}
              characterRole={activeChatChar.role}
              history={activeCharHistory}
              onSendMessage={handleSendMessage}
              onClearHistory={handleClearHistory}
            />
          ) : (
            <div className="h-[250px] border border-dashed border-white/5 rounded-xl flex items-center justify-center text-xs text-slate-500 font-mono">
              NO ACTIVE CONSULTANT
            </div>
          )}

        </div>

      </div>

      {/* Bottom Inventory Bar Grid */}
      <div id="rpg-inventory" className={`mt-4 transition-all duration-300 ${tourStep === 4 ? "relative z-40 ring-4 ring-primary bg-slate-950 p-2 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.6)]" : ""}`}>
        <InventoryBar items={mappedInventoryItems} />
      </div>

      {/* Guided Tour Spotlight Overlay */}
      {tourStep !== null && (
        <>
          {/* Semi-transparent backdrop overlay */}
          <div className="fixed inset-0 bg-slate-950/80 z-30 transition-opacity duration-300 pointer-events-none" />
          
          {/* Floating dialogue guide box */}
          <div className="fixed inset-x-4 bottom-8 sm:bottom-auto sm:top-24 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="glass-panel border-glow p-6 rounded-2xl bg-slate-950/95 shadow-[0_0_40px_rgba(139,92,246,0.25)] space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                  💡 Sandbox Tutorial ({tourStep + 1} / {tourSteps.length})
                </span>
                <button
                  onClick={() => {
                    setTourStep(null);
                    if (id) localStorage.setItem(`dreamforge_rpg_tour_completed_${id}`, "true");
                  }}
                  className="text-[10px] text-slate-400 hover:text-white uppercase font-mono font-bold tracking-wider"
                >
                  Skip Tour
                </button>
              </div>

              <div className="space-y-1.5 text-left">
                <h4 className="text-xs font-bold font-display text-white uppercase tracking-wider">
                  {tourSteps[tourStep].title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {tourSteps[tourStep].description}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={tourStep === 0}
                  onClick={() => setTourStep(prev => prev !== null && prev > 0 ? prev - 1 : prev)}
                  className="text-xs uppercase tracking-wider font-mono border-white/10"
                >
                  Back
                </Button>
                
                <Button
                  variant="glow"
                  size="sm"
                  onClick={() => {
                    if (tourStep === tourSteps.length - 1) {
                      setTourStep(null);
                      if (id) localStorage.setItem(`dreamforge_rpg_tour_completed_${id}`, "true");
                    } else {
                      setTourStep(prev => prev !== null ? prev + 1 : null);
                    }
                  }}
                  className="text-xs uppercase tracking-wider font-mono px-5"
                >
                  {tourStep === tourSteps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}

      {/* Demo Completion Screen Overlay */}
      <AnimatePresence>
        {showDemoCompletion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_60%)] pointer-events-none" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full mx-4 glass-panel border border-emerald-500/20 p-8 rounded-3xl bg-slate-950/95 shadow-[0_0_50px_rgba(16,185,129,0.25)] text-center space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-2 text-center">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest font-mono block animate-pulse">
                  🏆 DEMO RUN COMPLETED 🏆
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight uppercase leading-none">
                  🎉 Journey Complete
                </h2>
                <p className="text-slate-400 text-xs mt-2 font-mono">
                  You've experienced the full Reality ➔ Fantasy pipeline.
                </p>
              </div>

              {/* Progress Checklist */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 text-left space-y-3.5">
                {[
                  { label: "PRD Spec Parsed", status: true },
                  { label: "NPC Characters Generated", status: true },
                  { label: "Interactive World Forged", status: true },
                  { label: "First Quest Completed", status: true }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-300 font-mono font-medium">{item.label}</span>
                    <span className="text-emerald-400 font-bold font-mono">✓ Done</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                Reality specifications compiled cleanly into interactive fantasy systems. Database schema states committed.
              </p>

              <div className="pt-2">
                <Button
                  onClick={() => {
                    setShowDemoCompletion(false);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:bg-emerald-600 text-black font-extrabold py-5 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/15"
                >
                  Explore Further
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}
