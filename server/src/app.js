import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import apiRouter from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mediaDir = path.resolve(__dirname, "../public/media");

export function createApp() {
  const app = express();

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    })
  );
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/media", express.static(mediaDir));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
