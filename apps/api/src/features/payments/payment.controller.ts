import type { Request, Response } from "express";
import type { IPaymentService } from "./payment.service";
import { CreateOrderOutputDTO } from "./payment.dto";
import { CreatePaymentOrderInput } from "./payment.schema";
import { asyncHandler } from "../../utils/async-handler";
import { UnauthorizedError } from "../../utils";
import { logger } from "../../utils";

export class PaymentController {
  constructor(private readonly paymentService: IPaymentService) {}

  /**
   * POST /payments/create-order
   * Create a Razorpay order for credit pack purchase
   * Authenticated route - requires valid JWT
   */
  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const userId = this.getAuthenticatedUserId(req);
    const { creditPackId } = req.body as CreatePaymentOrderInput;

    logger.info("Creating payment order", {
      userId,
      creditPackId,
    });

    const orderData: CreateOrderOutputDTO = await this.paymentService.createOrder({
      userId,
      creditPackId,
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: orderData.orderId,
        amount: orderData.amount,
        keyId: orderData.keyId,
        currency: orderData.currency,
      },
    });
  });

  private getAuthenticatedUserId(req: Request): string {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError("User not authenticated", "UNAUTHORIZED");
    }

    return userId;
  }
}
