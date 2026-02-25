import type { PrismaClient } from "@prisma/client";
import { CreditTransaction } from "./credit.entity";

export interface ICreditRepository {
  getBalance(userId: string): Promise<number>;
  deductCreditAtomic(
    userId: string,
    relatedPaperId: string,
    notes?: string
  ): Promise<{ newBalance: number; previousBalance: number; transactionId: string }>;
  addCredits(
    userId: string,
    amount: number,
    transactionType: "purchase" | "bonus" | "refund",
    options?: {
      paymentGatewayId?: string;
      paymentAmountInr?: number;
      paymentStatus?: string;
      razorpayPaymentId?: string;
      relatedPaperId?: string;
      notes?: string;
    }
  ): Promise<{ newBalance: number; transactionId: string }>;
  getTransactionHistory(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ transactions: CreditTransaction[]; total: number }>;
  verifyLedgerIntegrity(
    userId: string
  ): Promise<{ isValid: boolean; currentBalance: number; calculatedBalance: number }>;
}

export class PrismaCreditRepository implements ICreditRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getBalance(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { creditBalance: true },
    });

    return user?.creditBalance ?? 0;
  }

  async deductCreditAtomic(
    userId: string,
    relatedPaperId: string,
    notes?: string
  ): Promise<{ newBalance: number; previousBalance: number; transactionId: string }> {
    return await this.prisma.$transaction(async (tx) => {
      // Lock the user row for update with SELECT FOR UPDATE
      const user = await tx.$queryRaw<
        Array<{ id: string; credit_balance: number }>
      >`SELECT id, credit_balance FROM users WHERE id = ${userId}::uuid FOR UPDATE`;

      if (!user || user.length === 0) {
        throw new Error("User not found");
      }

      const previousBalance = user[0].credit_balance;

      if (previousBalance < 1) {
        throw new Error("INSUFFICIENT_CREDITS");
      }

      const newBalance = previousBalance - 1;

      // Update user balance
      await tx.user.update({
        where: { id: userId },
        data: {
          creditBalance: newBalance,
        },
      });

      // Create immutable transaction record
      const transaction = await tx.creditTransaction.create({
        data: {
          userId,
          transactionType: "deduction",
          creditsChange: -1,
          balanceAfter: newBalance,
          relatedPaperId,
          notes,
        },
      });

      return {
        newBalance,
        previousBalance,
        transactionId: transaction.id,
      };
    });
  }

  async addCredits(
    userId: string,
    amount: number,
    transactionType: "purchase" | "bonus" | "refund",
    options?: {
      paymentGatewayId?: string;
      paymentAmountInr?: number;
      paymentStatus?: string;
      razorpayPaymentId?: string;
      relatedPaperId?: string;
      notes?: string;
    }
  ): Promise<{ newBalance: number; transactionId: string }> {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    return await this.prisma.$transaction(async (tx) => {
      // Lock the user row for update
      const user = await tx.$queryRaw<
        Array<{ id: string; credit_balance: number; total_credits_purchased: number }>
      >`SELECT id, credit_balance, total_credits_purchased FROM users WHERE id = ${userId}::uuid FOR UPDATE`;

      if (!user || user.length === 0) {
        throw new Error("User not found");
      }

      const currentBalance = user[0].credit_balance;
      const newBalance = currentBalance + amount;

      // Update user balance and total purchased if it's a purchase
      const updateData: any = {
        creditBalance: newBalance,
      };

      if (transactionType === "purchase") {
        updateData.totalCreditsPurchased = user[0].total_credits_purchased + amount;
      }

      await tx.user.update({
        where: { id: userId },
        data: updateData,
      });

      // Create immutable transaction record
      const transaction = await tx.creditTransaction.create({
        data: {
          userId,
          transactionType,
          creditsChange: amount,
          balanceAfter: newBalance,
          paymentGatewayId: options?.paymentGatewayId,
          paymentAmountInr: options?.paymentAmountInr,
          paymentStatus: options?.paymentStatus,
          razorpayPaymentId: options?.razorpayPaymentId,
          relatedPaperId: options?.relatedPaperId,
          notes: options?.notes,
        },
      });

      return {
        newBalance,
        transactionId: transaction.id,
      };
    });
  }

  async getTransactionHistory(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ transactions: CreditTransaction[]; total: number }> {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.creditTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.creditTransaction.count({
        where: { userId },
      }),
    ]);

    const entities = transactions.map(
      (t) =>
        new CreditTransaction({
          id: t.id,
          userId: t.userId,
          transactionType: t.transactionType as any,
          creditsChange: t.creditsChange,
          balanceAfter: t.balanceAfter,
          paymentGatewayId: t.paymentGatewayId,
          paymentAmountInr: t.paymentAmountInr ? Number(t.paymentAmountInr) : null,
          paymentStatus: t.paymentStatus,
          razorpayPaymentId: t.razorpayPaymentId,
          relatedPaperId: t.relatedPaperId,
          notes: t.notes,
          createdAt: t.createdAt,
        })
    );

    return { transactions: entities, total };
  }

  async verifyLedgerIntegrity(
    userId: string
  ): Promise<{ isValid: boolean; currentBalance: number; calculatedBalance: number }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { creditBalance: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const currentBalance = user.creditBalance;

    const result = await this.prisma.creditTransaction.aggregate({
      where: { userId },
      _sum: {
        creditsChange: true,
      },
    });

    const calculatedBalance = result._sum.creditsChange ?? 0;

    return {
      isValid: currentBalance === calculatedBalance,
      currentBalance,
      calculatedBalance,
    };
  }
}
