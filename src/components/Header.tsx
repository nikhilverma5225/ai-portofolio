import React, { useState } from "react";
import { 
  FileText, 
  RotateCcw, 
  RefreshCw,
  Layers,
  ChevronDown
} from "lucide-react";
import { ApiHealthStatus } from "../types";
import { SAMPLE_RESUMES, SampleResume } from "../data/sampleResumes";

interface HeaderProps {
  apiHealth: ApiHealthStatus | null;
  checkingHealth: boolean;
  onRefreshHealth: () => void;
  onLoadSample: (sample: SampleResume) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiHealth,
  checkingHealth,
  onRefreshHealth,
  onLoadSample,
  onReset,
}) => {
  const [showSampleMenu, setShowSampleMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0c0e12]/90 border-b border-white/[0.08] text-slate-100 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Monolithic Mark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#181e2b] border border-white/[0.12] flex items-center justify-center text-amber-400 shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-display font-bold text-base tracking-tight text-slate-100">
                Atelier<span className="text-amber-400 ml-1">Portfolio</span>
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                Verified Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              Zero-Hallucination Resume to Interactive Portfolio Engine
            </p>
          </div>
        </div>

        {/* Controls & API Status */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Sample Resumes Dropdown */}
          <div className="relative">
            <button
              id="btn-sample-resumes"
              onClick={() => setShowSampleMenu(!showSampleMenu)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#181e2b] hover:bg-[#222a3a] text-slate-200 border border-white/[0.08] transition"
              title="Load a pre-verified sample resume"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Sample Resumes</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showSampleMenu && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-[#131720] border border-white/[0.1] rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-xl"
                onClick={() => setShowSampleMenu(false)}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2.5 py-1.5 border-b border-white/[0.06] mb-1">
                  Load Pre-Verified Profile
                </div>
                {SAMPLE_RESUMES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => onLoadSample(sample)}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/[0.06] transition flex items-start gap-2.5 group"
                  >
                    <span className="text-[10px] font-mono uppercase font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                      {sample.badge}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                        {sample.name}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {sample.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* API Health Status */}
          <button
            id="btn-api-health"
            onClick={onRefreshHealth}
            disabled={checkingHealth}
            className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border transition ${
              apiHealth?.ok
                ? "bg-[#181e2b] border-white/[0.08] text-slate-300 hover:border-white/[0.16]"
                : "bg-amber-950/20 border-amber-500/30 text-amber-300 hover:bg-amber-950/40"
            }`}
            title={`Gemini API: ${apiHealth?.ok ? "Live & Verified" : apiHealth?.error || "Checking"}`}
          >
            {checkingHealth ? (
              <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
            ) : (
              <span className={`w-2 h-2 rounded-full ${apiHealth?.ok ? "bg-emerald-400" : "bg-amber-400"}`} />
            )}
            <span className="hidden sm:inline">
              {checkingHealth ? "Checking..." : apiHealth?.ok ? `${apiHealth.model} (${apiHealth.latencyMs}ms)` : "API Offline"}
            </span>
          </button>

          {/* Reset Button */}
          <button
            id="btn-reset-workflow"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-[#181e2b] hover:bg-rose-950/30 hover:text-rose-300 hover:border-rose-700/40 text-slate-300 border border-white/[0.08] transition"
            title="Clear workflow and start fresh"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>

      </div>
    </header>
  );
};
