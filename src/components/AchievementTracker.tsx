"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { getAudio } from "@/lib/audio";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ActiveToast {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function AchievementTracker() {
  const pathname = usePathname();
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  // Function to show a toast
  const showToast = (title: string, description: string, icon: string = "🏆") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, icon }]);
    
    // Play chime sound
    const audio = getAudio();
    if (audio && audio.playDoorUnlocked) {
      audio.playDoorUnlocked();
    }

    // Auto dismiss after 4.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Helper to check and unlock achievements
  const checkAndUnlock = (title: string, description: string, icon: string = "🏆") => {
    try {
      const savedAch = localStorage.getItem("dreamforge_achievements_global") || "[]";
      const parsedAch = JSON.parse(savedAch);
      
      if (!parsedAch.includes(title)) {
        parsedAch.push(title);
        localStorage.setItem("dreamforge_achievements_global", JSON.stringify(parsedAch));
        showToast(title, description, icon);
      }
    } catch (e) {
      localStorage.setItem("dreamforge_achievements_global", JSON.stringify([title]));
      showToast(title, description, icon);
    }
  };

  // Monitor pathnames to trigger page-based achievements
  useEffect(() => {
    if (pathname === "/mcp") {
      checkAndUnlock(
        "MCP Explorer",
        "Discovered the Model Context Protocol simulation portal.",
        "🤖"
      );
    } else if (pathname === "/integrations") {
      checkAndUnlock(
        "First Integration Run",
        "Configured and verified SaaS metric endpoints.",
        "📊"
      );
    }
  }, [pathname]);

  // Listen for custom trigger events from other components
  useEffect(() => {
    const handleAchievementEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.title) {
        showToast(
          customEvent.detail.title,
          customEvent.detail.description || "Milestone reached!",
          customEvent.detail.icon || "🏆"
        );
      }
    };

    window.addEventListener("dreamforge_achievement", handleAchievementEvent);
    return () => {
      window.removeEventListener("dreamforge_achievement", handleAchievementEvent);
    };
  }, []);

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-3 max-w-xs pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="p-4 rounded-xl border border-accent/40 bg-slate-950/90 shadow-[0_0_20px_rgba(245,158,11,0.25)] backdrop-blur-md flex gap-3 pointer-events-auto max-w-[280px]"
          >
            <div className="text-xl flex items-center justify-center shrink-0">
              {toast.icon}
            </div>
            <div className="text-left">
              <span className="text-[9px] font-bold font-mono uppercase tracking-widest text-accent block animate-pulse">
                🏆 Achievement Unlocked
              </span>
              <h5 className="text-[11px] font-bold font-display text-white mt-0.5 leading-tight">
                {toast.title}
              </h5>
              <p className="text-[10px] text-slate-400 mt-1 font-mono leading-tight">
                {toast.description}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
