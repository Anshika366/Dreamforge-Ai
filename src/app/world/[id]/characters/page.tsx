"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, User, Sparkles } from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { CharacterCard } from "@/components/CharacterCard";

export default function CharactersPage() {
  const { id } = useParams<{ id: string }>();
  const { currentWorld, currentCharacters, loading, fetchWorldDetails } = useWorldStore();

  useEffect(() => {
    if (id) {
      fetchWorldDetails(id);
    }
  }, [id, fetchWorldDetails]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Roster...</p>
      </div>
    );
  }

  if (!currentWorld) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <h2 className="text-2xl font-bold text-white font-display">World Not Found</h2>
        <Link href="/dashboard" className="text-primary hover:underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

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
          REALM: {currentWorld.title.toUpperCase()}
        </span>
      </div>

      {/* Main Title Section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-primary-light">
          <User className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest font-mono">NPC DIRECTORY</span>
        </div>
        <h1 className="text-3xl font-bold text-white font-display mt-2">
          Characters of {currentWorld.title}
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xl">
          Interact with key figures transformed from your business variables. Click on any card to engage in dialogue.
        </p>
      </div>

      {/* Characters Cards Grid */}
      {currentCharacters.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/5 rounded-xl bg-slate-900/10">
          <p className="text-slate-500 text-sm">No characters found in this realm.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCharacters.map((character) => (
            <CharacterCard 
              key={character.id} 
              character={character} 
              worldId={id} 
            />
          ))}
        </div>
      )}

    </div>
  );
}
