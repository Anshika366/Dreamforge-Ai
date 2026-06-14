import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, Shield, HelpCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Character } from "@/store/useWorldStore";

interface CharacterCardProps {
  character: Character;
  worldId: string;
}

export function CharacterCard({ character, worldId }: CharacterCardProps) {
  // Extract initials for the avatar
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Unique avatar gradient colors based on role
  const getAvatarGradient = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes("rust") || r.includes("compile") || r.includes("wizard")) {
      return "from-amber-500 via-orange-600 to-red-600 shadow-orange-500/20";
    }
    if (r.includes("scrum") || r.includes("agile") || r.includes("timekeeper")) {
      return "from-blue-500 via-indigo-600 to-violet-600 shadow-blue-500/20";
    }
    if (r.includes("rogue") || r.includes("qa") || r.includes("hunter")) {
      return "from-emerald-500 via-teal-600 to-cyan-600 shadow-emerald-500/20";
    }
    return "from-purple-500 via-pink-600 to-rose-600 shadow-pink-500/20";
  };

  const nameForAvatar = character.fantasyName.split(" ").pop() || character.name;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link href={`/world/${worldId}/character/${character.id}`} className="block h-full">
        <Card className="h-full border border-white/5 bg-slate-950/40 hover:bg-slate-900/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-primary/30 shadow-lg shadow-black/20">
          
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center gap-4">
              
              {/* NPC Animated Avatar */}
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(character.role)} p-[1.5px] shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-sm font-bold font-mono text-white">
                  {getInitials(nameForAvatar)}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                  {character.name}
                </div>
                <CardTitle className="text-base text-white mt-0.5 group-hover:text-primary-light transition-colors">
                  {character.fantasyName}
                </CardTitle>
                <div className="text-xs font-medium text-slate-400 mt-0.5 flex items-center gap-1">
                  <Shield className="h-3 w-3 text-secondary-light" />
                  {character.role}
                </div>
              </div>

            </div>
          </CardHeader>

          <CardContent className="px-5 pb-5 flex-1 flex flex-col justify-between gap-4">
            
            {/* Personality Summary */}
            <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-white/10 pl-3">
              &ldquo;{character.personality}&rdquo;
            </p>

            {/* Link Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-3 mt-auto">
              <span className="flex items-center gap-1 group-hover:text-slate-300 transition-colors">
                <HelpCircle className="h-3.5 w-3.5" />
                NPC Details
              </span>
              <span className="text-primary-light font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                <MessageSquare className="h-3.5 w-3.5" />
                Speak
              </span>
            </div>

          </CardContent>

        </Card>
      </Link>
    </motion.div>
  );
}
