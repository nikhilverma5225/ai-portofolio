export interface SampleResume {
  id: string;
  name: string;
  stream: string;
  role: string;
  badge: string;
  photoUrl?: string;
  text: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: "software-engineer",
    name: "Alex Rivera",
    stream: "Software Engineering & AI",
    role: "Senior Full-Stack & ML Systems Engineer",
    badge: "Tech / AI",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    text: `ALEX RIVERA
Email: alex.rivera@cloudtech.dev | Phone: +1 (415) 890-2134 | Location: San Francisco, CA
GitHub: github.com/alexrivera-cloud | LinkedIn: linkedin.com/in/alex-rivera-tech | Portfolio: https://alexrivera.dev

PROFESSIONAL SUMMARY
Senior Full-Stack & Machine Learning Systems Engineer with 6+ years of production experience architecting real-time distributed systems, high-throughput microservices, and LLM orchestration pipelines. Led multi-disciplinary teams in scaling applications serving 4M+ active users with 99.98% uptime.

CORE SKILLS
- Programming: TypeScript, Python, Go, Rust, SQL, Bash
- Frontend & UI: React 19, Next.js, Tailwind CSS, WebSockets, Three.js
- Backend & Distributed Systems: Node.js, FastAPI, gRPC, Kafka, Redis, PostgreSQL
- Cloud & MLOps: Google Cloud Platform (GCP), Kubernetes, Docker, Terraform, PyTorch, Gemini API, LangChain

PROFESSIONAL EXPERIENCE
Senior Systems Engineer | Nexus Distributed Labs | San Francisco, CA
June 2022 – Present
- Architected an event-driven AI document intelligence pipeline using Python, FastAPI, and Gemini 3 Flash, reducing document audit times from 4 hours to 18 seconds across 120,000 monthly enterprise files.
- Scaled core ingestion services from 15,000 to 95,000 requests/sec with Node.js, Redis clusters, and Go microservices.
- Mentored 7 junior and mid-level engineers in distributed system patterns and test-driven development.

Full-Stack Engineer | Horizon Data Platforms | Austin, TX
August 2019 – May 2022
- Developed reactive analytics dashboards utilizing React, TypeScript, and D3.js, cutting query latency by 42%.
- Designed database partitioning strategies in PostgreSQL that supported 100M+ real-time time-series telemetry events.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2015 – 2019
GPA: 3.86 / 4.0 (Magna Cum Laude)

NOTABLE PROJECTS
- VertexStream: High-performance open-source streaming gateway built in Rust and Go with over 2,400 GitHub stars. (GitHub: github.com/alexrivera-cloud/vertexstream)
- SynapseAI: Autonomous code review assistant powered by Gemini API that automates PR quality checks. (URL: https://synapseai.io)

CERTIFICATIONS & AWARDS
- Google Cloud Certified: Professional Cloud Architect (2023)
- First Place Winner – Global Distributed Systems Hackathon 2022`
  },
  {
    id: "financial-analyst",
    name: "Elena Rostova",
    stream: "Corporate Finance & Investment",
    role: "Senior Corporate Financial Analyst & Quantitative Modeler",
    badge: "Finance",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    text: `ELENA ROSTOVA, CFA
Email: elena.rostova@capstrategy.com | Phone: +1 (212) 670-8842 | Location: New York, NY
LinkedIn: linkedin.com/in/elena-rostova-cfa

EXECUTIVE SUMMARY
Results-oriented Corporate Financial Analyst and CFA Charterholder with 5+ years of experience in financial planning & analysis (FP&A), discounted cash flow (DCF) valuation, mergers & acquisitions due diligence, and quantitative risk modeling. Successfully structured financial forecasts for $450M+ capital allocations.

CORE COMPETENCIES
- Financial Modeling & Valuation: DCF, LBO, M&A Modeling, Scenario & Sensitivity Analysis, Monte Carlo Simulations
- Reporting & Analytics: Advanced Excel (VBA/Macros), Power BI, Tableau, Bloomberg Terminal, FactSet, SQL
- Strategy & Compliance: GAAP/IFRS Standards, Capital Budgeting, Variance Analysis, Investor Relations

PROFESSIONAL EXPERIENCE
Senior FP&A Analyst | Vanguard Capital Partners | New York, NY
January 2021 – Present
- Built automated financial models for $280M multi-asset private equity fund, improving quarterly budgeting accuracy by 34%.
- Conducted M&A financial due diligence on 8 enterprise acquisitions valued at $450M total enterprise value.
- Prepared board presentations and executive variance dashboards for C-suite leadership and institutional investors.

Financial Analyst | Meridian Global Advisory | Boston, MA
July 2018 – December 2020
- Evaluated corporate liquidity, working capital requirements, and debt restructuring for 14 Fortune 500 corporate clients.
- Automated weekly treasury reports using Python and SQL, saving 15 manual analyst hours per week.

EDUCATION
Master of Science in Financial Engineering (MSFE)
Columbia University | 2017 – 2018
Bachelor of Science in Finance & Applied Economics
New York University (Stern School of Business) | 2013 – 2017
Dean's Honor List | GPA: 3.91 / 4.0

CERTIFICATIONS & CREDENTIALS
- CFA Charterholder – CFA Institute (2021)
- Financial Risk Manager (FRM) – GARP (2022)`
  },
  {
    id: "biomedical-researcher",
    name: "Dr. Marcus Vance",
    stream: "Healthcare, Medicine & Biological Sciences",
    role: "Translational Oncology & Clinical Research Scientist",
    badge: "Medical / Bio",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    text: `DR. MARCUS VANCE, Ph.D.
Email: marcus.vance@bioscience-res.org | Phone: +1 (617) 555-0199 | Location: Boston, MA
LinkedIn: linkedin.com/in/dr-marcus-vance-oncology | Portfolio: https://scholar.google.com/citations?user=marcusvance

SCIENTIFIC SUMMARY
Translational Oncology and Genomics Research Scientist with 7+ years of laboratory and clinical trial experience specializing in biomarker discovery, targeted immunotherapies, and next-generation sequencing (NGS) data pipelines. Author of 12 peer-reviewed scientific publications with 680+ citations.

RESEARCH EXPERTISE & METHODOLOGIES
- Laboratory Techniques: Flow Cytometry, CRISPR-Cas9 Gene Editing, Western Blotting, Cell Culture, RT-qPCR, ELISA
- Computational Biology: Python (BioPython, Scanpy), R (Bioconductor), RNA-Seq pipeline analysis, Docker
- Clinical Research: FDA Regulatory Guidelines, GCP/ICH protocols, IRB submissions, Phase I/II trial management

PROFESSIONAL RESEARCH EXPERIENCE
Lead Translational Scientist | Dana-Farber Cancer Institute | Boston, MA
October 2020 – Present
- Spearheaded genomic profiling for a 150-patient Phase II immunotherapy clinical trial, identifying 3 novel prognostic mRNA biomarkers.
- Engineered automated single-cell RNA sequencing pipelines in R/Python, accelerating sample turnaround times by 50%.
- Authored and secured a $1.2M NIH R01 research grant for targeted colorectal cancer therapy investigation.

Postdoctoral Research Fellow | Harvard Medical School | Boston, MA
June 2018 – September 2020
- Investigated resistance mechanisms in T-cell receptor therapies utilizing CRISPR loss-of-function screening.
- Published 4 first-author manuscripts in Nature Communications and Cancer Research.

EDUCATION
Ph.D. in Molecular Genetics & Cellular Biology
Johns Hopkins University School of Medicine | 2013 – 2018
Bachelor of Science in Biochemistry
University of Michigan, Ann Arbor | 2009 – 2013 | Summa Cum Laude

PUBLICATIONS & HONORS
- Young Investigator Award – American Association for Cancer Research (AACR, 2022)
- NIH Kirschstein Pre-Doctoral Fellowship (F31) Recipient`
  },
  {
    id: "creative-director",
    name: "Maya Lin",
    stream: "Creative Media, Product Design & Arts",
    role: "Principal Product Designer & Creative Director",
    badge: "Design",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    text: `MAYA LIN
Email: maya.lin@studio-prism.design | Location: Seattle, WA
Portfolio: https://mayalin.design | LinkedIn: linkedin.com/in/mayalindesign | Dribbble: dribbble.com/mayalin

DESIGN SUMMARY
Principal Product Designer and Design Systems Architect with 8+ years transforming complex enterprise software into intuitive, human-centered digital experiences. Champion of accessible, WCAG AAA compliant design languages and cross-functional design-engineering velocity.

DESIGN SKILLS & TOOLKIT
- Design Disciplines: Design Systems, End-to-End UX/UI, Rapid Prototyping, User Research, Motion Design, Information Architecture
- Tools & Software: Figma (Variables, Auto-layout), Adobe Creative Cloud, Framer, Principle, Cinema 4D
- Technical Fluency: HTML5/CSS3, Tailwind CSS, Design Token Architecture, React UI Component Specs

WORK EXPERIENCE
Principal Product Designer | Prism Studio & Technology | Seattle, WA
March 2021 – Present
- Designed unified multi-platform design system utilized by 45+ product teams across web, iOS, and Android ecosystems.
- Led UX overhaul of enterprise collaboration suite, driving 28% increase in daily active engagement and 40% reduction in customer support tickets.
- Directed user research studies with 200+ enterprise customers across North America and Europe.

Senior UX/UI Designer | Atmos Interactive | San Francisco, CA
August 2017 – February 2021
- Created flagship mobile financial application with 1.8M active downloads and 4.9-star App Store rating.
- Built reusable animation and micro-interaction specifications adopted company-wide.

EDUCATION
Bachelor of Fine Arts (BFA) in Graphic Design & Human-Computer Interaction
Rhode Island School of Design (RISD) | 2013 – 2017

HONORS & AWARDS
- Red Dot Best of the Best Design Award (2022)
- Awwwards Site of the Day Winner (2021)`
  }
];
