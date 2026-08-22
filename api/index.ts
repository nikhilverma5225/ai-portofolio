import app from "../server/app";

export default function handler(req: any, res: any) {
  // Ensure req.url includes /api prefix if stripped by Vercel rewrite
  if (req.url && !req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
  }
  return app(req, res);
}

