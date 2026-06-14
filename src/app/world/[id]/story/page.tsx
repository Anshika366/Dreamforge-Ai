"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { StoryViewer } from "@/components/StoryViewer";

export default function StoryPage() {
  const { id } = useParams<{ id: string }>();
  const { currentWorld, loading, fetchWorldDetails } = useWorldStore();

  useEffect(() => {
    if (id) {
      fetchWorldDetails(id);
    }
  }, [id, fetchWorldDetails]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Unrolling Chronicles...</p>
      </div>
    );
  }

  if (!currentWorld) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <h2 className="text-2xl font-bold text-white font-display">Chronicles Missing</h2>
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
          SECTOR: CHRONICLES
        </span>
      </div>

      {/* Title */}
      <div className="mb-10 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 text-primary-light">
          <BookOpen className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest font-mono">STORY MODE</span>
        </div>
        <h1 className="text-3xl font-bold text-white font-display mt-2">
          Chronicles of {currentWorld.title}
        </h1>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
          Embark on a narrative journey. This interactive three-part novel charts the history, major trials, and final resolutions of this generated realm.
        </p>
      </div>

      {/* Story Viewer Component */}
      <div className="pb-16">
        <StoryViewer story={currentWorld.story} />
      </div>

    </div>
  );
}
