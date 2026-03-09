import { createHmac } from "crypto";
import {
  CreateOrderInputDTO,
  CreateOrderOutputDTO,
  ProcessWebhookInputDTO,
  ProcessWebhookOutputDTO,
} from "./payment.dto";
import type { ICreditRepository } from "../credit/credit.repository";
import { BadRequestError, NotFoundError } from "../../utils";
import { logger } from "../../utils";

// Prisma and Razorpay type definitions (clients will be injected at runtime)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaClient = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RazorpayClient = any;

export interface IPaymentService {
  createOrder(input: CreateOrderInputDTO): Promise<CreateOrderOutputDTO>;
  verifyWebhookSignature(input: { payload: string; signature: string; secret: string }): boolean;
  processWebhook(input: ProcessWebhookInputDTO): Promise<ProcessWebhookOutputDTO>;
}

export class PaymentService implements IPaymentService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly creditRepository: ICreditRepository,
    private readonly razorpayClient: RazorpayClient,
    private readonly razorpayKeyId: string
  ) {}

  /**
   * Create a Razorpay order for credit pack purchase
   * Returns order ID and metadata needed for client SDK
   */
  async createOrder(input: CreateOrderInputDTO): Promise<CreateOrderOutputDTO> {
    try {
      // Fetch the credit pack
      const creditPack = await this.prisma.pricingTier.findUnique({
        where: { id: input.creditPackId },
      });

      if (!creditPack || !creditPack.isActive) {
        throw new NotFoundError("Credit pack not found or inactive", "PACK_NOT_FOUND");
      }

      // Fetch user to ensure they exist
      const user = await this.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new NotFoundError("User not found", "USER_NOT_FOUND");
      }

      // Create Razorpay order
      // Amount must be in paise (smallest unit)
      const amountInPaise = Math.round(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (creditPack.priceInr as any) * 100
      );

      const razorpayOrder = await this.razorpayClient.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${input.userId}_${Date.now()}`,
        notes: {
          userId: input.userId,
          creditPackId: input.creditPackId,
          packName: creditPack.tierName,
        },
      });

      logger.info("Razorpay order created", {
        orderId: razorpayOrder.id,
        userId: input.userId,
        creditPackId: input.creditPackId,
        amount: amountInPaise,
      });

      return {
        orderId: razorpayOrder.id,
        amount: amountInPaise,
        keyId: this.razorpayKeyId,
        currency: "INR",
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error("Failed to create Razorpay order", {
        error: error.message,
        userId: input.userId,
        creditPackId: input.creditPackId,
      });
      throw error;
    }
  }

  /**
   * Verify HMAC-SHA256 webhook signature
   * Prevents tampered payloads from being processed
   */
  verifyWebhookSignature(input: { payload: string; signature: string; secret: string }): boolean {
    try {
      // Razorpay signature = HMAC-SHA256(body, secret)
      const hash = createHmac("sha256", input.secret).update(input.payload).digest("hex");

      const isValid = hash === input.signature;

      if (!isValid) {
        logger.warn("Webhook signature verification failed", {
          providedSignature: input.signature,
          calculatedHash: hash,
        });
      }

      return isValid;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error("Webhook signature verification error", {
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Process webhook payload
   * Ensures idempotency: duplicate payloads won't create duplicate credits
   */
  async processWebhook(input: ProcessWebhookInputDTO): Promise<ProcessWebhookOutputDTO> {
    try {
      // Only process captured payments
      if (input.status !== "captured") {
        logger.info("Webhook ignored - payment not captured", {
          orderId: input.orderId,
          status: input.status,
          paymentId: input.razorpayPaymentId,
        });

        return {
          success: true,
          message: "Webhook processed - payment status not captured, no action taken",
        };
      }

      // Check if this payment was already processed (idempotency)
      const existingTransaction = await this.prisma.creditTransaction.findFirst({
        where: {
          razorpayPaymentId: input.razorpayPaymentId,
        },
      });

      if (existingTransaction) {
        logger.warn("Duplicate webhook received - already processed", {
          paymentId: input.razorpayPaymentId,
          transactionId: existingTransaction.id,
        });

        return {
          success: true,
          message: "Webhook already processed - idempotent response",
          idempotent: true,
        };
      }

      // Fetch order from Razorpay to verify order details
      const order = await this.razorpayClient.orders.fetch(input.orderId);

      if (!order.notes || typeof order.notes !== "object") {
        throw new BadRequestError("Invalid order notes structure", "INVALID_ORDER");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const notes = order.notes as Record<string, any>;
      const userId = notes.userId;
      const creditPackId = notes.creditPackId;

      if (!userId || !creditPackId) {
        throw new BadRequestError("Order missing user or pack information", "INVALID_ORDER");
      }

      // Verify user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError("User not found", "USER_NOT_FOUND");
      }

      // Fetch credit pack to get credit amount
      const creditPack = await this.prisma.pricingTier.findUnique({
        where: { id: creditPackId },
      });

      if (!creditPack) {
        throw new NotFoundError("Credit pack not found", "PACK_NOT_FOUND");
      }

      // Calculate total credits (base + bonus)
      const totalCredits = creditPack.credits + creditPack.bonusCredits;

      // Add credits and create transaction record in one atomic operation
      const result = await this.creditRepository.addCredits(userId, totalCredits, "purchase", {
        razorpayPaymentId: input.razorpayPaymentId,
        paymentGatewayId: input.orderId,
        paymentAmountInr: Number(input.amount) / 100, // Convert from paise to INR
        paymentStatus: "captured",
        notes: `Purchase of ${creditPack.tierName} pack`,
      });

      logger.info("Payment processed successfully", {
        paymentId: input.razorpayPaymentId,
        orderId: input.orderId,
        userId,
        creditsAdded: totalCredits,
        newBalance: result.newBalance,
        amount: input.amount,
      });

      return {
        success: true,
        message: "Payment processed and credits added",
        creditAdded: totalCredits,
        newBalance: result.newBalance,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error("Error processing webhook", {
        error: error.message,
        paymentId: input.razorpayPaymentId,
        orderId: input.orderId,
      });
      throw error;
    }
  }
}
