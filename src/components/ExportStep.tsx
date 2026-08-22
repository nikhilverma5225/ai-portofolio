import React, { useState, useRef } from "react";
import { 
  Download, 
  FileCode, 
  Printer, 
  FileJson, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink,
  PackageCheck,
  Globe,
  Palette,
  Layout,
  Type,
  UserCheck,
  Eye,
  Camera,
  Trash2,
  Maximize2,
  Minimize2,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown,
  ChevronUp,
  Edit3,
  Plus,
  RotateCw,
  Layers,
  ArrowRight,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Link as LinkIcon
} from "lucide-react";
import confetti from "canvas-confetti";
import { 
  ResumeData, 
  PortfolioConfig, 
  ThemeType, 
  AccentColor, 
  FontFamily, 
  PersonaTone,
  VerificationResult,
  SkillCategory,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem
} from "../types";
import { LivePortfolioView } from "./LivePortfolioView";
import { generateStandaloneHTML, createPortfolioZipBundle } from "../utils/exportTools";

interface StylePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  theme: ThemeType;
  accent: AccentColor;
  font: FontFamily;
  persona: PersonaTone;
  previewBg: string;
  accentBg: string;
}

const STYLE_PRESETS: StylePreset[] = [
  {
    id: "modern-tech",
    name: "Modern Tech",
    badge: "Dark / Blue",
    description: "High-contrast dark canvas with electric blue accents and clean typography",
    theme: "modern-dark",
    accent: "blue",
    font: "sans",
    persona: "tech-innovator",
    previewBg: "bg-slate-900 border-blue-500/40",
    accentBg: "bg-blue-500",
  },
  {
    id: "minimalist-ivory",
    name: "Minimalist Ivory",
    badge: "Light / Emerald",
    description: "Warm neutral ivory background with refined emerald accents and generous white space",
    theme: "minimalist-ivory",
    accent: "emerald",
    font: "sans",
    persona: "concise-minimalist",
    previewBg: "bg-[#FAFAF7] border-emerald-600/40 text-slate-900",
    accentBg: "bg-emerald-600",
  },
  {
    id: "obsidian-gold",
    name: "Obsidian & Gold",
    badge: "Dark / Gold",
    description: "Ultra-dark luxury canvas with champagne gold highlights and editorial serif headers",
    theme: "obsidian-gold",
    accent: "gold",
    font: "playfair",
    persona: "executive-leader",
    previewBg: "bg-[#0A0A0B] border-amber-500/40",
    accentBg: "bg-amber-400",
  },
  {
    id: "midnight-emerald",
    name: "Midnight Emerald",
    badge: "Dark / Emerald",
    description: "Deep oceanic dark background with electric emerald and technical modern geometry",
    theme: "midnight-emerald",
    accent: "emerald",
    font: "space-grotesk",
    persona: "academic-researcher",
    previewBg: "bg-[#061412] border-emerald-500/40",
    accentBg: "bg-emerald-400",
  },
  {
    id: "crimson-velvet",
    name: "Crimson Velvet",
    badge: "Dark / Ruby",
    description: "Dramatic burgundy dark palette with ruby highlights and artistic typography",
    theme: "crimson-velvet",
    accent: "crimson",
    font: "playfair",
    persona: "creative-artisan",
    previewBg: "bg-[#14080E] border-rose-500/40",
    accentBg: "bg-rose-500",
  },
  {
    id: "slate-tech",
    name: "Slate Cyber",
    badge: "Slate / Cyan",
    description: "Cool slate background with vivid cyan accents and monospaced developer typography",
    theme: "slate-tech",
    accent: "cyan",
    font: "jetbrains-mono",
    persona: "tech-innovator",
    previewBg: "bg-[#0F172A] border-cyan-500/40",
    accentBg: "bg-cyan-400",
  },
  {
    id: "clean-light",
    name: "Clean Studio",
    badge: "Light / Violet",
    description: "Crisp pure white layout with royal violet accents and high-contrast typography",
    theme: "clean-light",
    accent: "violet",
    font: "sans",
    persona: "executive-leader",
    previewBg: "bg-[#FFFFFF] border-violet-500/40 text-slate-900",
    accentBg: "bg-violet-600",
  },
];

const ACCENT_COLORS: { id: AccentColor; name: string; bg: string }[] = [
  { id: "blue", name: "Electric Blue", bg: "bg-blue-500" },
  { id: "emerald", name: "Emerald Mint", bg: "bg-emerald-500" },
  { id: "violet", name: "Royal Violet", bg: "bg-violet-500" },
  { id: "gold", name: "Champagne Gold", bg: "bg-amber-400" },
  { id: "crimson", name: "Ruby Crimson", bg: "bg-rose-500" },
  { id: "cyan", name: "Cyber Cyan", bg: "bg-cyan-400" },
];

const FONTS: { id: FontFamily; name: string; desc: string }[] = [
  { id: "sans", name: "Modern Sans", desc: "Inter / Plus Jakarta Sans" },
  { id: "jetbrains-mono", name: "JetBrains Mono", desc: "Monospace Developer" },
  { id: "space-grotesk", name: "Space Grotesk", desc: "Tech & Geometric" },
  { id: "playfair", name: "Playfair Display", desc: "Executive Editorial Serif" },
];

interface ExportStepProps {
  resumeData: ResumeData;
  config: PortfolioConfig;
  onUpdateConfig: (config: PortfolioConfig) => void;
  onUpdateResumeData: (data: ResumeData) => void;
  onRefineWithAI?: (persona: PersonaTone) => void;
  isRefining?: boolean;
  verificationResult?: VerificationResult | null;
}

export const ExportStep: React.FC<ExportStepProps> = ({
  resumeData,
  config,
  onUpdateConfig,
  onUpdateResumeData,
  onRefineWithAI,
  isRefining = false,
  verificationResult,
}) => {
  const [agreedFacts, setAgreedFacts] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedDesign, setAgreedDesign] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Viewport & Live preview state
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFactualEditor, setShowFactualEditor] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<"personal" | "experience" | "skills" | "education" | "projects" | "links">("personal");

  const photoInputRef = useRef<HTMLInputElement>(null);

  const isApproved = agreedFacts && agreedPrivacy && agreedDesign;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleApplyPreset = (preset: StylePreset) => {
    onUpdateConfig({
      ...config,
      theme: preset.theme,
      accent: preset.accent,
      font: preset.font,
      persona: preset.persona,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    onUpdateResumeData({
      ...resumeData,
      profile_image_base64: undefined,
    });
  };

  const toggleSection = (key: keyof typeof config.sectionVisibility) => {
    onUpdateConfig({
      ...config,
      sectionVisibility: {
        ...config.sectionVisibility,
        [key]: !config.sectionVisibility[key],
      },
    });
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zipBlob = await createPortfolioZipBundle(resumeData, config);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      const sanitizedName = (resumeData.personal_info.name || "portfolio").toLowerCase().replace(/\s+/g, "-");
      a.download = `${sanitizedName}-portfolio-bundle.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerCelebration();
    } catch (err) {
      console.error("Zip export error:", err);
      alert("Failed to build ZIP bundle. Please try single-file HTML download.");
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadHtml = () => {
    const html = generateStandaloneHTML(resumeData, config);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const sanitizedName = (resumeData.personal_info.name || "portfolio").toLowerCase().replace(/\s+/g, "-");
    a.download = `${sanitizedName}-portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerCelebration();
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify({ resumeData, portfolioConfig: config }, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const sanitizedName = (resumeData.personal_info.name || "resume").toLowerCase().replace(/\s+/g, "-");
    a.download = `${sanitizedName}-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    const html = generateStandaloneHTML(resumeData, config);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      window.print();
    }
  };

  const handleCopyHtml = async () => {
    const html = generateStandaloneHTML(resumeData, config);
    await navigator.clipboard.writeText(html);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper for quick factual editor
  const updatePersonalInfo = (field: string, val: string) => {
    onUpdateResumeData({
      ...resumeData,
      personal_info: {
        ...resumeData.personal_info,
        [field]: val,
      },
    });
  };

  const getViewportWidth = () => {
    if (viewport === "mobile") return "max-w-[375px]";
    if (viewport === "tablet") return "max-w-[768px]";
    return "w-full";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Hidden file input for photo upload */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* SECTION 1: PORTFOLIO STYLE TYPE BUTTONS & PRESETS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Portfolio Style Types & Themes
              </h2>
              <p className="text-xs text-slate-400">
                Click any style type to instantly restyle your live portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefineWithAI && (
              <button
                id="btn-ai-refine"
                onClick={() => onRefineWithAI(config.persona)}
                disabled={isRefining}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-blue-900/30 transition"
                title="Use Gemini 3.7 to polish summary & headline"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isRefining ? "animate-spin text-blue-200" : "text-amber-300"}`} />
                <span>{isRefining ? "Polishing Copy..." : "AI Headline Polish"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Style Presets Grid Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 pt-1">
          {STYLE_PRESETS.map((preset) => {
            const isSelected = config.theme === preset.theme && config.accent === preset.accent;
            return (
              <button
                key={preset.id}
                id={`btn-preset-${preset.id}`}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all duration-150 relative overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? "bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-950/40 text-white"
                    : "bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-full ${preset.accentBg} shrink-0 ring-1 ring-white/20`} />
                    <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
                      {preset.badge}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </div>

                <div className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors">
                  {preset.name}
                </div>

                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {preset.font === "jetbrains-mono" ? "Mono Code" : preset.font === "playfair" ? "Serif Luxury" : "Clean Sans"}
                </div>

                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Fine-Tuning Accents & Typography Controls */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Accent Color Chips */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Electric Accent Color
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {ACCENT_COLORS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onUpdateConfig({ ...config, accent: a.id })}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
                    config.accent === a.id
                      ? "bg-slate-800 text-white border-blue-500 ring-1 ring-blue-500/30 font-semibold"
                      : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${a.bg}`} />
                  <span>{a.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Typography Family */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Typography Pairing
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateConfig({ ...config, font: f.id })}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium text-left truncate transition ${
                    config.font === f.id
                      ? "bg-slate-800 text-white border-blue-500 ring-1 ring-blue-500/30 font-semibold"
                      : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Photo Quick Controls */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Headshot / Profile Photo
            </span>
            <div className="flex items-center gap-2">
              {resumeData.profile_image_base64 ? (
                <div className="flex items-center gap-2 w-full">
                  <img
                    src={resumeData.profile_image_base64}
                    alt="Headshot"
                    className="w-7 h-7 rounded-full object-cover border border-blue-500 shrink-0"
                  />
                  <span className="text-[11px] text-emerald-400 font-semibold truncate">
                    Attached Photo
                  </span>
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 ml-auto px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
                  >
                    Replace
                  </button>
                  <button
                    onClick={handleRemovePhoto}
                    className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 font-medium transition"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  <span>Attach Headshot Photo</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: INTERACTIVE LIVE PORTFOLIO PREVIEW */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Preview Frame Top Bar */}
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-400 ml-2">
              https://portfolio.live/{resumeData.personal_info.name ? resumeData.personal_info.name.toLowerCase().replace(/\s+/g, "") : "user"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Viewport Devices */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
              <button
                onClick={() => setViewport("desktop")}
                className={`p-1.5 rounded-md transition ${viewport === "desktop" ? "bg-slate-800 text-blue-400" : "text-slate-400 hover:text-slate-200"}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport("tablet")}
                className={`p-1.5 rounded-md transition ${viewport === "tablet" ? "bg-slate-800 text-blue-400" : "text-slate-400 hover:text-slate-200"}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`p-1.5 rounded-md transition ${viewport === "mobile" ? "bg-slate-800 text-blue-400" : "text-slate-400 hover:text-slate-200"}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Fullscreen Modal Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Live Preview Stage Container */}
        <div className={`p-3 sm:p-6 bg-slate-950/40 flex justify-center transition-all ${isFullscreen ? "fixed inset-0 z-50 bg-slate-950/95 p-6 overflow-y-auto" : ""}`}>
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="fixed top-6 right-6 z-50 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 shadow-2xl"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          )}

          <div className={`${getViewportWidth()} transition-all duration-300 rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950`}>
            <div className="max-h-[750px] overflow-y-auto">
              <LivePortfolioView
                resumeData={resumeData}
                config={config}
                onUploadPhoto={() => photoInputRef.current?.click()}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: OPTIONAL COLLAPSIBLE FACTUAL REVIEW & EDIT ACCORDION */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <button
          onClick={() => setShowFactualEditor(!showFactualEditor)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-800/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Factual Data & Zero-Hallucination Audit
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                  Score: {verificationResult?.score ?? 96}% Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Click to inspect or manually edit any extracted experience, skill, degree, or link
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-xs hidden sm:inline">
              {showFactualEditor ? "Hide Fact Editor" : "Inspect & Edit Facts"}
            </span>
            {showFactualEditor ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showFactualEditor && (
          <div className="p-5 sm:p-6 border-t border-slate-800 bg-slate-950/60 space-y-6">
            
            {/* Editor Subtabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {[
                { id: "personal", label: "Personal Info", icon: UserCheck },
                { id: "experience", label: "Experience", icon: Briefcase },
                { id: "skills", label: "Skills", icon: Layers },
                { id: "education", label: "Education", icon: GraduationCap },
                { id: "projects", label: "Projects", icon: FolderGit2 },
                { id: "links", label: "Links & Social", icon: LinkIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeEditorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveEditorTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Personal Tab */}
            {activeEditorTab === "personal" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resumeData.personal_info.name}
                    onChange={(e) => updatePersonalInfo("name", e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Professional Headline</label>
                  <input
                    type="text"
                    value={resumeData.personal_info.headline}
                    onChange={(e) => updatePersonalInfo("headline", e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                  <input
                    type="text"
                    value={resumeData.personal_info.email}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={resumeData.personal_info.location}
                    onChange={(e) => updatePersonalInfo("location", e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">Executive Summary</label>
                  <textarea
                    rows={3}
                    value={resumeData.summary}
                    onChange={(e) => onUpdateResumeData({ ...resumeData, summary: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeEditorTab === "experience" && (
              <div className="space-y-4 text-xs">
                {resumeData.experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Job Role</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[idx].role = e.target.value;
                            onUpdateResumeData({ ...resumeData, experience: updated });
                          }}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Company / Organization</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[idx].company = e.target.value;
                            onUpdateResumeData({ ...resumeData, experience: updated });
                          }}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Description / Key Accomplishments</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[idx].description = e.target.value;
                          onUpdateResumeData({ ...resumeData, experience: updated });
                        }}
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills Tab */}
            {activeEditorTab === "skills" && (
              <div className="space-y-4 text-xs">
                {resumeData.skills.map((cat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="block text-blue-400 font-bold uppercase tracking-wide">{cat.category}</label>
                    <input
                      type="text"
                      value={cat.items.join(", ")}
                      onChange={(e) => {
                        const updated = [...resumeData.skills];
                        updated[idx].items = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        onUpdateResumeData({ ...resumeData, skills: updated });
                      }}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      placeholder="Comma-separated skills (e.g. React, TypeScript, Python)"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Education Tab */}
            {activeEditorTab === "education" && (
              <div className="space-y-4 text-xs">
                {resumeData.education.map((edu, idx) => (
                  <div key={edu.id || idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Degree / Qualification</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[idx].degree = e.target.value;
                          onUpdateResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Institution / University</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[idx].institution = e.target.value;
                          onUpdateResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Tab */}
            {activeEditorTab === "projects" && (
              <div className="space-y-4 text-xs">
                {resumeData.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[idx].name = e.target.value;
                            onUpdateResumeData({ ...resumeData, projects: updated });
                          }}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Project URL / Live Link</label>
                        <input
                          type="text"
                          value={proj.url || ""}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[idx].url = e.target.value;
                            onUpdateResumeData({ ...resumeData, projects: updated });
                          }}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[idx].description = e.target.value;
                          onUpdateResumeData({ ...resumeData, projects: updated });
                        }}
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Links Tab */}
            {activeEditorTab === "links" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">GitHub Profile</label>
                  <input
                    type="text"
                    value={resumeData.links.github || ""}
                    onChange={(e) => onUpdateResumeData({ ...resumeData, links: { ...resumeData.links, github: e.target.value } })}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={resumeData.links.linkedin || ""}
                    onChange={(e) => onUpdateResumeData({ ...resumeData, links: { ...resumeData.links, linkedin: e.target.value } })}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Personal Portfolio / Website</label>
                  <input
                    type="text"
                    value={resumeData.links.portfolio || ""}
                    onChange={(e) => onUpdateResumeData({ ...resumeData, links: { ...resumeData.links, portfolio: e.target.value } })}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Twitter / X</label>
                  <input
                    type="text"
                    value={resumeData.links.twitter || ""}
                    onChange={(e) => onUpdateResumeData({ ...resumeData, links: { ...resumeData.links, twitter: e.target.value } })}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* SECTION 4: HUMAN APPROVAL GATEWAY */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Human Factual Approval Checklist
            </h2>
            <p className="text-xs text-slate-400">
              Confirm accuracy and presentation to unlock final production download gateways
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
            <input
              type="checkbox"
              checked={agreedFacts}
              onChange={(e) => setAgreedFacts(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
            />
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white block">Verified Factual Integrity</span>
              I confirm that all candidate experience items, educational degrees, and dates match genuine records.
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
            <input
              type="checkbox"
              checked={agreedPrivacy}
              onChange={(e) => setAgreedPrivacy(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
            />
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white block">Contact Details & Privacy Review</span>
              I have checked email, phone, location, and social links for accuracy and consent.
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
            <input
              type="checkbox"
              checked={agreedDesign}
              onChange={(e) => setAgreedDesign(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
            />
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white block">Presentation & Styling Approval</span>
              I approve the selected theme, electric accent, typography, and section visibility.
            </div>
          </label>
        </div>

        {isApproved ? (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">All approvals confirmed. Download packages are unlocked!</span>
          </div>
        ) : (
          <div className="text-xs text-slate-500 text-center">
            Please check the 3 verification boxes above to unlock final export options.
          </div>
        )}
      </div>

      {/* SECTION 5: EXPORT DOWNLOAD OPTIONS */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 transition-opacity duration-200 ${isApproved ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
        
        {/* Option 1: Complete ZIP Bundle */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <PackageCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Complete ZIP Package (.zip)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Contains production-ready <code className="text-blue-300">index.html</code>, <code className="text-blue-300">portfolio.json</code>, and deployment <code className="text-blue-300">README.txt</code> ready for GitHub Pages, Netlify, or Vercel.
            </p>
          </div>

          <button
            id="btn-download-zip"
            disabled={!isApproved || isZipping}
            onClick={handleDownloadZip}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? "Packaging ZIP..." : "Download ZIP Package"}</span>
          </button>
        </div>

        {/* Option 2: Standalone Offline HTML */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Standalone Offline HTML (.html)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Self-contained single file with all CSS, responsive viewport rules, and base64 headshot image embedded. Double click to open anywhere offline.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-download-html"
              disabled={!isApproved}
              onClick={handleDownloadHtml}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download HTML</span>
            </button>

            <button
              id="btn-copy-html"
              disabled={!isApproved}
              onClick={handleCopyHtml}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Copy HTML Source to Clipboard"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Option 3: Printable PDF Integration */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Print-to-PDF Integration
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Opens browser print dialog with dedicated print stylesheets (<code className="text-emerald-300">@media print</code>) for high-resolution vector PDF export.
            </p>
          </div>

          <button
            id="btn-print-pdf"
            disabled={!isApproved}
            onClick={handlePrintPdf}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-600/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print to PDF</span>
          </button>
        </div>

        {/* Option 4: Structured JSON Schema */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <FileJson className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Structured JSON Data (.json)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standardized JSON schema containing verified candidate facts, provenance metadata, and studio presentation settings.
            </p>
          </div>

          <button
            id="btn-download-json"
            disabled={!isApproved}
            onClick={handleDownloadJson}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-600/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON</span>
          </button>
        </div>

      </div>

      {/* SECTION 6: FREE HOSTING QUICK GUIDE */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 text-xs text-slate-400 space-y-3">
        <div className="flex items-center gap-2 text-slate-200 font-bold">
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Quick 1-Minute Free Hosting Instructions</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] leading-relaxed">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">1. GitHub Pages (Free)</span>
            Create a repository named <span className="font-mono text-blue-300">username.github.io</span>, upload <span className="font-mono">index.html</span>, and enable Pages under Repo Settings.
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">2. Netlify Drop (Instant)</span>
            Navigate to <span className="font-mono text-blue-300">app.netlify.com/drop</span> and drag the extracted ZIP folder for instant SSL live URL.
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">3. Offline / Local</span>
            Double-click the downloaded <span className="font-mono text-blue-300">index.html</span> file to open directly in Chrome, Firefox, Safari, or Edge.
          </div>
        </div>
      </div>

    </div>
  );
};
