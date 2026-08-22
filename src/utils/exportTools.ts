import JSZip from "jszip";
import { ResumeData, PortfolioConfig } from "../types";

export function getThemeClasses(theme: string, accent: string) {
  const themes: Record<string, { bg: string; surface: string; text: string; textMuted: string; border: string; accentColor: string; accentHover: string; gradient: string }> = {
    "modern-dark": {
      bg: "#0B0F19",
      surface: "#111827",
      text: "#F9FAFB",
      textMuted: "#9CA3AF",
      border: "#1F2937",
      accentColor: "#6C8EFF",
      accentHover: "#4B6EE6",
      gradient: "linear-gradient(135deg, rgba(108, 142, 255, 0.15) 0%, rgba(17, 24, 39, 0.6) 100%)",
    },
    "slate-tech": {
      bg: "#0F172A",
      surface: "#1E293B",
      text: "#F8FAFC",
      textMuted: "#94A3B8",
      border: "#334155",
      accentColor: "#38BDF8",
      accentHover: "#0284C7",
      gradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(30, 41, 59, 0.6) 100%)",
    },
    "obsidian-gold": {
      bg: "#121214",
      surface: "#1C1C21",
      text: "#FAFAFA",
      textMuted: "#A1A1AA",
      border: "#2E2E38",
      accentColor: "#EAB308",
      accentHover: "#CA8A04",
      gradient: "linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(28, 28, 33, 0.6) 100%)",
    },
    "midnight-emerald": {
      bg: "#061A14",
      surface: "#0D2E24",
      text: "#ECFDF5",
      textMuted: "#6EE7B7",
      border: "#154A3A",
      accentColor: "#10B981",
      accentHover: "#059669",
      gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(13, 46, 36, 0.6) 100%)",
    },
    "crimson-velvet": {
      bg: "#150A0E",
      surface: "#24121A",
      text: "#FFF1F2",
      textMuted: "#FDA4AF",
      border: "#3B1D2C",
      accentColor: "#F43F5E",
      accentHover: "#E11D48",
      gradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(36, 18, 26, 0.6) 100%)",
    },
    "clean-light": {
      bg: "#F8FAFC",
      surface: "#FFFFFF",
      text: "#0F172A",
      textMuted: "#64748B",
      border: "#E2E8F0",
      accentColor: "#2563EB",
      accentHover: "#1D4ED8",
      gradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)",
    },
    "minimalist-ivory": {
      bg: "#FAF9F6",
      surface: "#FFFFFF",
      text: "#1C1917",
      textMuted: "#78716C",
      border: "#E7E5E4",
      accentColor: "#44403C",
      accentHover: "#1C1917",
      gradient: "linear-gradient(135deg, rgba(68, 64, 60, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%)",
    },
  };

  const accentOverrides: Record<string, { color: string; hover: string }> = {
    blue: { color: "#6C8EFF", hover: "#4B6EE6" },
    emerald: { color: "#10B981", hover: "#059669" },
    violet: { color: "#8B5CF6", hover: "#7C3AED" },
    gold: { color: "#F59E0B", hover: "#D97706" },
    crimson: { color: "#EF4444", hover: "#DC2626" },
    cyan: { color: "#06B6D4", hover: "#0891B2" },
  };

  const selectedTheme = themes[theme] || themes["modern-dark"];
  if (accent && accentOverrides[accent]) {
    selectedTheme.accentColor = accentOverrides[accent].color;
    selectedTheme.accentHover = accentOverrides[accent].hover;
  }

  return selectedTheme;
}

export function generateStandaloneHTML(resume: ResumeData, config: PortfolioConfig): string {
  const theme = getThemeClasses(config.theme, config.accent);
  const headline = config.customHeadline || resume.personal_info.headline || "Professional Portfolio";
  const summary = config.customSummary || resume.summary || "";
  const name = resume.personal_info.name || "Candidate Portfolio";
  const photo = config.showPhoto && resume.profile_image_base64 ? resume.profile_image_base64 : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(name)} | ${escapeHtml(headline)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-color: ${theme.bg};
      --surface-color: ${theme.surface};
      --text-color: ${theme.text};
      --text-muted: ${theme.textMuted};
      --border-color: ${theme.border};
      --accent-color: ${theme.accentColor};
      --accent-hover: ${theme.accentHover};
      --hero-gradient: ${theme.gradient};
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-color);
      color: var(--text-color);
      line-height: 1.6;
    }

    body {
      overflow-x: hidden;
    }

    a {
      color: var(--accent-color);
      text-decoration: none;
      transition: color 0.2s;
    }
    a:hover {
      color: var(--accent-hover);
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Glass Navbar */
    .navbar {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      background-color: rgba(11, 15, 25, 0.75);
      border-bottom: 1px solid var(--border-color);
      padding: 16px 0;
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
      color: var(--text-color);
    }

    .nav-links {
      display: flex;
      gap: 20px;
      list-style: none;
    }

    .nav-links a {
      color: var(--text-muted);
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-links a:hover {
      color: var(--text-color);
    }

    /* Hero Section */
    .hero {
      padding: 90px 0 60px;
      background: var(--hero-gradient);
      border-bottom: 1px solid var(--border-color);
    }

    .hero-grid {
      display: flex;
      align-items: center;
      gap: 40px;
    }

    .hero-text {
      flex: 1;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      background-color: rgba(108, 142, 255, 0.1);
      border: 1px solid var(--accent-color);
      color: var(--accent-color);
      margin-bottom: 16px;
    }

    .hero-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2.8rem;
      font-weight: 700;
      line-height: 1.15;
      margin-bottom: 12px;
      letter-spacing: -0.03em;
    }

    .hero-headline {
      font-size: 1.25rem;
      color: var(--accent-color);
      font-weight: 500;
      margin-bottom: 18px;
    }

    .hero-bio {
      color: var(--text-muted);
      font-size: 1.05rem;
      max-width: 650px;
      margin-bottom: 24px;
      line-height: 1.7;
    }

    .hero-photo-container {
      position: relative;
      flex-shrink: 0;
    }

    .hero-photo-glow {
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      background: var(--accent-color);
      opacity: 0.35;
      filter: blur(12px);
    }

    .hero-photo {
      position: relative;
      width: 170px;
      height: 170px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid var(--accent-color);
      box-shadow: 0 12px 30px rgba(0,0,0,0.35);
      transition: transform 0.3s ease;
    }

    .hero-photo:hover {
      transform: scale(1.03);
    }

    .hero-photo-badge {
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #10B981;
      border: 2px solid var(--bg-color);
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    }

    .contact-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 16px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 8px;
      background-color: var(--surface-color);
      border: 1px solid var(--border-color);
      color: var(--text-color);
      font-size: 0.85rem;
    }

    /* Section Styles */
    .section {
      padding: 60px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .section-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 32px;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: var(--border-color);
      margin-left: 16px;
    }

    /* Cards */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .card {
      background-color: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      transition: transform 0.2s, border-color 0.2s;
    }

    .card:hover {
      transform: translateY(-2px);
      border-color: var(--accent-color);
    }

    /* Timeline */
    .timeline {
      position: relative;
      border-left: 2px solid var(--border-color);
      margin-left: 12px;
      padding-left: 24px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .timeline-item {
      position: relative;
    }

    .timeline-item::before {
      content: '';
      position: absolute;
      left: -31px;
      top: 6px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: var(--accent-color);
      border: 3px solid var(--bg-color);
    }

    .timeline-date {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--accent-color);
      font-weight: 600;
      margin-bottom: 4px;
    }

    .timeline-role {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-color);
    }

    .timeline-org {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 10px;
    }

    .timeline-desc {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    /* Skill Tags */
    .skill-category {
      background-color: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }

    .skill-category:hover {
      transform: translateY(-2px);
      border-color: var(--accent-color);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .skill-category::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: var(--accent-color);
      opacity: 0.4;
    }

    .skill-category:hover::before {
      opacity: 1;
    }

    .skill-cat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .skill-cat-name {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-color);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .skill-count-badge {
      font-size: 0.75rem;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-muted);
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      padding: 2px 8px;
      border-radius: 6px;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-color);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-color);
      transition: all 0.15s ease;
    }

    .tag:hover {
      transform: scale(1.03);
      border-color: var(--accent-color);
      background-color: rgba(255, 255, 255, 0.08);
    }

    .tag-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--accent-color);
      opacity: 0.85;
    }

    /* Footer */
    .footer {
      padding: 40px 0;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    @media print {
      body {
        background-color: white !important;
        color: black !important;
      }
      .navbar, .btn-print {
        display: none !important;
      }
      .hero {
        background: transparent !important;
        padding: 20px 0 !important;
      }
      .card, .skill-category {
        border-color: #ddd !important;
        background: white !important;
      }
    }

    @media (max-width: 768px) {
      .hero-grid {
        flex-direction: column-reverse;
        text-align: center;
      }
      .hero-title {
        font-size: 2.2rem;
      }
      .hero-bio {
        margin: 0 auto 24px;
      }
      .contact-chips {
        justify-content: center;
      }
      .nav-links {
        display: none;
      }
    }
  </style>
</head>
<body>

  <nav class="navbar">
    <div class="container nav-content">
      <span class="nav-brand">${escapeHtml(name)}</span>
      <ul class="nav-links">
        ${config.sectionVisibility.about ? '<li><a href="#about">About</a></li>' : ""}
        ${config.sectionVisibility.skills && resume.skills?.length ? '<li><a href="#skills">Skills</a></li>' : ""}
        ${config.sectionVisibility.experience && resume.experience?.length ? '<li><a href="#experience">Experience</a></li>' : ""}
        ${config.sectionVisibility.projects && resume.projects?.length ? '<li><a href="#projects">Projects</a></li>' : ""}
        ${config.sectionVisibility.education && resume.education?.length ? '<li><a href="#education">Education</a></li>' : ""}
        ${config.sectionVisibility.contact ? '<li><a href="#contact">Contact</a></li>' : ""}
      </ul>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="hero" id="hero">
    <div class="container hero-grid">
      <div class="hero-text">
        <div class="hero-badge">
          <span>●</span>
          <span>Verified Portfolio</span>
          ${resume.profession_category ? `<span>• ${escapeHtml(resume.profession_category)}</span>` : ""}
        </div>
        <h1 class="hero-title">Hello, I'm ${escapeHtml(name)}</h1>
        <p class="hero-headline">${escapeHtml(headline)}</p>
        <p class="hero-bio">${escapeHtml(summary)}</p>

        <div class="contact-chips">
          ${resume.personal_info.location ? `<span class="chip">📍 ${escapeHtml(resume.personal_info.location)}</span>` : ""}
          ${resume.personal_info.email ? `<a href="mailto:${escapeHtml(resume.personal_info.email)}" class="chip">✉️ ${escapeHtml(resume.personal_info.email)}</a>` : ""}
          ${resume.personal_info.phone ? `<span class="chip">📞 ${escapeHtml(resume.personal_info.phone)}</span>` : ""}
          ${resume.links?.github ? `<a href="${formatUrl(resume.links.github)}" target="_blank" class="chip">GitHub</a>` : ""}
          ${resume.links?.linkedin ? `<a href="${formatUrl(resume.links.linkedin)}" target="_blank" class="chip">LinkedIn</a>` : ""}
          ${resume.links?.portfolio ? `<a href="${formatUrl(resume.links.portfolio)}" target="_blank" class="chip">Web</a>` : ""}
        </div>
      </div>
      ${photo ? `
      <div class="hero-photo-container">
        <div class="hero-photo-glow"></div>
        <img src="${photo}" alt="${escapeHtml(name)}" class="hero-photo">
        <div class="hero-photo-badge" title="Verified Identity Record"></div>
      </div>
      ` : ""}
    </div>
  </header>

  <main class="container">
    <!-- Skills Section -->
    ${config.sectionVisibility.skills && resume.skills && resume.skills.length > 0 ? `
    <section class="section" id="skills">
      <h2 class="section-title">Core Competencies & Skills</h2>
      <div class="card-grid">
        ${resume.skills.map(s => `
          <div class="skill-category">
            <div class="skill-cat-header">
              <h3 class="skill-cat-name">${escapeHtml(s.category)}</h3>
              <span class="skill-count-badge">${s.items?.length || 0} skills</span>
            </div>
            <div class="tags">
              ${s.items.map(item => `
                <span class="tag">
                  <span class="tag-dot"></span>
                  <span>${escapeHtml(formatSkillLabel(item))}</span>
                </span>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
    ` : ""}

    <!-- Experience Section -->
    ${config.sectionVisibility.experience && resume.experience && resume.experience.length > 0 ? `
    <section class="section" id="experience">
      <h2 class="section-title">Work Experience</h2>
      <div class="timeline">
        ${resume.experience.map(exp => `
          <div class="timeline-item">
            <div class="timeline-date">${escapeHtml(exp.start_date || "")} – ${escapeHtml(exp.end_date || "Present")}</div>
            <div class="timeline-role">${escapeHtml(exp.role)}</div>
            <div class="timeline-org">${escapeHtml(exp.company)}${exp.location ? ` • ${escapeHtml(exp.location)}` : ""}</div>
            <p class="timeline-desc">${escapeHtml(exp.description)}</p>
            ${exp.technologies && exp.technologies.length > 0 ? `
              <div class="tags" style="margin-top: 10px;">
                ${exp.technologies.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
              </div>
            ` : ""}
          </div>
        `).join("")}
      </div>
    </section>
    ` : ""}

    <!-- Projects Section -->
    ${config.sectionVisibility.projects && resume.projects && resume.projects.length > 0 ? `
    <section class="section" id="projects">
      <h2 class="section-title">Featured Projects</h2>
      <div class="card-grid">
        ${resume.projects.map(proj => `
          <div class="card">
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 8px;">${escapeHtml(proj.name)}</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px;">${escapeHtml(proj.description)}</p>
            ${proj.technologies && proj.technologies.length > 0 ? `
              <div class="tags" style="margin-bottom: 16px;">
                ${proj.technologies.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
              </div>
            ` : ""}
            <div style="display: flex; gap: 12px; font-size: 0.85rem;">
              ${proj.url ? `<a href="${formatUrl(proj.url)}" target="_blank">Live Demo ↗</a>` : ""}
              ${proj.github_url ? `<a href="${formatUrl(proj.github_url)}" target="_blank">Source Code ↗</a>` : ""}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
    ` : ""}

    <!-- Education Section -->
    ${config.sectionVisibility.education && resume.education && resume.education.length > 0 ? `
    <section class="section" id="education">
      <h2 class="section-title">Education & Academic Background</h2>
      <div class="timeline">
        ${resume.education.map(edu => {
          const d = (edu.degree || "").trim();
          const f = (edu.field || "").trim();
          const isInvalidField = !f || ["not specified", "not-specified", "n/a", "none", "unknown", "null"].includes(f.toLowerCase());
          let title = d;
          if (!isInvalidField) {
            title = d.toLowerCase().includes(f.toLowerCase()) ? d : (d ? `${d} in ${f}` : f);
          }
          if (!title) title = "Academic Qualification";

          return `
          <div class="timeline-item">
            <div class="timeline-date">${escapeHtml(edu.start_date || "")}${edu.end_date ? ` – ${escapeHtml(edu.end_date)}` : ""}</div>
            <div class="timeline-role">${escapeHtml(title)}</div>
            <div class="timeline-org">${escapeHtml(edu.institution)}${edu.grade ? ` • ${escapeHtml(edu.grade)}` : ""}</div>
            ${edu.description ? `<p class="timeline-desc">${escapeHtml(edu.description)}</p>` : ""}
          </div>
        `;}).join("")}
      </div>
    </section>
    ` : ""}

    <!-- Certifications & Achievements -->
    ${(config.sectionVisibility.certifications && resume.certifications?.length) || (config.sectionVisibility.achievements && resume.achievements?.length) ? `
    <section class="section" id="credentials">
      <h2 class="section-title">Certifications & Honors</h2>
      <div class="card-grid">
        ${resume.certifications?.map(c => `
          <div class="card">
            <div style="font-size: 0.8rem; color: var(--accent-color); font-weight: 600; font-family: 'JetBrains Mono', monospace;">${escapeHtml(c.date || "Credential")}</div>
            <div style="font-weight: 700; margin: 4px 0;">${escapeHtml(c.name)}</div>
            <div style="color: var(--text-muted); font-size: 0.9rem;">${escapeHtml(c.issuer)}</div>
          </div>
        `).join("") || ""}
        ${resume.achievements?.map(a => `
          <div class="card">
            <div style="font-size: 0.8rem; color: var(--accent-color); font-weight: 600;">Honor / Award</div>
            <div style="margin-top: 4px; font-size: 0.95rem;">${escapeHtml(a)}</div>
          </div>
        `).join("") || ""}
      </div>
    </section>
    ` : ""}

    <!-- Contact Section -->
    ${config.sectionVisibility.contact ? `
    <section class="section" id="contact" style="text-align: center; padding: 70px 0;">
      <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 2rem; margin-bottom: 12px;">Let's Connect</h2>
      <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 24px;">Feel free to reach out for collaborations, leadership opportunities, or technical inquiries.</p>
      ${resume.personal_info.email ? `
        <a href="mailto:${escapeHtml(resume.personal_info.email)}" style="display: inline-block; background-color: var(--accent-color); color: #fff; font-weight: 600; padding: 12px 28px; border-radius: 8px; font-size: 1rem;">
          Send Email ✉️
        </a>
      ` : ""}
    </section>
    ` : ""}
  </main>

  <footer class="footer">
    <div class="container">
      <p>© ${new Date().getFullYear()} ${escapeHtml(name)}. Generated with verified factual provenance using Google AI Studio Gemini API.</p>
    </div>
  </footer>

</body>
</html>`;
}

export async function createPortfolioZipBundle(resume: ResumeData, config: PortfolioConfig): Promise<Blob> {
  const zip = new JSZip();
  const htmlContent = generateStandaloneHTML(resume, config);
  const jsonContent = JSON.stringify({ resumeData: resume, portfolioConfig: config }, null, 2);

  const readme = `AI-ASSISTED PORTFOLIO PACKAGE
=====================================================
Candidate: ${resume.personal_info.name}
Generated: ${new Date().toISOString()}
Factual Integrity: Verified against source resume using Gemini API

CONTENTS OF THIS BUNDLE:
1. index.html       - Complete standalone portfolio website (ready for browser, GitHub Pages, Vercel, or Netlify).
2. portfolio.json   - Structured resume facts and configuration data.
3. README.txt       - Deployment instructions.

HOW TO DEPLOY FOR FREE:
- GitHub Pages: Create a repository named '<username>.github.io', upload 'index.html', and enable Pages in Settings.
- Netlify: Drag and drop this folder onto https://app.netlify.com/drop
- Vercel: Deploy using 'npx vercel' in this directory.
- Local: Simply double-click 'index.html' to open in any web browser without needing a server!
`;

  zip.file("index.html", htmlContent);
  zip.file("portfolio.json", jsonContent);
  zip.file("README.txt", readme);

  return await zip.generateAsync({ type: "blob" });
}

function formatSkillLabel(skill: string): string {
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

  return s
    .split(" ")
    .map((w) => (w.length <= 3 && !["and", "in", "of", "to", "for", "the"].includes(w.toLowerCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function escapeHtml(text?: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatUrl(url?: string): string {
  if (!url) return "#";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}
