# AI-Assisted Portfolio Generator

Transforms candidate resumes (PDF, DOCX, TXT) into verified, interactive, and responsive portfolio websites with live style switching, Gemini AI parsing, and multi-format exports (ZIP bundles, offline standalone HTML, vector print PDF, and JSON schemas).

---

## 🚀 One-Click Deploy to Vercel

### Step 1: Push Repository to GitHub
1. In Google AI Studio, export the repository to your GitHub account using the top-right menu (`Export to GitHub`).
2. Alternatively, clone/push this project to a new repository on GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   git push -u origin main
   ```

### Step 2: Import to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." → "Project"**.
2. Select and import your GitHub repository.
3. Vercel will automatically detect the Vite + Serverless Functions configuration via `vercel.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google AI Studio API key (get one for free at [Google AI Studio](https://aistudio.google.com/app/apikey)).
5. Click **Deploy**.

---

## 🛠️ Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY="your_api_key_here"`.

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 📦 Project Architecture
- `src/`: React 19 Frontend with Tailwind CSS & Motion animations
- `server/app.ts`: Unified Express backend handling resume parsing, AI verification, and style generation
- `api/index.ts`: Vercel Serverless Function entry point for `/api/*` endpoints
- `server.ts`: Local development & standalone Node.js server
- `vercel.json`: Vercel routing and build configuration
