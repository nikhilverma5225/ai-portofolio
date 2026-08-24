import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResumeData, 
  VerificationResult, 
  PortfolioConfig, 
  ApiHealthStatus, 
  ThemeType, 
  AccentColor, 
  PersonaTone 
} from "./types";
import { SAMPLE_RESUMES, SampleResume } from "./data/sampleResumes";
import { Header } from "./components/Header";
import { StepNavigation } from "./components/StepNavigation";
import { ResumeInputStep } from "./components/ResumeInputStep";
import { ExportStep } from "./components/ExportStep";
import { LoadingOverlay } from "./components/LoadingOverlay";

const INITIAL_CONFIG: PortfolioConfig = {
  theme: "modern-dark",
  accent: "blue",
  font: "sans",
  persona: "tech-innovator",
  sectionVisibility: {
    hero: true,
    about: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
    certifications: true,
    achievements: true,
    contact: true,
    evidenceBadge: true,
  },
  showPhoto: true,
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [apiHealth, setApiHealth] = useState<ApiHealthStatus | null>(null);
  const [checkingHealth, setCheckingHealth] = useState<boolean>(false);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [config, setConfig] = useState<PortfolioConfig>(INITIAL_CONFIG);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingFileName, setAnalyzingFileName] = useState<string | undefined>(undefined);
  const [analysisProgress, setAnalysisProgress] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check API health on mount
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await fetch("/api/health");
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        setApiHealth(data);
      } else {
        const text = await res.text();
        setApiHealth({
          ok: false,
          model: "gemini-3.7-flash",
          maskedKey: "Dev Server Starting",
          latencyMs: 0,
          error: "API server is initializing. Please refresh in a moment.",
        });
      }
    } catch (err: any) {
      setApiHealth({
        ok: false,
        model: "gemini-3.7-flash",
        maskedKey: "Connection Error",
        latencyMs: 0,
        error: "Unable to reach server API health endpoint.",
      });
    } finally {
      setCheckingHealth(false);
    }
  };

  const handleAnalyzeResume = async (payload: {
    text?: string;
    fileBase64?: string;
    mimeType?: string;
    fileName?: string;
    photoBase64?: string;
    stream: string;
  }) => {
    setIsAnalyzing(true);
    setAnalyzingFileName(payload.fileName || (payload.text ? "Pasted Resume Text" : undefined));
    setErrorMessage(null);
    setAnalysisProgress("Extracting multi-stream factual schema via Gemini AI...");

    try {
      const extractRes = await fetch("/api/extract-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let extractJson: any;
      const contentType = extractRes.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        extractJson = await extractRes.json();
      } else {
        const rawText = await extractRes.text();
        throw new Error(
          `Server Error (${extractRes.status}): Please ensure your Google AI Studio Gemini API Key is valid.`
        );
      }

      if (!extractRes.ok || !extractJson.success) {
        throw new Error(
          extractJson.error || "❌ Invalid or Missing Google AI Studio API Key. Please verify your API key."
        );
      }

      const extracted: ResumeData = extractJson.data;
      if (payload.photoBase64) {
        extracted.profile_image_base64 = payload.photoBase64;
      }

      setResumeData(extracted);
      setAnalysisProgress("Performing zero-hallucination factual audit...");

      // Trigger claim verification
      try {
        const verifyRes = await fetch("/api/verify-claims", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeData: extracted,
            sourceText: payload.text || extracted.raw_text,
          }),
        });

        const verifyContentType = verifyRes.headers.get("content-type") || "";
        if (verifyContentType.includes("application/json")) {
          const verifyJson = await verifyRes.json();
          if (verifyRes.ok && verifyJson.success) {
            setVerificationResult(verifyJson.result);
          }
        }
      } catch (verifyErr) {
        console.warn("Factual verification warning:", verifyErr);
      }

      setCurrentStep(2);
    } catch (err: any) {
      console.error("Resume Extraction Error:", err);
      setErrorMessage(
        err.message || "❌ Invalid or Missing Google AI Studio API Key. Please configure your API key from https://aistudio.google.com/app/apikey"
      );
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress("");
    }
  };

  const handleReverify = async () => {
    if (!resumeData) return;
    setIsVerifying(true);
    try {
      const res = await fetch("/api/verify-claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          sourceText: resumeData.raw_text,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVerificationResult(data.result);
      }
    } catch (err) {
      console.error("Re-verification error:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRefineWithAI = async (persona: PersonaTone) => {
    if (!resumeData) return;
    setIsRefining(true);
    try {
      const res = await fetch("/api/generate-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          persona,
          theme: config.theme,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setConfig({
          ...config,
          customHeadline: json.data.hero_headline || config.customHeadline,
          customSummary: json.data.about_text || config.customSummary,
        });
      }
    } catch (err) {
      console.error("AI copy refinement error:", err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleLoadSample = async (sample: SampleResume) => {
    handleAnalyzeResume({
      text: sample.text,
      stream: sample.stream,
      photoBase64: sample.photoUrl || photoBase64 || undefined,
    });
  };

  const handleReset = () => {
    setResumeData(null);
    setVerificationResult(null);
    setPhotoBase64(null);
    setErrorMessage(null);
    setConfig(INITIAL_CONFIG);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-atelier-radial bg-atelier-grid text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      
      {/* Universal Sticky Header */}
      <Header
        apiHealth={apiHealth}
        checkingHealth={checkingHealth}
        onRefreshHealth={checkHealth}
        onLoadSample={handleLoadSample}
        onReset={handleReset}
      />

      {/* 2-Step Streamlined Navigation */}
      <StepNavigation
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        hasExtractedData={!!resumeData}
        hasVerifiedData={!!verificationResult}
      />

      {/* Main Workflow Views with Orchestrated Motion */}
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <ResumeInputStep
                onAnalyze={handleAnalyzeResume}
                isAnalyzing={isAnalyzing}
                analysisProgress={analysisProgress}
                errorMessage={errorMessage}
                photoBase64={photoBase64}
                onPhotoChange={(b64) => {
                  setPhotoBase64(b64);
                  if (resumeData) {
                    setResumeData({ ...resumeData, profile_image_base64: b64 || undefined });
                  }
                }}
              />
            </motion.div>
          )}

          {currentStep === 2 && resumeData && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <ExportStep
                resumeData={resumeData}
                config={config}
                onUpdateConfig={setConfig}
                onUpdateResumeData={setResumeData}
                onRefineWithAI={handleRefineWithAI}
                isRefining={isRefining}
                verificationResult={verificationResult}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Full-screen animated extraction overlay with live messages */}
      <LoadingOverlay
        isLoading={isAnalyzing}
        fileName={analyzingFileName}
      />

    </div>
  );
}
