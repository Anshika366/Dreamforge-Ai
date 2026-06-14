"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MessageSquare, Terminal } from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { CharacterChat } from "@/components/CharacterChat";
import { MemoryVault } from "@/components/MemoryVault";

export default function CharacterChatPage() {
  const { id: worldId, characterId } = useParams<{ id: string; characterId: string }>();
  
  const { 
    currentWorld, 
    currentCharacters, 
    chatHistory, 
    loading, 
    fetchWorldDetails, 
    sendChatMessage, 
    clearChatHistory 
  } = useWorldStore();

  useEffect(() => {
    if (worldId) {
      fetchWorldDetails(worldId);
    }
  }, [worldId, fetchWorldDetails]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Opening Connection Channel...</p>
      </div>
    );
  }

  const character = currentCharacters.find((c) => c.id === characterId);

  if (!currentWorld || !character) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <h2 className="text-2xl font-bold text-white font-display">NPC Connection Failed</h2>
        <p className="text-slate-400 text-sm">Either the character has dissolved, or the world is missing.</p>
        <Link href={`/world/${worldId}`} className="text-primary hover:underline mt-2 inline-block">
          Return to World
        </Link>
      </div>
    );
  }

  const history = chatHistory[characterId] || [];

  const handleSendMessage = async (text: string) => {
    await sendChatMessage(characterId, text);
  };

  const handleClearHistory = () => {
    clearChatHistory(characterId);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
      
      {/* Breadcrumb Header */}
      <div className="mb-8 flex items-center justify-between">
        <Link 
          href={`/world/${worldId}/characters`} 
          className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Characters
        </Link>
        <span className="text-xs text-slate-500 font-mono">
          SECTOR: CONVERSATION
        </span>
      </div>

      {/* Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-secondary-light">
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest font-mono">COMMUNICATIONS PORTAL</span>
        </div>
        <h1 className="text-3xl font-bold text-white font-display mt-2">
          Consult {character.fantasyName}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Engage in real-time in-character consultation. The NPC uses context and memory logs to construct responses.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Memory Vault */}
        <div className="lg:col-span-1 space-y-6">
          <MemoryVault 
            memories={character.memory} 
            characterName={character.fantasyName} 
          />

          {/* Prompt Guidelines Card */}
          <div className="glass-panel p-5 rounded-xl border border-white/5 bg-slate-950/20 text-xs text-slate-400 leading-relaxed font-mono">
            <div className="flex items-center gap-2 text-slate-300 font-bold mb-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span>INTERFACE SPECS</span>
            </div>
            <ul className="space-y-1.5 list-disc pl-4">
              <li>Chat history is persisted in your local browser cache.</li>
              <li>NPC answers immediately based on underlying data templates.</li>
              <li>Reset logs at any time using the Clear button in the header.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Chat Console */}
        <div className="lg:col-span-2">
          <CharacterChat
            characterId={characterId}
            characterName={character.fantasyName}
            characterRole={character.role}
            history={history}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearHistory}
          />
        </div>

      </div>

    </div>
  );
}
