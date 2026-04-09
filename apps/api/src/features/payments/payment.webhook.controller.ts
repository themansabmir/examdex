import type { Request, Response } from "express";
import { RazorpayWebhookPayload } from "./payment.dto";
import { asyncHandler } from "../../utils/async-handler";
import type { IPaymentWebhookService } from "./payment.webhook.service";

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
  constructor(private readonly paymentWebhookService: IPaymentWebhookService) {}

  /**
   * POST /webhooks/razorpay
   * Receive and process Razorpay webhook events
   * Must verify HMAC-SHA256 signature before processing
   */
  handlePaymentWebhook = asyncHandler(async (req: WebhookRequest, res: Response) => {
    const result = await this.paymentWebhookService.handleWebhook({
      payload: req.body,
      rawBody: req.rawBody,
      signature: req.headers["x-razorpay-signature"],
    });

    res.status(result.statusCode).json(result.body);
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
