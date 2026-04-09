import { Router } from "express";
import { paymentWebhookController } from "../container";
import { validateBody } from "../middleware";
import { razorpayWebhookSchema } from "../features/payments/payment.schema";

const router = Router();

/**
 * POST /webhooks/razorpay
 * Receive Razorpay webhook events
 * Signature verification is done via HMAC-SHA256
 * No authentication token required (Razorpay's signature is verification)
 * Events handled:
 *   - payment.captured: Credits are added to user balance
 *   - payment.failed: Logged, no action taken
 *   - Other events: Acknowledged but not processed
 */
router.post(
  "/razorpay",
  validateBody(razorpayWebhookSchema),
  paymentWebhookController.handlePaymentWebhook
);

/**
 * GET /webhooks/razorpay/health
 * Health check endpoint - verify webhook endpoint is active
 */
router.get("/razorpay/health", paymentWebhookController.health);

export const webhookRoutes = router;
