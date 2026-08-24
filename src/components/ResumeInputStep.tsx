import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Trash2, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Loader2,
  FileCheck
} from "lucide-react";

interface ResumeInputStepProps {
  onAnalyze: (payload: { text?: string; fileBase64?: string; mimeType?: string; fileName?: string; photoBase64?: string; stream: string }) => void;
  isAnalyzing: boolean;
  analysisProgress: string;
  errorMessage: string | null;
  photoBase64: string | null;
  onPhotoChange: (base64: string | null) => void;
}

const CAREER_STREAMS = [
  "Auto-Detect from Document",
  "Software Engineering, AI & Data Science",
  "Commerce, Accounting & Corporate Finance",
  "Healthcare, Medicine & Biological Sciences",
  "Law, Humanities, Journalism & Social Sciences",
  "Creative Media, Product Design & Arts",
  "Education, Research & Academia",
  "Trades, Logistics & Operations"
];

export const ResumeInputStep: React.FC<ResumeInputStepProps> = ({
  onAnalyze,
  isAnalyzing,
  analysisProgress,
  errorMessage,
  photoBase64,
  onPhotoChange,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [resumeText, setResumeText] = useState("");
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    base64: string;
    mimeType: string;
  } | null>(null);
  const [selectedStream, setSelectedStream] = useState(CAREER_STREAMS[0]);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const handleFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      alert("File exceeds maximum allowed size of 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      setSelectedFile({
        name: file.name,
        size: file.size,
        base64,
        mimeType: file.type || "application/octet-stream",
      });

      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const textReader = new FileReader();
        textReader.onload = () => setResumeText(textReader.result as string);
        textReader.readAsText(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onPhotoChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleStartAnalysis = () => {
    if (activeTab === "upload" && !selectedFile && !resumeText.trim()) {
      alert("Please upload a resume file (PDF/DOCX/TXT) or paste resume text.");
      return;
    }
    if (activeTab === "paste" && !resumeText.trim()) {
      alert("Please paste your resume text.");
      return;
    }

    onAnalyze({
      text: resumeText.trim() || undefined,
      fileBase64: selectedFile?.base64,
      mimeType: selectedFile?.mimeType,
      fileName: selectedFile?.name,
      photoBase64: photoBase64 || undefined,
      stream: selectedStream,
    });
  };

  const charCount = resumeText.length;
  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Privacy Notice Banner */}
      <div className="mb-6 p-4 rounded-xl bg-[#131720] border border-white/[0.08] flex items-start gap-3 shadow-sm">
        <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-100">In-Memory Execution:</span> Documents are parsed in volatile container memory and verified via Google Gemini models without persistent cloud disk storage.
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <div className="font-bold text-rose-300">API Execution Notice</div>
            <div className="mt-1 text-rose-200/90">{errorMessage}</div>
            <div className="mt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 underline"
              >
                Verify Google AI Studio API Key ↗
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Ingestion Card */}
        <div className="lg:col-span-8 bg-[#131720] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
          
          {/* Ingestion Tabs */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <button
                id="tab-upload-file"
                onClick={() => setActiveTab("upload")}
                className={`flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition ${
                  activeTab === "upload"
                    ? "bg-[#181e2b] text-slate-100 border border-white/[0.12] shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                <UploadCloud className="w-4 h-4 text-amber-400" />
                Upload Document (.pdf, .docx, .txt)
              </button>

              <button
                id="tab-paste-text"
                onClick={() => setActiveTab("paste")}
                className={`flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition ${
                  activeTab === "paste"
                    ? "bg-[#181e2b] text-slate-100 border border-white/[0.12] shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                <FileText className="w-4 h-4 text-amber-400" />
                Direct Text Paste
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Universal Parser</span>
            </div>
          </div>

          {/* Upload Drop Zone */}
          {activeTab === "upload" ? (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  dragActive
                    ? "border-amber-400 bg-amber-400/5"
                    : selectedFile
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-white/[0.12] hover:border-white/[0.24] bg-[#0c0e12]/60 hover:bg-[#0c0e12]/90"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />

                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition ${
                  selectedFile
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-[#181e2b] text-amber-400 border border-white/[0.08]"
                }`}>
                  {selectedFile ? <CheckCircle2 className="w-7 h-7" /> : <UploadCloud className="w-7 h-7" />}
                </div>

                <div>
                  <div className="font-semibold text-slate-100 text-sm sm:text-base">
                    {selectedFile ? selectedFile.name : "Drag & drop your resume or click to browse"}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports Adobe PDF (.pdf), Microsoft Word (.docx), and Plain Text (.txt) up to 5MB
                  </p>
                </div>

                {selectedFile && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-emerald-300 font-mono px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {(selectedFile.size / 1024).toFixed(1)} KB Ingested
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setResumeText("");
                      }}
                      className="p-1 rounded bg-[#181e2b] hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 border border-white/[0.08] transition"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Format Details */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#0c0e12]/60 border border-white/[0.06] text-center">
                  <div className="text-xs font-semibold text-slate-200">PDF Resumes</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Multimodal visual layout parsing</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0c0e12]/60 border border-white/[0.06] text-center">
                  <div className="text-xs font-semibold text-slate-200">Word .docx</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">In-memory XML schema extraction</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0c0e12]/60 border border-white/[0.06] text-center">
                  <div className="text-xs font-semibold text-slate-200">Plain Text</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Direct UTF-8 token parsing</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Paste raw resume content below:</span>
                <span className="font-mono text-[11px]">{wordCount} words • {charCount} / 50,000 chars</span>
              </div>
              <textarea
                id="textarea-resume-content"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the full text of your resume here (work history, skills, education, projects)..."
                rows={12}
                className="w-full bg-[#0c0e12] border border-white/[0.1] rounded-xl p-4 text-xs sm:text-sm text-slate-200 font-mono focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 outline-none resize-y transition leading-relaxed"
              />
            </div>
          )}

        </div>

        {/* Configuration Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Stream Selector */}
          <div className="bg-[#131720] border border-white/[0.08] rounded-2xl p-5 shadow-xl">
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Career Domain Archetype
            </label>
            <select
              id="select-career-stream"
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="w-full bg-[#0c0e12] border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:border-amber-400 outline-none transition"
            >
              {CAREER_STREAMS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Gemini tunes entity categorization and semantic skill grouping to your discipline.
            </p>
          </div>

          {/* Profile Photo Headshot */}
          <div className="bg-[#131720] border border-white/[0.08] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-200">
                Profile Photo (Optional)
              </span>
              {photoBase64 && (
                <button
                  onClick={() => onPhotoChange(null)}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {photoBase64 ? (
                <div className="relative">
                  <img
                    src={photoBase64}
                    alt="Headshot Preview"
                    className="w-16 h-16 rounded-full object-cover border border-amber-400/40 shadow-sm"
                  />
                </div>
              ) : (
                <div 
                  onClick={() => photoInputRef.current?.click()}
                  className="w-16 h-16 rounded-full border border-dashed border-white/[0.16] bg-[#0c0e12] flex flex-col items-center justify-center text-slate-400 hover:border-amber-400/40 cursor-pointer transition shrink-0"
                >
                  <ImageIcon className="w-5 h-5 text-slate-500" />
                  <span className="text-[9px] mt-1 font-mono">Upload</span>
                </div>
              )}

              <div className="text-xs text-slate-400 leading-relaxed">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 block mb-1"
                >
                  {photoBase64 ? "Change Headshot" : "Upload Headshot"}
                </button>
                <span className="text-[11px] text-slate-500">
                  If omitted, your portfolio renders a clean typographical header.
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className="bg-[#131720] border border-amber-400/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 mb-1">
              Factual Grounding Pipeline
            </div>
            <h3 className="font-display text-sm font-bold text-slate-100 mb-1.5">
              Zero-Hallucination Extraction
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Extracts validated claims with exact provenance quotes mapped directly from your document text.
            </p>

            <button
              id="btn-analyze-resume"
              disabled={isAnalyzing}
              onClick={handleStartAnalysis}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm ${
                isAnalyzing
                  ? "bg-[#181e2b] text-slate-400 cursor-wait border border-white/[0.08]"
                  : "bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-[0.99] font-bold"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>{analysisProgress || "Extracting Facts..."}</span>
                </>
              ) : (
                <>
                  <span>Extract & Ground Facts</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
