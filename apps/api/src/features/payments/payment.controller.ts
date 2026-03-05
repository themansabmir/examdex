import type { Request, Response } from "express";
import type { IPaymentService } from "./payment.service";
import { CreateOrderOutputDTO } from "./payment.dto";
import { asyncHandler } from "../../utils/async-handler";
import { UnauthorizedError, BadRequestError } from "../../utils";
import { logger } from "../../utils";

export class PaymentController {
  constructor(private readonly paymentService: IPaymentService) {}

  /**
   * POST /payments/create-order
   * Create a Razorpay order for credit pack purchase
   * Authenticated route - requires valid JWT
   */
  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError("User not authenticated", "UNAUTHORIZED");
    }

    const { creditPackId } = req.body;

    if (!creditPackId || typeof creditPackId !== "string") {
      throw new BadRequestError("creditPackId is required and must be a string", "INVALID_INPUT");
    }

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
}
