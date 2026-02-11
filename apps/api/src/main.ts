import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env, validateEnv } from "./config";
import { connectDatabase, disconnectDatabase } from "./lib";
import { router } from "./routes";
import { errorHandler, notFoundHandler, requestLogger } from "./middleware";
import { logger } from "./utils";

// Validate environment variables
validateEnv();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Cookie parsing
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// Routes

app.use(router);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Graceful shutdown
async function shutdown(signal: string): Promise<void> {
  logger.info(`${signal} received. Shutting down gracefully...`);
  await disconnectDatabase();
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Unhandled rejection handler
process.on("unhandledRejection", (reason: Error) => {
  logger.error("Unhandled Rejection", reason);
  throw reason;
});

// Uncaught exception handler
process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception", error);
  process.exit(1);
});

// Start server
async function bootstrap(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error as Error);
    process.exit(1);
  }
}

if (require.main === module) {
  bootstrap();
}

export { app };
