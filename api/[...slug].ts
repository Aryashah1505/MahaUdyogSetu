import app from "../server";

export default function handler(req: any, res: any) {
  // Normalize req.url to ensure it begins with /api for Express routing
  if (req.url && !req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
  }

  return app(req, res);
}

export { app };
