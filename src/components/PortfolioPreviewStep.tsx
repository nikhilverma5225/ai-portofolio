import React, { useState, useRef } from "react";
import { 
  Palette, 
  Sparkles, 
  Eye, 
  Monitor, 
  Tablet, 
  Smartphone, 
  ArrowRight, 
  Sliders, 
  Check, 
  RotateCw,
  Maximize2,
  Minimize2,
  Camera,
  Trash2,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { 
  ResumeData, 
  PortfolioConfig, 
  ThemeType, 
  AccentColor, 
  FontFamily, 
  PersonaTone 
} from "../types";
import { LivePortfolioView } from "./LivePortfolioView";

interface PortfolioPreviewStepProps {
  resumeData: ResumeData;
  config: PortfolioConfig;
  onUpdateConfig: (config: PortfolioConfig) => void;
  onUpdateResumeData?: (data: ResumeData) => void;
  onProceedToExport: () => void;
  onRefineWithAI: (persona: PersonaTone) => void;
  isRefining: boolean;
}

const THEMES: { id: ThemeType; label: string; bg: string; color: string }[] = [
  { id: "modern-dark", label: "Modern Dark", bg: "#0B0F19", color: "#6C8EFF" },
  { id: "slate-tech", label: "Slate Tech", bg: "#0F172A", color: "#38BDF8" },
  { id: "obsidian-gold", label: "Obsidian Gold", bg: "#121214", color: "#EAB308" },
  { id: "midnight-emerald", label: "Midnight Emerald", bg: "#061A14", color: "#10B981" },
  { id: "crimson-velvet", label: "Crimson Velvet", bg: "#150A0E", color: "#F43F5E" },
  { id: "clean-light", label: "Clean Light", bg: "#F8FAFC", color: "#2563EB" },
  { id: "minimalist-ivory", label: "Minimalist Ivory", bg: "#FAF9F6", color: "#44403C" },
];

const ACCENTS: { id: AccentColor; label: string; hex: string }[] = [
  { id: "blue", label: "Electric Blue", hex: "#6C8EFF" },
  { id: "emerald", label: "Emerald", hex: "#10B981" },
  { id: "violet", label: "Violet", hex: "#8B5CF6" },
  { id: "gold", label: "Amber Gold", hex: "#F59E0B" },
  { id: "crimson", label: "Crimson", hex: "#EF4444" },
  { id: "cyan", label: "Cyan Tech", hex: "#06B6D4" },
];

const PERSONAS: { id: PersonaTone; label: string; desc: string }[] = [
  { id: "tech-innovator", label: "Tech & Systems Innovator", desc: "High-impact technical depth & architecture" },
  { id: "executive-leader", label: "Executive & Strategic Leader", desc: "Visionary, ROI, and leadership narrative" },
  { id: "academic-researcher", label: "Academic & Research Scholar", desc: "Formal, methodologies, and publications" },
  { id: "creative-artisan", label: "Creative & Design Artisan", desc: "Human-centered, empathetic UX design voice" },
  { id: "concise-minimalist", label: "Concise Minimalist", desc: "Direct, high signal-to-noise ratio" },
];

export const PortfolioPreviewStep: React.FC<PortfolioPreviewStepProps> = ({
  resumeData,
  config,
  onUpdateConfig,
  onUpdateResumeData,
  onProceedToExport,
  onRefineWithAI,
  isRefining,
}) => {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (key: keyof typeof config.sectionVisibility) => {
    onUpdateConfig({
      ...config,
      sectionVisibility: {
        ...config.sectionVisibility,
        [key]: !config.sectionVisibility[key],
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateResumeData) return;

    const reader = new FileReader();
    reader.onload = () => {
      onUpdateResumeData({
        ...resumeData,
        profile_image_base64: reader.result as string,
      });
      onUpdateConfig({
        ...config,
        showPhoto: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    if (onUpdateResumeData) {
      onUpdateResumeData({
        ...resumeData,
        profile_image_base64: undefined,
      });
    }
  };

  const getViewportWidth = () => {
    if (viewport === "mobile") return "max-w-[375px]";
    if (viewport === "tablet") return "max-w-[768px]";
    return "w-full";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Control Ribbon */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        
        {/* Left: Section & Controls Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setShowControls(!showControls)}
            className={`text-xs font-semibold px-3 py-2 rounded-xl border flex items-center gap-1.5 transition ${
              showControls
                ? "bg-blue-600 text-white border-blue-500"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Studio</span>
          </button>

          {/* AI Refinement Trigger */}
          <button
            id="btn-ai-refine-copy"
            disabled={isRefining}
            onClick={() => onRefineWithAI(config.persona)}
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-500/30 flex items-center gap-1.5 shadow-md shadow-purple-950/40"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isRefining ? "animate-spin text-amber-300" : "text-purple-200"}`} />
            <span>{isRefining ? "Refining with Gemini..." : "AI Refine Headlines & Bio"}</span>
          </button>
        </div>

        {/* Center: Device Viewport Switches */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewport("desktop")}
            className={`p-1.5 rounded-lg transition ${
              viewport === "desktop" ? "bg-slate-800 text-blue-400" : "text-slate-500 hover:text-slate-300"
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`p-1.5 rounded-lg transition ${
              viewport === "tablet" ? "bg-slate-800 text-blue-400" : "text-slate-500 hover:text-slate-300"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`p-1.5 rounded-lg transition ${
              viewport === "mobile" ? "bg-slate-800 text-blue-400" : "text-slate-500 hover:text-slate-300"
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Proceed Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            id="btn-proceed-export"
            onClick={onProceedToExport}
            className="text-xs sm:text-sm font-bold px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition flex items-center gap-2"
          >
            <span>Proceed to Export</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Expandable Customization Panel */}
      {showControls && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Theme Palette */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Theme Preset
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => onUpdateConfig({ ...config, theme: th.id })}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                      config.theme === th.id
                        ? "bg-slate-800 border-blue-500 text-white ring-1 ring-blue-500/50"
                        : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: th.bg }} />
                      <span className="truncate">{th.label}</span>
                    </div>
                    {config.theme === th.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Brand Accent */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Electric Accent Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ACCENTS.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => onUpdateConfig({ ...config, accent: acc.id })}
                    className={`p-2 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition ${
                      config.accent === acc.id
                        ? "bg-slate-800 border-blue-500 text-white"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: acc.hex }} />
                    <span className="truncate">{acc.label}</span>
                  </button>
                ))}
              </div>

              {/* Persona Selector */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Tone Persona
                </label>
                <select
                  value={config.persona}
                  onChange={(e) => onUpdateConfig({ ...config, persona: e.target.value as PersonaTone })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-blue-500 outline-none"
                >
                  {PERSONAS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Section Visibility */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Section Visibility
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(
                  [
                    { key: "hero", label: "Hero & Bio" },
                    { key: "skills", label: "Skills Category" },
                    { key: "experience", label: "Experience" },
                    { key: "projects", label: "Projects" },
                    { key: "education", label: "Education" },
                    { key: "certifications", label: "Certifications" },
                    { key: "contact", label: "Contact CTA" },
                  ] as const
                ).map(({ key, label }) => {
                  const isVisible = config.sectionVisibility[key];
                  return (
                    <button
                      key={key}
                      onClick={() => toggleSection(key)}
                      className={`px-3 py-2 rounded-xl border text-left font-medium flex items-center justify-between transition ${
                        isVisible
                          ? "bg-slate-800/80 border-slate-700 text-slate-200"
                          : "bg-slate-950/40 border-slate-900 text-slate-600 line-through"
                      }`}
                    >
                      <span>{label}</span>
                      {isVisible && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>
                  );
                })}

                {resumeData.profile_image_base64 && (
                  <button
                    onClick={() => onUpdateConfig({ ...config, showPhoto: !config.showPhoto })}
                    className={`px-3 py-2 rounded-xl border text-left font-medium flex items-center justify-between col-span-2 transition ${
                      config.showPhoto
                        ? "bg-slate-800/80 border-slate-700 text-slate-200"
                        : "bg-slate-950/40 border-slate-900 text-slate-600 line-through"
                    }`}
                  >
                    <span>Profile Photo</span>
                    {config.showPhoto && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                )}
              </div>
            </div>

            {/* 4. Headshot & Avatar Manager */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Profile Photo & Headshot
              </label>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                {resumeData.profile_image_base64 ? (
                  <>
                    <img
                      src={resumeData.profile_image_base64}
                      alt="Headshot"
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">Active Headshot</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                        <button
                          onClick={() => photoInputRef.current?.click()}
                          className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          Replace
                        </button>
                        <span>•</span>
                        <button
                          onClick={handleRemovePhoto}
                          className="text-rose-400 hover:text-rose-300 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-400">
                      <div className="font-semibold text-slate-200">No Photo Attached</div>
                      <div className="text-[11px] text-slate-500">Zero dummy avatar displayed</div>
                    </div>
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shrink-0 transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Live Iframe-Like Stage */}
      <div className={`mx-auto transition-all duration-300 ${getViewportWidth()} ${isFullscreen ? "fixed inset-0 z-50 p-0 max-w-none bg-black" : ""}`}>
        <div className="rounded-2xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-950">
          
          {/* Browser Window Header Mock */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-md border border-slate-800 max-w-sm truncate">
              https://portfolio.local/{resumeData.personal_info.name?.toLowerCase().replace(/\s+/g, "-") || "candidate"}
            </div>

            <div className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              Live Preview
            </div>
          </div>

          {/* Render Actual Live View */}
          <div className="max-h-[850px] overflow-y-auto">
            <LivePortfolioView 
              resumeData={resumeData} 
              config={config} 
              onUploadPhoto={() => photoInputRef.current?.click()}
            />
          </div>
        </div>
      </div>

    </div>
  );
};
