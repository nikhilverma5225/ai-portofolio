import React from "react";
import { FileUp, Sparkles, Check } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  hasExtractedData: boolean;
  hasVerifiedData: boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onSelectStep,
  hasExtractedData,
}) => {
  const steps = [
    {
      id: 1,
      title: "1. Upload & Extract",
      desc: "In-memory document ingestion & fact extraction",
      icon: FileUp,
      ready: true,
      completed: hasExtractedData,
    },
    {
      id: 2,
      title: "2. Approve & Export",
      desc: "Portfolio style types, live studio preview, & download bundles",
      icon: Sparkles,
      ready: hasExtractedData,
      completed: false,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isEnabled = step.ready;

          return (
            <button
              key={step.id}
              id={`step-nav-btn-${step.id}`}
              disabled={!isEnabled}
              onClick={() => isEnabled && onSelectStep(step.id)}
              className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden flex items-center justify-between gap-3 ${
                isActive
                  ? "bg-gradient-to-r from-blue-900/40 via-slate-900/90 to-indigo-900/40 border-blue-500/60 shadow-lg shadow-blue-950/40 text-white ring-1 ring-blue-500/30"
                  : isEnabled
                  ? "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:border-slate-700"
                  : "bg-slate-950/40 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : step.completed
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {step.completed && !isActive ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <div>
                  <div className={`font-bold text-sm tracking-tight ${isActive ? "text-white" : "text-slate-200"}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {step.desc}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                {isActive && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                    Active
                  </span>
                )}
                {step.completed && !isActive && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    Ready
                  </span>
                )}
              </div>

              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
