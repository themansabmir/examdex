import { Router } from "express";
import { paymentWebhookController } from "../container";

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
router.post("/razorpay", (req, res, next) => {
  void paymentWebhookController.handlePaymentWebhook(req, res).catch(next);
});

/**
 * GET /webhooks/razorpay/health
 * Health check endpoint - verify webhook endpoint is active
 */
router.get("/razorpay/health", (req, res, next) => {
  void paymentWebhookController.health(req, res).catch(next);
});

export const webhookRoutes = router;
