import { Router } from "express";
import { paymentController } from "../container";

const router = Router();

/**
 * POST /payments/create-order
 * Create a Razorpay order for credit pack purchase
 * Required: auth token
 * Body: { creditPackId: string }
 * Response: { orderId, amount (paise), keyId, currency }
 */
router.post("/create-order", (req, res, next) => {
  void paymentController.createOrder(req, res).catch(next);
});

export const paymentRoutes = router;
