import { BadRequestError, HttpStatus, UnauthorizedError } from "../../utils";
import { logger } from "../../utils";
import type { RazorpayWebhookPayload } from "./payment.dto";
import type { IPaymentService } from "./payment.service";

export interface HandleWebhookInput {
  payload: RazorpayWebhookPayload;
  rawBody?: Buffer | string;
  signature?: string;
}

export interface HandleWebhookOutput {
  statusCode: HttpStatus;
  body: Record<string, unknown>;
}

export interface IPaymentWebhookService {
  handleWebhook(input: HandleWebhookInput): Promise<HandleWebhookOutput>;
}

export class PaymentWebhookService implements IPaymentWebhookService {
  constructor(
    private readonly paymentService: IPaymentService,
    private readonly webhookSecret: string
  ) {}

  async handleWebhook(input: HandleWebhookInput): Promise<HandleWebhookOutput> {
    if (!input.signature || typeof input.signature !== "string") {
      logger.warn("Webhook received without signature header");
      throw new UnauthorizedError("Webhook signature header required", "MISSING_SIGNATURE");
    }

    logger.debug("Processing Razorpay webhook", {
      event: input.payload.event,
      timestamp: new Date((input.payload.created_at || 0) * 1000).toISOString(),
    });

    const rawBody =
      typeof input.rawBody === "string"
        ? input.rawBody
        : input.rawBody?.toString() || JSON.stringify(input.payload);

    const isSignatureValid = this.paymentService.verifyWebhookSignature({
      payload: rawBody,
      signature: input.signature,
      secret: this.webhookSecret,
    });

    if (!isSignatureValid) {
      logger.error("Webhook signature verification failed", {
        event: input.payload.event,
        providedSignature: input.signature,
      });

      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        body: {
          success: false,
          error: {
            code: "INVALID_SIGNATURE",
            message: "Webhook signature verification failed",
          },
        },
      };
    }

    const { event, data } = input.payload;
    const paymentData = data?.payment;
    const orderData = data?.order;

    if (!event || !data) {
      throw new BadRequestError("Invalid webhook payload structure", "INVALID_WEBHOOK_PAYLOAD");
    }

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

    if (event !== "payment.captured") {
      logger.debug("Webhook event not processed - only payment.captured handled", {
        event,
        paymentId: paymentData.id,
      });

      return {
        statusCode: HttpStatus.OK,
        body: {
          success: true,
          message: "Webhook acknowledged",
        },
      };
    }

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

      return {
        statusCode: HttpStatus.OK,
        body: {
          success: true,
          message: result.message,
          data: {
            idempotent: result.idempotent,
            creditAdded: result.creditAdded,
            newBalance: result.newBalance,
          },
        },
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown webhook processing error";

      logger.error("Error processing payment webhook", {
        paymentId: paymentData.id,
        orderId: orderData.id,
        error: message,
      });

      return {
        statusCode: HttpStatus.OK,
        body: {
          success: false,
          message: "Webhook processing failed but acknowledged",
          error: {
            code: "PROCESSING_ERROR",
            message,
          },
        },
      };
    }
  }
}
