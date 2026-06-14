import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryChapter {
  chapter: number;
  title: string;
  content: string;
}

interface StoryViewerProps {
  story: StoryChapter[];
}

export function StoryViewer({ story }: StoryViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);

  if (!story || story.length === 0) {
    return (
      <div className="glass-panel p-8 text-center rounded-xl text-slate-400">
        <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-600" />
        <p>No story chapters generated for this world yet.</p>
      </div>
    );
  }

  const currentChapter = story[currentPage];

  const pageVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
      rotateY: direction > 0 ? 45 : -45,
    }),
    in: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: { duration: 0.5, ease: "easeOut" as any }
    },
    out: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
      rotateY: direction > 0 ? -45 : 45,
      transition: { duration: 0.4, ease: "easeIn" as any }
    })
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    const nextPage = page + newDirection;
    if (nextPage >= 0 && nextPage < story.length) {
      setPage([nextPage, newDirection]);
      setCurrentPage(nextPage);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      
      {/* Chapter Progress Tracker */}
      <div className="flex justify-between items-center mb-6 px-4">
        <span className="text-xs font-semibold tracking-wider text-primary uppercase flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Interactive Chronicles
        </span>
        <div className="flex gap-1.5">
          {story.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const dir = idx > currentPage ? 1 : -1;
                setPage([idx, dir]);
                setCurrentPage(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentPage ? "w-8 bg-gradient-to-r from-primary to-secondary" : "w-2 bg-white/10 hover:bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Book Container */}
      <div className="relative overflow-hidden glass-panel rounded-2xl border border-white/5 bg-slate-950/40 p-8 sm:p-12 min-h-[400px] flex flex-col justify-between shadow-2xl shadow-primary/5">
        
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            className="flex-1 flex flex-col justify-center text-center max-w-2xl mx-auto"
          >
            {/* Chapter Header */}
            <span className="text-xs font-bold text-accent tracking-widest uppercase mb-2">
              Chapter {currentChapter.chapter}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight mb-8">
              {currentChapter.title}
            </h2>

            {/* Story Content */}
            <p className="text-slate-300 text-lg leading-relaxed font-serif tracking-wide text-justify">
              {currentChapter.content}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Page navigation buttons */}
        <div className="flex justify-between items-center mt-12 border-t border-white/5 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(-1)}
            disabled={currentPage === 0}
            className="gap-1 border-white/5 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:hover:bg-white/5"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Chapter
          </Button>

          <span className="text-xs text-slate-500 font-mono">
            Page {currentPage + 1} of {story.length}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(1)}
            disabled={currentPage === story.length - 1}
            className="gap-1 border-white/5 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:hover:bg-white/5"
          >
            Next Chapter
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
