import { z } from "zod";

/**
 * Shared Business Constants
 */
export const APP_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  AUTH: {
    TOKEN_EXPIRY: "1d",
    BCRYPT_SALT_ROUNDS: 10,
  },
  EXAMS: {
    MIN_PASSING_SCORE: 40,
    MAX_SCORE: 100,
  },
} as const;

/**
 * Shared Environment Validation Schemas
 * Use these in apps to ensure ENV variables are set correctly
 */
export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).default("3000"),
});

export const apiEnvSchema = baseEnvSchema.extend({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10).optional(),
});
