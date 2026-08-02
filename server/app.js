import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import formRoutes from "./routes/formRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// ---------- Global middleware ----------
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Routes ----------
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use("/api/form", formRoutes);

// ---------- Error handling ----------
app.use(notFound);
app.use(errorHandler);

export default app;

