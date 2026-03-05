import type { Request, Response } from "express";
import type { IPaymentService } from "./payment.service";
import { RazorpayWebhookPayload } from "./payment.dto";
import { asyncHandler } from "../../utils/async-handler";
import { UnauthorizedError, BadRequestError } from "../../utils";
import { logger } from "../../utils";

export interface WebhookRequest extends Request {
  body: RazorpayWebhookPayload;
  rawBody?: Buffer | string;
  headers: {
    "x-razorpay-signature"?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export class PaymentWebhookController {
  constructor(
    private readonly paymentService: IPaymentService,
    private readonly webhookSecret: string
  ) {}

  /**
   * POST /webhooks/razorpay
   * Receive and process Razorpay webhook events
   * Must verify HMAC-SHA256 signature before processing
   */
  handlePaymentWebhook = asyncHandler(async (req: WebhookRequest, res: Response) => {
    const signature = req.headers["x-razorpay-signature"];

    if (!signature || typeof signature !== "string") {
      logger.warn("Webhook received without signature header");
      throw new UnauthorizedError("Webhook signature header required", "MISSING_SIGNATURE");
    }

    logger.debug("Processing Razorpay webhook", {
      event: req.body.event,
      timestamp: new Date((req.body.created_at || 0) * 1000).toISOString(),
    });

    // Verify webhook signature using raw body
    const rawBody =
      typeof req.rawBody === "string"
        ? req.rawBody
        : req.rawBody?.toString() || JSON.stringify(req.body);

    const isSignatureValid = this.paymentService.verifyWebhookSignature({
      payload: rawBody,
      signature,
      secret: this.webhookSecret,
    });

    if (!isSignatureValid) {
      logger.error("Webhook signature verification failed", {
        event: req.body.event,
        providedSignature: signature,
      });

      // Return 401 for invalid signatures as per spec
      res.status(401).json({
        success: false,
        error: {
          code: "INVALID_SIGNATURE",
          message: "Webhook signature verification failed",
        },
      });
      return;
    }

    // Validate webhook payload structure
    if (!req.body.event || !req.body.data) {
      throw new BadRequestError("Invalid webhook payload structure", "INVALID_WEBHOOK_PAYLOAD");
    }

    // Extract payment details
    const { event, data } = req.body;
    const paymentData = data.payment;
    const orderData = data.order;

    if (!paymentData || !paymentData.id || !paymentData.order_id) {
      throw new BadRequestError("Invalid payment data in webhook", "INVALID_PAYMENT_DATA");
    }

    if (!orderData || !orderData.id) {
      throw new BadRequestError("Invalid order data in webhook", "INVALID_ORDER_DATA");
    }

    logger.info("Webhook signature verified", {
      event,
      paymentId: paymentData.id,
      orderId: orderData.id,
      amount: paymentData.amount,
    });

    // Only process payment.captured events
    if (event !== "payment.captured") {
      logger.debug("Webhook event not processed - only payment.captured handled", {
        event,
        paymentId: paymentData.id,
      });

      // Return 200 to acknowledge receipt - don't fail non-capture events
      res.status(200).json({
        success: true,
        message: "Webhook acknowledged",
      });
      return;
    }

    // Process the captured payment
    try {
      const result = await this.paymentService.processWebhook({
        event,
        razorpayPaymentId: paymentData.id,
        orderId: orderData.id,
        amount: paymentData.amount_paid || paymentData.amount,
        status: "captured",
        email: paymentData.email,
        contact: paymentData.contact,
        notes: paymentData.notes,
      });

      logger.info("Webhook processed successfully", {
        paymentId: paymentData.id,
        orderId: orderData.id,
        creditsAdded: result.creditAdded,
        idempotent: result.idempotent,
      });

      // Return 200 to prevent Razorpay redelivery
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          idempotent: result.idempotent,
          creditAdded: result.creditAdded,
          newBalance: result.newBalance,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error("Error processing payment webhook", {
        paymentId: paymentData.id,
        orderId: orderData.id,
        error: error.message,
      });

      // Even on error, return 200 to prevent redelivery. Razorpay will retry.
      res.status(200).json({
        success: false,
        message: "Webhook processing failed but acknowledged",
        error: {
          code: "PROCESSING_ERROR",
          message: error.message,
        },
      });
    }
  });

  /**
   * Health check endpoint for webhooks
   * Verifies webhook endpoint is active
   */
  health = asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Webhook endpoint is active",
      timestamp: new Date().toISOString(),
    });
  });
}
