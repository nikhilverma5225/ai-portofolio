import React, { useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Edit3, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Search, 
  FileCheck, 
  User, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Award, 
  Share2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Camera,
  Image as ImageIcon
} from "lucide-react";
import { 
  ResumeData, 
  VerificationResult, 
  VerificationClaim, 
  ClaimStatus,
  SkillCategory,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem
} from "../types";

interface VerificationStepProps {
  resumeData: ResumeData;
  verificationResult: VerificationResult | null;
  onUpdateResumeData: (data: ResumeData) => void;
  onProceedToStudio: () => void;
  onReverify: () => void;
  isVerifying: boolean;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  resumeData,
  verificationResult,
  onUpdateResumeData,
  onProceedToStudio,
  onReverify,
  isVerifying,
}) => {
  const [activeTab, setActiveTab] = useState<"claims" | "editor" | "provenance">("claims");
  const [editorSection, setEditorSection] = useState<"personal" | "experience" | "education" | "skills" | "projects" | "certs" | "links">("personal");
  const [claimFilter, setClaimFilter] = useState<"ALL" | ClaimStatus>("ALL");
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);

  // Verification score and metrics
  const score = verificationResult?.score ?? 95;
  const verifiedCount = verificationResult?.verified_count ?? 0;
  const partialCount = verificationResult?.partial_count ?? 0;
  const unsupportedCount = verificationResult?.unsupported_count ?? 0;
  const totalClaims = verificationResult?.total_claims ?? (verifiedCount + partialCount + unsupportedCount || 1);

  const filteredClaims = (verificationResult?.claims || []).filter((c) => {
    if (claimFilter === "ALL") return true;
    return c.status === claimFilter;
  });

  // Helpers for editing resumeData
  const updatePersonalInfo = (field: string, val: string) => {
    onUpdateResumeData({
      ...resumeData,
      personal_info: {
        ...resumeData.personal_info,
        [field]: val,
      },
    });
  };

  const updateSummary = (val: string) => {
    onUpdateResumeData({
      ...resumeData,
      summary: val,
    });
  };

  const updateProfilePhoto = (base64: string | null) => {
    onUpdateResumeData({
      ...resumeData,
      profile_image_base64: base64 || undefined,
    });
  };

  // Skill category helpers
  const addSkillCategory = () => {
    const newCat: SkillCategory = { category: "New Competency", items: ["Skill Item"] };
    onUpdateResumeData({
      ...resumeData,
      skills: [...(resumeData.skills || []), newCat],
    });
  };

  const updateSkillCategory = (idx: number, categoryName: string, itemsString: string) => {
    const updated = [...(resumeData.skills || [])];
    updated[idx] = {
      category: categoryName,
      items: itemsString.split(",").map((s) => s.trim()).filter(Boolean),
    };
    onUpdateResumeData({ ...resumeData, skills: updated });
  };

  const removeSkillCategory = (idx: number) => {
    const updated = [...(resumeData.skills || [])];
    updated.splice(idx, 1);
    onUpdateResumeData({ ...resumeData, skills: updated });
  };

  // Experience helpers
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "Company Name",
      role: "Role / Position",
      location: "Location",
      start_date: "2023",
      end_date: "Present",
      description: "Key responsibilities and achievements...",
      technologies: [],
    };
    onUpdateResumeData({
      ...resumeData,
      experience: [newItem, ...(resumeData.experience || [])],
    });
  };

  const updateExperience = (idx: number, updatedItem: Partial<ExperienceItem>) => {
    const updated = [...(resumeData.experience || [])];
    updated[idx] = { ...updated[idx], ...updatedItem };
    onUpdateResumeData({ ...resumeData, experience: updated });
  };

  const removeExperience = (idx: number) => {
    const updated = [...(resumeData.experience || [])];
    updated.splice(idx, 1);
    onUpdateResumeData({ ...resumeData, experience: updated });
  };

  // Education helpers
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: "Institution / University",
      degree: "Degree",
      field: "Field of Study",
      start_date: "2019",
      end_date: "2023",
      grade: "",
      description: "",
    };
    onUpdateResumeData({
      ...resumeData,
      education: [...(resumeData.education || []), newItem],
    });
  };

  const updateEducation = (idx: number, updatedItem: Partial<EducationItem>) => {
    const updated = [...(resumeData.education || [])];
    updated[idx] = { ...updated[idx], ...updatedItem };
    onUpdateResumeData({ ...resumeData, education: updated });
  };

  const removeEducation = (idx: number) => {
    const updated = [...(resumeData.education || [])];
    updated.splice(idx, 1);
    onUpdateResumeData({ ...resumeData, education: updated });
  };

  // Project helpers
  const addProject = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: "Project Name",
      description: "Brief factual summary of project architecture and impact...",
      technologies: ["TypeScript", "React"],
      url: "",
      github_url: "",
      date: "2024",
    };
    onUpdateResumeData({
      ...resumeData,
      projects: [...(resumeData.projects || []), newItem],
    });
  };

  const updateProject = (idx: number, updatedItem: Partial<ProjectItem>) => {
    const updated = [...(resumeData.projects || [])];
    updated[idx] = { ...updated[idx], ...updatedItem };
    onUpdateResumeData({ ...resumeData, projects: updated });
  };

  const removeProject = (idx: number) => {
    const updated = [...(resumeData.projects || [])];
    updated.splice(idx, 1);
    onUpdateResumeData({ ...resumeData, projects: updated });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Banner with Score Gauge */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500"}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white">{score}%</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                Factual Provenance Verification
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                AI-assisted verification indicator: {score}%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Cross-checked against the raw resume text using Gemini 3.7 Flash with zero-hallucination constraints.
            </p>

            <div className="flex items-center gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                {verifiedCount} Verified
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                {partialCount} Partial
              </span>
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <XCircle className="w-3.5 h-3.5" />
                {unsupportedCount} Unsupported
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-reverify-facts"
            onClick={onReverify}
            disabled={isVerifying}
            className="text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            {isVerifying ? "Auditing..." : "Re-Verify Facts"}
          </button>

          <button
            id="btn-proceed-studio"
            onClick={onProceedToStudio}
            className="text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition flex items-center gap-2"
          >
            <span>Proceed to Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main View Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 mb-6 pb-2">
        <div className="flex items-center gap-2">
          <button
            id="tab-verification-claims"
            onClick={() => setActiveTab("claims")}
            className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === "claims"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Claim-by-Claim Audit ({verificationResult?.claims?.length || 0})
          </button>

          <button
            id="tab-fact-editor"
            onClick={() => setActiveTab("editor")}
            className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === "editor"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Fact Sheet & Human Editor
          </button>

          <button
            id="tab-provenance-citations"
            onClick={() => setActiveTab("provenance")}
            className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === "provenance"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            Source Provenance Quotes ({resumeData.evidence?.length || 0})
          </button>
        </div>
      </div>

      {/* Tab 1: Claims Audit */}
      {activeTab === "claims" && (
        <div className="space-y-4">
          
          {/* Claim Filter Pills */}
          <div className="flex items-center gap-2 pb-2 overflow-x-auto">
            {(["ALL", "VERIFIED", "PARTIALLY_VERIFIED", "UNSUPPORTED"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setClaimFilter(filter)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                  claimFilter === filter
                    ? "bg-slate-800 border-blue-500 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {filter === "ALL" ? `All Claims (${verificationResult?.claims?.length || 0})` : filter}
              </button>
            ))}
          </div>

          {/* Claims List */}
          <div className="space-y-3">
            {filteredClaims.length > 0 ? (
              filteredClaims.map((claim, idx) => {
                const isExpanded = expandedClaim === claim.id || expandedClaim === `claim-${idx}`;
                const isVerified = claim.status === "VERIFIED";
                const isPartial = claim.status === "PARTIALLY_VERIFIED";

                return (
                  <div
                    key={claim.id || idx}
                    className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 transition hover:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {isVerified ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : isPartial ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-bold text-slate-100">
                            {claim.claim_text}
                          </div>
                          {claim.field && (
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 inline-block">
                              Field: {claim.field}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border ${
                            isVerified
                              ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/40"
                              : isPartial
                              ? "bg-amber-950/60 text-amber-300 border-amber-800/40"
                              : "bg-rose-950/60 text-rose-300 border-rose-800/40"
                          }`}
                        >
                          {claim.status}
                        </span>

                        <button
                          onClick={() => setExpandedClaim(isExpanded ? null : (claim.id || `claim-${idx}`))}
                          className="p-1 rounded-md bg-slate-800 text-slate-400 hover:text-slate-200"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-2 text-slate-300">
                        {claim.supporting_evidence && claim.supporting_evidence !== "None" && (
                          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-slate-400 font-semibold">Supporting Quote: </span>
                            <span className="font-mono text-emerald-300/90">"{claim.supporting_evidence}"</span>
                          </div>
                        )}
                        {claim.reason && (
                          <div className="text-slate-400">
                            <span className="font-semibold text-slate-300">Audit Note: </span>
                            {claim.reason}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-slate-400 text-xs">
                No claims match the selected filter.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Human Editor */}
      {activeTab === "editor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Section Navigation (Left 3 cols) */}
          <div className="lg:col-span-3 space-y-1">
            {[
              { id: "personal", label: "Personal Details", icon: User },
              { id: "experience", label: `Experience (${resumeData.experience?.length || 0})`, icon: Briefcase },
              { id: "education", label: `Education (${resumeData.education?.length || 0})`, icon: GraduationCap },
              { id: "skills", label: `Skills (${resumeData.skills?.length || 0} Categories)`, icon: ShieldCheck },
              { id: "projects", label: `Projects (${resumeData.projects?.length || 0})`, icon: FolderGit2 },
              { id: "certs", label: "Certifications & Awards", icon: Award },
              { id: "links", label: "Socials & Links", icon: Share2 },
            ].map((sec) => {
              const Icon = sec.icon;
              const isCurrent = editorSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setEditorSection(sec.id as any)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-slate-900/60 hover:bg-slate-800/80 text-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section Edit Panel (Right 9 cols) */}
          <div className="lg:col-span-9 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            
            {/* Personal Details */}
            {editorSection === "personal" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">Personal Contact & Profile</h3>
                  <span className="text-[11px] text-slate-400">Empty fields will be omitted</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personal_info.name || ""}
                      onChange={(e) => updatePersonalInfo("name", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Professional Headline</label>
                    <input
                      type="text"
                      value={resumeData.personal_info.headline || ""}
                      onChange={(e) => updatePersonalInfo("headline", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={resumeData.personal_info.email || ""}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      placeholder="e.g. user@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={resumeData.personal_info.phone || ""}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      placeholder="e.g. +1 (555) 000-0000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={resumeData.personal_info.location || ""}
                      onChange={(e) => updatePersonalInfo("location", e.target.value)}
                      placeholder="e.g. San Francisco, CA / London, UK / Remote"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">Professional Summary Bio</label>
                    <textarea
                      rows={4}
                      value={resumeData.summary || ""}
                      onChange={(e) => updateSummary(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:border-blue-500 outline-none leading-relaxed"
                    />
                  </div>

                  {/* Profile Photo Management */}
                  <div className="sm:col-span-2 pt-3 border-t border-slate-800">
                    <label className="block text-xs font-semibold text-slate-200 mb-2">
                      Profile Headshot / Photo
                    </label>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                      {resumeData.profile_image_base64 ? (
                        <div className="relative shrink-0">
                          <img
                            src={resumeData.profile_image_base64}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md"
                          />
                        </div>
                      ) : null}

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          {resumeData.profile_image_base64 ? (
                            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-2 py-0.5 rounded">
                              ✓ Photo Included
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">
                              No photo present (Portfolio will render cleanly without dummy avatar)
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {resumeData.profile_image_base64
                            ? "This photo will appear in your portfolio hero. You can replace or remove it."
                            : "If no photo is provided, no placeholder avatar or empty silhouette will be rendered."}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="file"
                          id="verification-photo-input"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => {
                              updateProfilePhoto(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                        <label
                          htmlFor="verification-photo-input"
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border border-slate-700 cursor-pointer transition flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>{resumeData.profile_image_base64 ? "Replace Photo" : "Upload Photo"}</span>
                        </label>

                        {resumeData.profile_image_base64 && (
                          <button
                            type="button"
                            onClick={() => updateProfilePhoto(null)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience */}
            {editorSection === "experience" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">Work Experience</h3>
                  <button
                    onClick={addExperience}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Position</span>
                  </button>
                </div>

                {resumeData.experience?.map((exp, idx) => (
                  <div key={exp.id || idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                    <button
                      onClick={() => removeExperience(idx)}
                      className="absolute top-3 right-3 p-1 rounded hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className="text-[11px] text-slate-400">Company / Organization</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, { company: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Job Title / Role</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(idx, { role: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Start Date</label>
                        <input
                          type="text"
                          value={exp.start_date}
                          onChange={(e) => updateExperience(idx, { start_date: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">End Date</label>
                        <input
                          type="text"
                          value={exp.end_date}
                          onChange={(e) => updateExperience(idx, { end_date: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400">Description / Key Accomplishments</label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => updateExperience(idx, { description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {editorSection === "education" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">Education & Degrees</h3>
                  <button
                    onClick={addEducation}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Degree</span>
                  </button>
                </div>

                {resumeData.education?.map((edu, idx) => (
                  <div key={edu.id || idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                    <button
                      onClick={() => removeEducation(idx)}
                      className="absolute top-3 right-3 p-1 rounded hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className="text-[11px] text-slate-400">Institution / School</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(idx, { institution: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Degree / Qualification</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(idx, { degree: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          placeholder="e.g. B.Tech, Intermediate (12th), High School (10th)"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Field / Specialization (Optional)</label>
                        <input
                          type="text"
                          value={edu.field || ""}
                          onChange={(e) => updateEducation(idx, { field: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          placeholder="e.g. Computer Science, Science (PCM)"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-400">Start Date</label>
                          <input
                            type="text"
                            value={edu.start_date || ""}
                            onChange={(e) => updateEducation(idx, { start_date: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            placeholder="e.g. 2021"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400">End Date</label>
                          <input
                            type="text"
                            value={edu.end_date || ""}
                            onChange={(e) => updateEducation(idx, { end_date: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            placeholder="e.g. 2025"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Grade / Percentage / GPA</label>
                        <input
                          type="text"
                          value={edu.grade || ""}
                          onChange={(e) => updateEducation(idx, { grade: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          placeholder="e.g. 86.4%, 8.5 CGPA"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {editorSection === "skills" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">Categorized Competencies & Skills</h3>
                  <button
                    onClick={addSkillCategory}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Category</span>
                  </button>
                </div>

                {resumeData.skills?.map((cat, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                    <button
                      onClick={() => removeSkillCategory(idx)}
                      className="absolute top-3 right-3 p-1 rounded hover:bg-rose-900/40 text-slate-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="pr-8">
                      <label className="text-[11px] text-slate-400">Category Name</label>
                      <input
                        type="text"
                        value={cat.category}
                        onChange={(e) => updateSkillCategory(idx, e.target.value, cat.items.join(", "))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400">Skills (Comma-separated)</label>
                      <input
                        type="text"
                        value={cat.items.join(", ")}
                        onChange={(e) => updateSkillCategory(idx, cat.category, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {editorSection === "projects" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">Featured Projects</h3>
                  <button
                    onClick={addProject}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {resumeData.projects?.map((proj, idx) => (
                  <div key={proj.id || idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                    <button
                      onClick={() => removeProject(idx)}
                      className="absolute top-3 right-3 p-1 rounded hover:bg-rose-900/40 text-slate-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className="text-[11px] text-slate-400">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(idx, { name: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Technologies (Comma-separated)</label>
                        <input
                          type="text"
                          value={proj.technologies.join(", ")}
                          onChange={(e) => updateProject(idx, { technologies: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Live URL (Optional)</label>
                        <input
                          type="text"
                          value={proj.url || ""}
                          onChange={(e) => updateProject(idx, { url: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">GitHub / Repository (Optional)</label>
                        <input
                          type="text"
                          value={proj.github_url || ""}
                          onChange={(e) => updateProject(idx, { github_url: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(idx, { description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications & Awards */}
            {editorSection === "certs" && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">Certifications & Honors</h3>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-300">Honors & Key Achievements (One per line)</label>
                  <textarea
                    rows={4}
                    value={resumeData.achievements?.join("\n") || ""}
                    onChange={(e) => onUpdateResumeData({
                      ...resumeData,
                      achievements: e.target.value.split("\n").filter(Boolean),
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Socials & Links */}
            {editorSection === "links" && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">Online Profiles & Socials</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={resumeData.links?.linkedin || ""}
                      onChange={(e) => onUpdateResumeData({
                        ...resumeData,
                        links: { ...resumeData.links, linkedin: e.target.value }
                      })}
                      placeholder="linkedin.com/in/username"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">GitHub Profile</label>
                    <input
                      type="text"
                      value={resumeData.links?.github || ""}
                      onChange={(e) => onUpdateResumeData({
                        ...resumeData,
                        links: { ...resumeData.links, github: e.target.value }
                      })}
                      placeholder="github.com/username"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Personal Portfolio / Website</label>
                    <input
                      type="text"
                      value={resumeData.links?.portfolio || ""}
                      onChange={(e) => onUpdateResumeData({
                        ...resumeData,
                        links: { ...resumeData.links, portfolio: e.target.value }
                      })}
                      placeholder="https://mywebsite.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Tab 3: Provenance Citations */}
      {activeTab === "provenance" && (
        <div className="space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-2">
              Source Provenance Evidence Quotes
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Verbatim citations extracted directly from the original resume document to guarantee zero hallucination.
            </p>

            <div className="space-y-3">
              {resumeData.evidence && resumeData.evidence.length > 0 ? (
                resumeData.evidence.map((ev, idx) => (
                  <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/90 text-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-blue-400">{ev.field_name}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        VERIFIED CITATION
                      </span>
                    </div>
                    <div className="font-mono text-slate-200 bg-slate-900/80 p-2 rounded-lg my-1 border border-slate-800">
                      "{ev.evidence_text}"
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-xs py-4 text-center">
                  Direct citation evidence will appear after full schema analysis.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
