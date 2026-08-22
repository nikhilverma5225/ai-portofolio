export type ClaimStatus = 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNSUPPORTED';

export interface PersonalInfo {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  grade: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  technologies: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  github_url: string;
  date: string;
  highlight?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Links {
  github: string;
  linkedin: string;
  portfolio: string;
  twitter: string;
  other: string[];
}

export interface EvidenceItem {
  field_name: string;
  value: string;
  evidence_text: string;
  verified: boolean;
}

export interface ResumeData {
  personal_info: PersonalInfo;
  summary: string;
  skills: SkillCategory[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  achievements: string[];
  certifications: CertificationItem[];
  links: Links;
  evidence: EvidenceItem[];
  profession_category: string;
  profile_image_base64?: string;
  raw_text?: string;
}

export interface VerificationClaim {
  id: string;
  claim_text: string;
  field: string;
  status: ClaimStatus;
  supporting_evidence: string;
  reason: string;
}

export interface VerificationResult {
  score: number;
  verified_count: number;
  partial_count: number;
  unsupported_count: number;
  total_claims: number;
  claims: VerificationClaim[];
}

export type ThemeType = 
  | 'modern-dark' 
  | 'slate-tech' 
  | 'obsidian-gold' 
  | 'midnight-emerald' 
  | 'crimson-velvet' 
  | 'clean-light' 
  | 'minimalist-ivory';

export type AccentColor = 'blue' | 'emerald' | 'violet' | 'gold' | 'crimson' | 'cyan';

export type FontFamily = 'sans' | 'space-grotesk' | 'jetbrains-mono' | 'playfair' | 'serif';

export type PersonaTone = 
  | 'tech-innovator' 
  | 'executive-leader' 
  | 'academic-researcher' 
  | 'creative-artisan' 
  | 'concise-minimalist';

export interface SectionVisibility {
  hero: boolean;
  about: boolean;
  skills: boolean;
  experience: boolean;
  projects: boolean;
  education: boolean;
  certifications: boolean;
  achievements: boolean;
  contact: boolean;
  evidenceBadge: boolean;
}

export interface PortfolioConfig {
  theme: ThemeType;
  accent: AccentColor;
  font: FontFamily;
  persona: PersonaTone;
  sectionVisibility: SectionVisibility;
  customHeadline?: string;
  customSummary?: string;
  showPhoto: boolean;
}

export interface ApiHealthStatus {
  ok: boolean;
  model: string;
  maskedKey: string;
  latencyMs: number;
  projectId?: string;
  projectNumber?: string;
  message?: string;
  error?: string;
}
