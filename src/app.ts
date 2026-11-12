import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import v1Routes from "./api/v1/index";
import { notFound, errorHandler } from "./shared/middlewares/errorHandler";

export const app = express();

app.use(express.json());
app.use(cors());
app.use(compression());
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.use(morgan("dev"));

// 1. Servir archivos estáticos ANTES de notFound
app.use(express.static(path.join(process.cwd(), "public")));

// Health check
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// 2. Rutas de la API
app.use("/api/v1", v1Routes);

// 3. Manejo de rutas no encontradas y errores (siempre al final)
app.use(notFound);
app.use(errorHandler);