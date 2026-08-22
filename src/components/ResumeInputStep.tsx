import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  FileText, 
  FileCode, 
  Sparkles, 
  ShieldAlert, 
  Image as ImageIcon, 
  Trash2, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  ArrowRight,
  Loader2
} from "lucide-react";
import { SAMPLE_RESUMES } from "../data/sampleResumes";

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

      // If it's a plain text file, also read as text for preview
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
      <div className="mb-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 shadow-md">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-100">🛡️ Privacy First & In-Memory Processing:</span> Resumes are processed strictly in-memory and sent directly to Google Gemini API via secure SSL. No documents or personal records are stored on disk.
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-600/40 text-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <div className="font-bold text-rose-300">API Execution Notice</div>
            <div className="mt-1 text-rose-200/90">{errorMessage}</div>
            <div className="mt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
              >
                Get or verify your Google AI Studio API Key ↗
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Ingestion Card (Left 8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          
          {/* Ingestion Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <button
                id="tab-upload-file"
                onClick={() => setActiveTab("upload")}
                className={`flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition ${
                  activeTab === "upload"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                Upload Document (.pdf, .docx, .txt)
              </button>

              <button
                id="tab-paste-text"
                onClick={() => setActiveTab("paste")}
                className={`flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition ${
                  activeTab === "paste"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <FileText className="w-4 h-4" />
                Direct Text Paste
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
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
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  dragActive
                    ? "border-blue-400 bg-blue-950/20"
                    : selectedFile
                    ? "border-emerald-500/50 bg-emerald-950/10"
                    : "border-slate-700/80 hover:border-slate-600 bg-slate-950/40 hover:bg-slate-900/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition ${
                  selectedFile
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  {selectedFile ? <CheckCircle2 className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
                </div>

                <div>
                  <div className="font-semibold text-slate-100 text-sm sm:text-base">
                    {selectedFile ? selectedFile.name : "Drag & drop your resume or click to browse"}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports Adobe PDF (.pdf), Microsoft Word (.docx), Image (.png, .jpg), and Plain Text (.txt) up to 5MB
                  </p>
                </div>

                {selectedFile && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/40">
                      {(selectedFile.size / 1024).toFixed(1)} KB Ready
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setResumeText("");
                      }}
                      className="p-1 rounded-md bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Document Format Badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center">
                  <div className="text-xs font-bold text-slate-200">PDF Resumes</div>
                  <div className="text-[11px] text-slate-400">Native multimodal layout parsing</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center">
                  <div className="text-xs font-bold text-slate-200">Word .docx</div>
                  <div className="text-[11px] text-slate-400">In-memory XML text extractor</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center">
                  <div className="text-xs font-bold text-slate-200">Plain Text</div>
                  <div className="text-[11px] text-slate-400">Direct ASCII / UTF-8 structure</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Paste or paste raw resume text below:</span>
                <span className="font-mono">{wordCount} words • {charCount} / 50,000 chars</span>
              </div>
              <textarea
                id="textarea-resume-content"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the full text of your resume here including work experience, education, projects, contact info..."
                rows={12}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y transition leading-relaxed"
              />
            </div>
          )}

        </div>

        {/* Configuration Sidebar (Right 4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Stream Selector */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Career Stream / Discipline
            </label>
            <select
              id="select-career-stream"
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:border-blue-500 outline-none"
            >
              {CAREER_STREAMS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-2">
              Gemini dynamically organizes skills and formats credentials based on the domain.
            </p>
          </div>

          {/* Profile Photo / Headshot Container */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-200">
                Profile Headshot (Optional)
              </span>
              {photoBase64 && (
                <button
                  onClick={() => onPhotoChange(null)}
                  className="text-[11px] text-rose-400 hover:text-rose-300"
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
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-md"
                  />
                </div>
              ) : (
                <div 
                  onClick={() => photoInputRef.current?.click()}
                  className="w-20 h-20 rounded-full border-2 border-dashed border-slate-700 bg-slate-950/60 flex flex-col items-center justify-center text-slate-400 hover:border-slate-500 cursor-pointer transition shrink-0"
                >
                  <ImageIcon className="w-6 h-6 text-slate-500" />
                  <span className="text-[9px] mt-1">Add Photo</span>
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
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 block mb-1"
                >
                  {photoBase64 ? "Change Headshot" : "Upload Custom Headshot"}
                </button>
                <span className="text-[11px] text-slate-500">
                  Auto-extracted if present in your uploaded resume document. If no photo is found or provided, no dummy avatar is displayed in your portfolio.
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className="bg-gradient-to-br from-blue-950/50 via-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-2xl p-5 shadow-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              Step 1 Verification Gate
            </div>
            <h3 className="text-sm font-bold text-white mb-2">
              Zero-Hallucination Extraction
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Extracts factual entities with verbatim provenance quotes directly from the source resume.
            </p>

            <button
              id="btn-analyze-resume"
              disabled={isAnalyzing}
              onClick={handleStartAnalysis}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                isAnalyzing
                  ? "bg-blue-800 text-blue-200 cursor-wait"
                  : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 active:scale-[0.99]"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-300" />
                  <span>{analysisProgress || "Extracting Factual Schema..."}</span>
                </>
              ) : (
                <>
                  <span>Analyze Resume & Extract Facts</span>
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
