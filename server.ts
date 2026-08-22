import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import app from "./server/app";

const PORT = 3000;

async function startServer() {
  // In development, hook up Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production container (Cloud Run / Docker), serve built static files from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio Generator Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
