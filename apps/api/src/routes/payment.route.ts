import { Router } from "express";
import { paymentController } from "../container";
import { validateBody } from "../middleware";
import { createPaymentOrderSchema } from "../features/payments/payment.schema";

const router = Router();

/**
 * POST /payments/create-order
 * Create a Razorpay order for credit pack purchase
 * Required: auth token
 * Body: { creditPackId: string }
 * Response: { orderId, amount (paise), keyId, currency }
 */
router.post("/create-order", validateBody(createPaymentOrderSchema), paymentController.createOrder);

export const paymentRoutes = router;
