import type { ICreditRepository } from "./credit.repository";
import type {
  GetBalanceOutputDTO,
  DeductCreditOutputDTO,
  AddCreditsInputDTO,
  AddCreditsOutputDTO,
  GetTransactionsInputDTO,
  GetTransactionsOutputDTO,
  CreditTransactionOutputDTO,
  VerifyLedgerIntegrityOutputDTO,
} from "./credit.dto";
import { BadRequestError, PaymentRequiredError } from "../../utils";

export interface ICreditService {
  getBalance(userId: string): Promise<GetBalanceOutputDTO>;
  deductCredit(
    userId: string,
    relatedPaperId: string,
    notes?: string
  ): Promise<DeductCreditOutputDTO>;
  addCredits(input: AddCreditsInputDTO): Promise<AddCreditsOutputDTO>;
  getTransactionHistory(input: GetTransactionsInputDTO): Promise<GetTransactionsOutputDTO>;
  verifyLedgerIntegrity(userId: string): Promise<VerifyLedgerIntegrityOutputDTO>;
}

export class CreditService implements ICreditService {
  constructor(private readonly creditRepository: ICreditRepository) {}

  async getBalance(userId: string): Promise<GetBalanceOutputDTO> {
    const balance = await this.creditRepository.getBalance(userId);

    return {
      balance,
      userId,
    };
  }

  /**
   * Atomically deduct 1 credit for paper generation
   * Returns notification flag if balance drops to 5 or below
   */
  async deductCredit(
    userId: string,
    relatedPaperId: string,
    notes?: string
  ): Promise<DeductCreditOutputDTO> {
    try {
      const result = await this.creditRepository.deductCreditAtomic(userId, relatedPaperId, notes);

      // Check if we should send low credit notification
      // Notification fires once when dropping from >5 to ≤5
      const shouldNotify = this.shouldSendLowCreditNotification(
        result.previousBalance,
        result.newBalance
      );

      return {
        success: true,
        newBalance: result.newBalance,
        previousBalance: result.previousBalance,
        transactionId: result.transactionId,
        shouldNotify,
      };
    } catch (error: any) {
      if (error.message === "INSUFFICIENT_CREDITS") {
        throw new PaymentRequiredError(
          "Insufficient credits to generate paper",
          "INSUFFICIENT_CREDITS"
        );
      }
      throw error;
    }
  }

  /**
   * Add credits (purchase, bonus, or refund)
   */
  async addCredits(input: AddCreditsInputDTO): Promise<AddCreditsOutputDTO> {
    if (input.amount <= 0) {
      throw new BadRequestError("Amount must be positive", "INVALID_AMOUNT");
    }

    const result = await this.creditRepository.addCredits(
      input.userId,
      input.amount,
      input.transactionType,
      {
        paymentGatewayId: input.paymentGatewayId,
        paymentAmountInr: input.paymentAmountInr,
        paymentStatus: input.paymentStatus,
        razorpayPaymentId: input.razorpayPaymentId,
        relatedPaperId: input.relatedPaperId,
        notes: input.notes,
      }
    );

    return {
      success: true,
      newBalance: result.newBalance,
      transactionId: result.transactionId,
    };
  }

  /**
   * Get paginated transaction history
   */
  async getTransactionHistory(input: GetTransactionsInputDTO): Promise<GetTransactionsOutputDTO> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;

    if (page < 1) {
      throw new BadRequestError("Page must be >= 1", "INVALID_PAGE");
    }

    if (limit < 1 || limit > 100) {
      throw new BadRequestError("Limit must be between 1 and 100", "INVALID_LIMIT");
    }

    const result = await this.creditRepository.getTransactionHistory(input.userId, page, limit);

    const transactions: CreditTransactionOutputDTO[] = result.transactions.map((t) => ({
      id: t.id,
      userId: t.userId,
      type: t.transactionType,
      creditsChange: t.creditsChange,
      balanceAfter: t.balanceAfter,
      relatedPaperId: t.relatedPaperId,
      notes: t.notes,
      createdAt: t.createdAt.toISOString(),
    }));

    return {
      transactions,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }

  /**
   * Verify ledger integrity - sum of all deltas should equal current balance
   */
  async verifyLedgerIntegrity(userId: string): Promise<VerifyLedgerIntegrityOutputDTO> {
    const result = await this.creditRepository.verifyLedgerIntegrity(userId);

    return {
      isValid: result.isValid,
      currentBalance: result.currentBalance,
      calculatedBalance: result.calculatedBalance,
      difference: result.currentBalance - result.calculatedBalance,
    };
  }

  /**
   * Check if notification should be sent
   * Returns true if balance just dropped to 5 or below (from above 5)
   */
  private shouldSendLowCreditNotification(previousBalance: number, newBalance: number): boolean {
    return previousBalance > 5 && newBalance <= 5;
  }
}
