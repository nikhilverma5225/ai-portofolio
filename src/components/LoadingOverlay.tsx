import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileSearch, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
  fileName?: string;
}

const LOADING_STAGES = [
  {
    icon: FileSearch,
    title: "Ingesting Document Structure",
    desc: "Reading text tokens, section hierarchy, and formatting layout...",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    icon: Cpu,
    title: "Consulting Gemini Multimodal AI",
    desc: "Extracting career trajectory, verified tools, and achievements...",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    icon: ShieldCheck,
    title: "Zero-Hallucination Fact Grounding",
    desc: "Validating exact source quotes and mapping verbatim citations...",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Layers,
    title: "Synthesizing Interactive Portfolio Data",
    desc: "Orchestrating layout themes, metadata metrics, and showcase items...",
    color: "text-slate-100",
    bg: "bg-white/[0.08]",
    border: "border-white/[0.12]",
  },
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, fileName }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStageIndex(0);
      setElapsedSeconds(0);
      return;
    }

    const timerInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    const stageInterval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < LOADING_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 3000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(stageInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  const currentStage = LOADING_STAGES[currentStageIndex];
  const StageIcon = currentStage.icon;

  return (
    <AnimatePresence>
      <motion.div
        id="gemini-loading-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0e12]/85 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#131720] p-6 sm:p-7 shadow-2xl overflow-hidden"
        >
          {/* Subtle amber corner glow */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-slate-100">Gemini AI Fact Grounding</h3>
                <p className="text-xs text-slate-400">
                  {fileName ? `Processing "${fileName}"` : "In-memory document stream"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-[#181e2b] px-2.5 py-1 text-[11px] font-mono text-slate-300 border border-white/[0.08]">
              <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
              <span>{elapsedSeconds}s</span>
            </div>
          </div>

          {/* Active Animated Stage Card */}
          <div className="relative mb-5 rounded-xl border border-white/[0.08] bg-[#0c0e12] p-5 overflow-hidden">
            {/* Animated Scanning Line */}
            <motion.div
              className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_6px_rgba(245,158,11,0.6)]"
              animate={{
                top: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="flex items-start gap-3.5">
              <motion.div
                key={currentStageIndex}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${currentStage.border} ${currentStage.bg} ${currentStage.color}`}
              >
                <StageIcon className="h-5 w-5" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStageIndex}
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                        Step {currentStageIndex + 1} of {LOADING_STAGES.length}
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-semibold text-slate-100 mt-0.5 mb-0.5">
                      {currentStage.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {currentStage.desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                className="h-full bg-amber-400"
                initial={{ width: "10%" }}
                animate={{
                  width: `${((currentStageIndex + 1) / LOADING_STAGES.length) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Stepper checklist */}
          <div className="space-y-1.5">
            {LOADING_STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={stage.title}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    isCurrent
                      ? "bg-[#181e2b] text-slate-100 font-medium border border-white/[0.08]"
                      : isCompleted
                      ? "text-slate-400"
                      : "text-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400 shrink-0" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-white/[0.12] mx-1 shrink-0" />
                    )}
                    <span className="truncate text-xs">{stage.title}</span>
                  </div>
                  {isCompleted && (
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">Verified</span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-mono text-amber-400 uppercase">Active</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Privacy footer badge */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
            <p className="text-[11px] text-slate-500 font-mono">
              Zero-Disk-Storage: Document buffer discarded after session
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
