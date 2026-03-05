import { prisma } from "../lib";
import { creditRepository } from "./credit.container";
import { env } from "../config/env";
import { PaymentService, PaymentController, PaymentWebhookController } from "../features";
import { logger } from "../utils";

// ============================================
// Razorpay Client Setup
// ============================================

// Dynamic import for Razorpay (CommonJS module)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let razorpayClient: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Razorpay = require("razorpay");

  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    logger.warn("⚠️  Razorpay credentials not configured. Payment features will be unavailable.");
  }

  razorpayClient = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID || "RAZORPAY_KEY_ID_NOT_SET",
    key_secret: env.RAZORPAY_KEY_SECRET || "RAZORPAY_KEY_SECRET_NOT_SET",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  logger.warn("⚠️  Razorpay package not available:", error.message);
}

// ============================================
// Payment Service
// ============================================

export const paymentService = new PaymentService(
  prisma,
  creditRepository,
  razorpayClient,
  env.RAZORPAY_KEY_ID || ""
);

// ============================================
// Payment Controllers
// ============================================

export const paymentController = new PaymentController(paymentService);

export const paymentWebhookController = new PaymentWebhookController(
  paymentService,
  env.RAZORPAY_WEBHOOK_SECRET || ""
);
