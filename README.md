# ✨ AI-Assisted Portfolio Generator

Transform a resume into a verified, interactive, and responsive portfolio website — in minutes, not hours.

Upload a resume (PDF, DOCX, or plain text) and the app uses **Google Gemini AI** to extract your professional profile, cross-checks every claim against your original document to guard against hallucination, and generates a fully styled, exportable portfolio site.

**Live demo:** [ai-portofolio.onrender.com](https://ai-portofolio.onrender.com/)

---

## 🧠 How It Works

The app runs a 3-stage AI pipeline rather than a single blind generation step:

1. **Extract** — Your resume is parsed by Gemini into a structured schema (personal info, experience, education, skills, projects, certifications). The model is instructed to treat the resume as untrusted input and never invent missing details — if a field like an email or GitHub link isn't in the resume, it's left blank instead of guessed.
2. **Verify** — A second AI pass audits every extracted claim against the original resume text and labels it `VERIFIED`, `PARTIALLY_VERIFIED`, or `UNSUPPORTED`, producing a factual accuracy score you can see before publishing.
3. **Generate** — A third pass writes tailored portfolio copy (headline, about section, project taglines) matched to a chosen persona — Tech Innovator, Executive Leader, Academic Researcher, Creative Artisan, or Concise Minimalist — without fabricating achievements.

---

## 🚀 Features

- **Multi-format resume input** — PDF, DOCX, or plain text, including automatic profile photo extraction from the document
- **Zero-hallucination extraction** — every extracted field is backed by an evidence quote from the source resume
- **Factual verification audit** — a transparent, scored breakdown of what's confirmed vs. unsupported before you publish
- **Live style switching** — multiple themes (Modern Dark, Slate Tech, Obsidian Gold, Midnight Emerald, Crimson Velvet, Clean Light, Minimalist Ivory), accent colors, and font pairings, previewed in real time
- **Persona-tuned AI copywriting** — regenerate your headline and summary to match the tone you want to project
- **Multi-format export** — download your portfolio as a ZIP bundle, a standalone offline HTML file, a print-ready PDF, or raw JSON
- **Section visibility controls** — toggle hero, about, skills, experience, projects, education, certifications, achievements, and contact sections on or off

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Motion (animation) |
| Backend | Express (Node.js), TypeScript |
| AI | Google Gemini API (`@google/genai`) |
| File processing | Mammoth (DOCX parsing), JSZip (image/export bundling) |
| Deployment | Render (Web Service) |

---

## 📦 Project Architecture

```
├── src/               React 19 frontend (Tailwind CSS + Motion animations)
│   ├── components/    Step-by-step UI: resume input, verification, preview, export
│   ├── data/          Sample resumes used for demos
│   └── types.ts       Shared TypeScript contracts (resume schema, theme config)
├── server/
│   ├── app.ts         Express backend — resume parsing, AI verification, style generation
│   └── imageExtractor.ts  Extracts profile photos embedded in PDF/DOCX resumes
├── api/index.ts       Vercel Serverless Function entry point for /api/* routes
├── server.ts          Standalone local development & production server
└── vercel.json        Vercel routing & build configuration
```

### API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/status` | Basic service status |
| `GET` | `/api/health` | Gemini API key/connection health check |
| `POST` | `/api/extract-resume` | Parses an uploaded resume into structured data |
| `POST` | `/api/verify-claims` | Audits extracted data against the source resume |
| `POST` | `/api/generate-portfolio` | Generates persona-tuned portfolio copy |
| `POST` | `/api/refine-text` | Refines a specific piece of text on request |

---

## 🚀 Deploy to Render

The live demo is hosted on [Render](https://render.com) as a Web Service.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

### Step 2: Create Web Service on Render

1. Go to the [Render Dashboard](https://dashboard.render.com/) → **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `ai-portofolio` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Select your closest region
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` — your Google AI Studio API key ([get one free here](https://aistudio.google.com/app/apikey))
   - `NODE_ENV` — `production`
5. Click **Create Web Service**. Render will automatically build the frontend, bundle the backend, and deploy your live URL (e.g., `https://ai-portofolio.onrender.com`).

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# then add your GEMINI_API_KEY="your_api_key_here" to .env

# 3. Run the dev server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 👥 Team

This project was built as a group bootcamp project by a team of 5 students from **GLA University**:

- **Nikhil Verma**
- **Harsh Verma**
- **Ravikant Singh**
- **Abhinav Dixit**
- **Udit Indoliya**

---

## 📄 License

This project was developed for educational purposes as part of a bootcamp program.
