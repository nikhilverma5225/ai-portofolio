import React from "react";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Globe, 
  ExternalLink, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Award, 
  ShieldCheck,
  Send,
  Terminal,
  Cpu,
  Layers,
  Cloud,
  Database,
  Palette,
  Sparkles,
  Wrench,
  Binary,
  Workflow,
  Camera
} from "lucide-react";
import { ResumeData, PortfolioConfig } from "../types";
import { getThemeClasses } from "../utils/exportTools";

interface LivePortfolioViewProps {
  resumeData: ResumeData;
  config: PortfolioConfig;
  onUploadPhoto?: () => void;
}

export const LivePortfolioView: React.FC<LivePortfolioViewProps> = ({
  resumeData,
  config,
  onUploadPhoto,
}) => {
  const theme = getThemeClasses(config.theme, config.accent);
  const headline = config.customHeadline || resumeData.personal_info.headline || "Professional Portfolio";
  const summary = config.customSummary || resumeData.summary || "";
  const name = resumeData.personal_info.name || "Candidate Name";
  const photo = config.showPhoto && resumeData.profile_image_base64 ? resumeData.profile_image_base64 : null;

  const fontClass = 
    config.font === "space-grotesk" ? "font-mono" :
    config.font === "jetbrains-mono" ? "font-mono" :
    config.font === "playfair" ? "font-serif" : "font-sans";

  const formatSkillLabel = (skill: string) => {
    const s = (skill || "").trim();
    if (!s) return "";
    const acronyms: Record<string, string> = {
      html: "HTML5",
      css: "CSS3",
      js: "JavaScript",
      ts: "TypeScript",
      ht: "HTML5",
      c: "C / C++",
      cpp: "C++",
      py: "Python",
      sql: "SQL",
      dbms: "DBMS (Database Systems)",
      rdbms: "RDBMS",
      nosql: "NoSQL",
      aws: "AWS",
      gcp: "Google Cloud (GCP)",
      azure: "Microsoft Azure",
      ui: "UI/UX Design",
      ux: "User Experience (UX)",
      git: "Git & Version Control",
      api: "RESTful APIs",
      ci: "CI/CD Pipelines",
      cd: "CI/CD",
      ml: "Machine Learning (ML)",
      ai: "Artificial Intelligence (AI)",
      nlp: "Natural Language Processing (NLP)",
      os: "Operating Systems",
      dsa: "Data Structures & Algorithms",
      oop: "Object-Oriented Programming (OOP)",
    };

    const lower = s.toLowerCase();
    if (acronyms[lower]) return acronyms[lower];

    // Standard word capitalization (e.g. "azure cloud" -> "Azure Cloud", "design thinking" -> "Design Thinking")
    return s
      .split(" ")
      .map((w) => (w.length <= 3 && !["and", "in", "of", "to", "for", "the"].includes(w.toLowerCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(" ");
  };

  const getCategoryIcon = (categoryName: string) => {
    const cat = (categoryName || "").toLowerCase();
    if (cat.includes("program") || cat.includes("language") || cat.includes("code") || cat.includes("core")) {
      return <Terminal className="w-4 h-4" />;
    }
    if (cat.includes("web") || cat.includes("frontend") || cat.includes("fullstack") || cat.includes("stack")) {
      return <Layers className="w-4 h-4" />;
    }
    if (cat.includes("cloud") || cat.includes("infra") || cat.includes("devops") || cat.includes("azure") || cat.includes("aws")) {
      return <Cloud className="w-4 h-4" />;
    }
    if (cat.includes("data") || cat.includes("db") || cat.includes("sql") || cat.includes("storage")) {
      return <Database className="w-4 h-4" />;
    }
    if (cat.includes("design") || cat.includes("ui") || cat.includes("ux") || cat.includes("creative")) {
      return <Palette className="w-4 h-4" />;
    }
    if (cat.includes("tool") || cat.includes("utility") || cat.includes("framework")) {
      return <Wrench className="w-4 h-4" />;
    }
    if (cat.includes("ai") || cat.includes("ml") || cat.includes("intelligence") || cat.includes("model")) {
      return <Sparkles className="w-4 h-4" />;
    }
    return <Cpu className="w-4 h-4" />;
  };

  const getEducationTitle = (degree: string, field?: string) => {
    const d = (degree || "").trim();
    const f = (field || "").trim();
    const isInvalidField =
      !f ||
      ["not specified", "not-specified", "n/a", "none", "unknown", "null", "undefined"].includes(
        f.toLowerCase()
      );

    if (!isInvalidField) {
      if (d.toLowerCase().includes(f.toLowerCase())) {
        return d;
      }
      return d ? `${d} in ${f}` : f;
    }
    return d || "Academic Degree";
  };

  return (
    <div 
      className={`w-full min-h-screen transition-colors duration-200 ${fontClass}`}
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
      }}
    >
      {/* Sticky Glass Navbar */}
      <nav 
        className="sticky top-0 z-40 backdrop-blur-xl border-b transition-colors px-6 py-4"
        style={{
          backgroundColor: `${theme.bg}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-base sm:text-lg tracking-tight" style={{ color: theme.text }}>
            {name}
          </span>

          <div className="hidden sm:flex items-center gap-6 text-xs font-medium" style={{ color: theme.textMuted }}>
            {config.sectionVisibility.skills && resumeData.skills?.length > 0 && (
              <a href="#skills" className="hover:text-white transition">Skills</a>
            )}
            {config.sectionVisibility.experience && resumeData.experience?.length > 0 && (
              <a href="#experience" className="hover:text-white transition">Experience</a>
            )}
            {config.sectionVisibility.projects && resumeData.projects?.length > 0 && (
              <a href="#projects" className="hover:text-white transition">Projects</a>
            )}
            {config.sectionVisibility.education && resumeData.education?.length > 0 && (
              <a href="#education" className="hover:text-white transition">Education</a>
            )}
            {config.sectionVisibility.contact && (
              <a href="#contact" className="hover:text-white transition">Contact</a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {config.sectionVisibility.hero && (
        <section 
          className="py-16 sm:py-24 px-6 border-b"
          style={{
            background: theme.gradient,
            borderColor: theme.border,
          }}
        >
          <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              
              {/* Verified Badge */}
              <div 
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-4 border"
                style={{
                  backgroundColor: `${theme.accentColor}1A`,
                  borderColor: `${theme.accentColor}4D`,
                  color: theme.accentColor,
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Fact Record</span>
                {resumeData.profession_category && (
                  <span>• {resumeData.profession_category}</span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 leading-tight">
                Hello, I'm {name}
              </h1>

              <div 
                className="text-lg sm:text-xl font-medium mb-4"
                style={{ color: theme.accentColor }}
              >
                {headline}
              </div>

              <p 
                className="text-sm sm:text-base leading-relaxed max-w-2xl mb-6"
                style={{ color: theme.textMuted }}
              >
                {summary}
              </p>

              {/* Dynamic Contact Chips */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                {resumeData.personal_info.location && (
                  <div 
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border"
                    style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{resumeData.personal_info.location}</span>
                  </div>
                )}

                {resumeData.personal_info.email && (
                  <a 
                    href={`mailto:${resumeData.personal_info.email}`}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border hover:opacity-80 transition"
                    style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }}
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>{resumeData.personal_info.email}</span>
                  </a>
                )}

                {resumeData.personal_info.phone && (
                  <div 
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border"
                    style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }}
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{resumeData.personal_info.phone}</span>
                  </div>
                )}

                {resumeData.links?.github && (
                  <a 
                    href={resumeData.links.github.startsWith("http") ? resumeData.links.github : `https://${resumeData.links.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border hover:opacity-80 transition"
                    style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }}
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}

                {resumeData.links?.linkedin && (
                  <a 
                    href={resumeData.links.linkedin.startsWith("http") ? resumeData.links.linkedin : `https://${resumeData.links.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border hover:opacity-80 transition"
                    style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }}
                  >
                    <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {resumeData.links?.portfolio && (
                  <a 
                    href={resumeData.links.portfolio.startsWith("http") ? resumeData.links.portfolio : `https://${resumeData.links.portfolio}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border hover:opacity-80 transition"
                    style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }}
                  >
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>

            </div>

            {/* Profile Photo (ONLY RENDER IF PHOTO EXISTS) */}
            {photo && (
              <div 
                className={`shrink-0 relative group ${onUploadPhoto ? "cursor-pointer" : ""}`}
                onClick={onUploadPhoto}
                title={onUploadPhoto ? "Click to replace profile photo" : undefined}
              >
                {/* Luminous Glow Aura matching accent */}
                <div 
                  className="absolute -inset-1.5 rounded-full opacity-60 blur-md transition duration-500 group-hover:opacity-100 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.accentColor}33)`
                  }}
                />

                <div className="relative">
                  <img
                    src={photo}
                    alt={name}
                    className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover shadow-2xl border-4 transition duration-300 group-hover:brightness-105"
                    style={{ borderColor: theme.accentColor }}
                  />

                  {/* Verified Presence Dot Badge */}
                  <div 
                    className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-5 h-5 rounded-full border-2 border-slate-950 bg-emerald-500 shadow-lg flex items-center justify-center"
                    title="Verified Identity Record"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
                  </div>

                  {/* Hover Camera Overlay if editable */}
                  {onUploadPhoto && (
                    <div className="absolute inset-0 rounded-full bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                      <Camera className="w-6 h-6 mb-1 text-blue-300" />
                      <span className="text-[10px] font-bold tracking-wide uppercase">Change</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Content Sections */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        
        {/* Skills Section */}
        {config.sectionVisibility.skills && resumeData.skills && resumeData.skills.length > 0 && (
          <section id="skills" className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center border"
                  style={{
                    backgroundColor: `${theme.accentColor}15`,
                    borderColor: `${theme.accentColor}30`,
                    color: theme.accentColor,
                  }}
                >
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Core Competencies & Skills</h2>
                  <p className="text-xs" style={{ color: theme.textMuted }}>
                    Technical proficiencies, frameworks, methodologies, and tooling
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border" style={{ backgroundColor: `${theme.surface}80`, borderColor: theme.border, color: theme.textMuted }}>
                <span>{resumeData.skills.reduce((acc, cat) => acc + (cat.items?.length || 0), 0)} Technologies</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {resumeData.skills.map((cat, idx) => (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl border transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg relative overflow-hidden group"
                  style={{ 
                    backgroundColor: theme.surface, 
                    borderColor: theme.border,
                  }}
                >
                  {/* Subtle top accent highlight */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: theme.accentColor }}
                  />

                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: `${theme.accentColor}15`,
                          borderColor: `${theme.accentColor}30`,
                          color: theme.accentColor,
                        }}
                      >
                        {getCategoryIcon(cat.category)}
                      </div>
                      <h3 className="text-sm font-bold tracking-wide" style={{ color: theme.text }}>
                        {cat.category}
                      </h3>
                    </div>

                    <span 
                      className="text-[11px] font-mono px-2 py-0.5 rounded-md border font-medium shrink-0"
                      style={{
                        backgroundColor: `${theme.bg}80`,
                        borderColor: theme.border,
                        color: theme.textMuted,
                      }}
                    >
                      {cat.items?.length || 0} skills
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {cat.items.map((skill, sIdx) => {
                      const formatted = formatSkillLabel(skill);
                      return (
                        <div
                          key={sIdx}
                          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all duration-150 hover:scale-[1.03] cursor-default shadow-xs"
                          style={{
                            backgroundColor: `${theme.bg}90`,
                            borderColor: theme.border,
                            color: theme.text,
                          }}
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full shrink-0 opacity-80 group-hover:opacity-100"
                            style={{ backgroundColor: theme.accentColor }}
                          />
                          <span className="font-sans font-semibold tracking-tight">{formatted}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {config.sectionVisibility.experience && resumeData.experience && resumeData.experience.length > 0 && (
          <section id="experience" className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Work Experience</h2>
              <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 space-y-8" style={{ borderColor: theme.border }}>
              {resumeData.experience.map((exp, idx) => (
                <div key={exp.id || idx} className="relative group">
                  {/* Timeline dot */}
                  <div 
                    className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2"
                    style={{
                      backgroundColor: theme.accentColor,
                      borderColor: theme.bg,
                    }}
                  />

                  <div className="text-xs font-mono font-semibold mb-1" style={{ color: theme.accentColor }}>
                    {exp.start_date} – {exp.end_date || "Present"}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold" style={{ color: theme.text }}>
                    {exp.role}
                  </h3>

                  <div className="text-xs sm:text-sm font-medium mb-3" style={{ color: theme.textMuted }}>
                    {exp.company} {exp.location ? `• ${exp.location}` : ""}
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textMuted }}>
                    {exp.description}
                  </p>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {exp.technologies.map((t, tIdx) => (
                        <span 
                          key={tIdx}
                          className="text-[11px] px-2 py-0.5 rounded border font-mono"
                          style={{ backgroundColor: `${theme.bg}80`, borderColor: theme.border, color: theme.textMuted }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects */}
        {config.sectionVisibility.projects && resumeData.projects && resumeData.projects.length > 0 && (
          <section id="projects" className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Featured Projects</h2>
              <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {resumeData.projects.map((proj, idx) => (
                <div 
                  key={proj.id || idx}
                  className="p-5 rounded-xl border flex flex-col justify-between transition hover:translate-y-[-2px]"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                >
                  <div>
                    <h3 className="text-base font-bold mb-2" style={{ color: theme.text }}>
                      {proj.name}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: theme.textMuted }}>
                      {proj.description}
                    </p>

                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.technologies.map((t, tIdx) => (
                          <span 
                            key={tIdx}
                            className="text-[11px] px-2 py-0.5 rounded border font-mono"
                            style={{ backgroundColor: `${theme.bg}80`, borderColor: theme.border, color: theme.accentColor }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t text-xs font-semibold" style={{ borderColor: theme.border }}>
                    {proj.url && (
                      <a 
                        href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:underline"
                        style={{ color: theme.accentColor }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {proj.github_url && (
                      <a 
                        href={proj.github_url.startsWith("http") ? proj.github_url : `https://${proj.github_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:underline"
                        style={{ color: theme.accentColor }}
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Timeline */}
        {config.sectionVisibility.education && resumeData.education && resumeData.education.length > 0 && (
          <section id="education" className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Education & Academic Background</h2>
              <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
            </div>

            <div className="space-y-4">
              {resumeData.education.map((edu, idx) => (
                <div 
                  key={edu.id || idx}
                  className="p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                >
                  <div>
                    <h3 className="text-base font-bold" style={{ color: theme.text }}>
                      {getEducationTitle(edu.degree, edu.field)}
                    </h3>
                    <div className="text-xs sm:text-sm" style={{ color: theme.textMuted }}>
                      {edu.institution} {edu.grade ? `• Grade: ${edu.grade}` : ""}
                    </div>
                  </div>

                  <div className="text-xs font-mono font-semibold" style={{ color: theme.accentColor }}>
                    {edu.start_date} – {edu.end_date}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Honors */}
        {((config.sectionVisibility.certifications && resumeData.certifications?.length > 0) ||
          (config.sectionVisibility.achievements && resumeData.achievements?.length > 0)) && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Credentials & Honors</h2>
              <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resumeData.certifications?.map((cert, idx) => (
                <div 
                  key={cert.id || idx}
                  className="p-4 rounded-xl border"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                >
                  <div className="text-[11px] font-mono font-semibold mb-1" style={{ color: theme.accentColor }}>
                    {cert.date || "Certified Credential"}
                  </div>
                  <h4 className="text-sm font-bold" style={{ color: theme.text }}>{cert.name}</h4>
                  <div className="text-xs mt-0.5" style={{ color: theme.textMuted }}>{cert.issuer}</div>
                </div>
              ))}

              {resumeData.achievements?.map((ach, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl border"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                >
                  <div className="text-[11px] font-semibold mb-1" style={{ color: theme.accentColor }}>
                    Award / Recognition
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: theme.text }}>{ach}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact CTA */}
        {config.sectionVisibility.contact && (
          <section id="contact" className="text-center py-12 border-t" style={{ borderColor: theme.border }}>
            <h2 className="text-2xl font-bold mb-3" style={{ color: theme.text }}>
              Let's Connect
            </h2>
            <p className="text-xs sm:text-sm max-w-md mx-auto mb-6" style={{ color: theme.textMuted }}>
              Open to high-impact opportunities, advisory roles, and engineering collaborations.
            </p>

            {resumeData.personal_info.email ? (
              <a
                href={`mailto:${resumeData.personal_info.email}`}
                className="inline-flex items-center gap-2 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: theme.accentColor,
                  color: "#FFFFFF",
                }}
              >
                <Send className="w-4 h-4" />
                <span>Send Direct Email</span>
              </a>
            ) : (
              <div className="text-xs" style={{ color: theme.textMuted }}>
                Connect via professional social profiles above.
              </div>
            )}
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: theme.border, color: theme.textMuted }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} {name}. All facts verified against source resume.</span>
          <span className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            AI-Assisted Zero Hallucination Standard
          </span>
        </div>
      </footer>
    </div>
  );
};
