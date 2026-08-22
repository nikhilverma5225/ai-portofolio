import React, { useState } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  RotateCcw, 
  Sun, 
  Moon, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { ApiHealthStatus, ThemeType, AccentColor } from "../types";
import { SAMPLE_RESUMES, SampleResume } from "../data/sampleResumes";

interface HeaderProps {
  apiHealth: ApiHealthStatus | null;
  checkingHealth: boolean;
  onRefreshHealth: () => void;
  onLoadSample: (sample: SampleResume) => void;
  onReset: () => void;
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  accent: AccentColor;
  onAccentChange: (accent: AccentColor) => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiHealth,
  checkingHealth,
  onRefreshHealth,
  onLoadSample,
  onReset,
  theme,
  onThemeChange,
  accent,
  onAccentChange,
}) => {
  const [showSampleMenu, setShowSampleMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800 text-white px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Badges */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                AI-Assisted Portfolio Generator
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                Zero Hallucination
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              Universal Resume Fact Extractor & High-Profile Portfolio Studio
            </p>
          </div>
        </div>

        {/* Controls & API Status */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          
          {/* Sample Resumes Dropdown */}
          <div className="relative">
            <button
              id="btn-sample-resumes"
              onClick={() => setShowSampleMenu(!showSampleMenu)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Load a verified sample resume"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Sample Resumes</span>
            </button>

            {showSampleMenu && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setShowSampleMenu(false)}
              >
                <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Select Pre-Verified Profile
                </div>
                {SAMPLE_RESUMES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => onLoadSample(sample)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/80 transition flex items-start gap-2.5 group"
                  >
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 group-hover:border-blue-500/40">
                      {sample.badge}
                    </span>
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-white">
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

          {/* API Health Pill */}
          <button
            id="btn-api-health"
            onClick={onRefreshHealth}
            disabled={checkingHealth}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition ${
              apiHealth?.ok
                ? "bg-emerald-950/40 border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/40"
                : "bg-amber-950/40 border-amber-600/40 text-amber-300 hover:bg-amber-900/40"
            }`}
            title={`Gemini API Status: ${apiHealth?.ok ? "Live & Ready" : apiHealth?.error || "Checking"}`}
          >
            {checkingHealth ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
            ) : apiHealth?.ok ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
            <span className="hidden sm:inline">
              {checkingHealth ? "Checking..." : apiHealth?.ok ? `Gemini 3.7 (${apiHealth.latencyMs}ms)` : "API Warning"}
            </span>
          </button>

          {/* Reset Button */}
          <button
            id="btn-reset-workflow"
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-900/30 hover:text-rose-300 hover:border-rose-700/50 text-slate-300 border border-slate-700 transition"
            title="Clear and start new resume"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>

      </div>
    </header>
  );
};
