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
      title: "1. Ingest & Extract",
      desc: "Document extraction & zero-hallucination fact mapping",
      icon: FileUp,
      ready: true,
      completed: hasExtractedData,
    },
    {
      id: 2,
      title: "2. Curate & Export",
      desc: "Theme orchestration, live preview & bundle generation",
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
              className={`text-left p-3.5 rounded-xl border transition-all relative flex items-center justify-between gap-3 ${
                isActive
                  ? "bg-[#181e2b] border-amber-400/40 text-slate-100 shadow-lg shadow-black/40 ring-1 ring-amber-400/20"
                  : isEnabled
                  ? "bg-[#131720] hover:bg-[#181e2b] border-white/[0.08] text-slate-300 hover:border-white/[0.14]"
                  : "bg-[#0f1219]/60 border-white/[0.04] text-slate-600 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-semibold shrink-0 transition-colors ${
                    isActive
                      ? "bg-amber-400 text-slate-950 shadow-sm"
                      : step.completed
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-white/[0.06] text-slate-400 border border-white/[0.08]"
                  }`}
                >
                  {step.completed && !isActive ? <Check className="w-3.5 h-3.5" /> : `0${step.id}`}
                </div>
                <div>
                  <div className={`font-display font-semibold text-sm tracking-tight ${isActive ? "text-slate-100" : "text-slate-300"}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {step.desc}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                {isActive && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Active
                  </span>
                )}
                {step.completed && !isActive && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                    Ready
                  </span>
                )}
              </div>

              {isActive && (
                <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
