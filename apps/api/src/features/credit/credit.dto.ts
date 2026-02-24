export interface GetBalanceOutputDTO {
  balance: number;
  userId: string;
}

export interface DeductCreditInputDTO {
  userId: string;
  relatedPaperId: string;
  notes?: string;
}

export interface DeductCreditOutputDTO {
  success: boolean;
  newBalance: number;
  previousBalance: number;
  transactionId: string;
  shouldNotify: boolean;
}

export interface AddCreditsInputDTO {
  userId: string;
  amount: number;
  transactionType: "purchase" | "bonus" | "refund";
  paymentGatewayId?: string;
  paymentAmountInr?: number;
  paymentStatus?: string;
  razorpayPaymentId?: string;
  relatedPaperId?: string;
  notes?: string;
}

export interface AddCreditsOutputDTO {
  success: boolean;
  newBalance: number;
  transactionId: string;
}

export interface CreditTransactionOutputDTO {
  id: string;
  userId: string;
  type: string;
  creditsChange: number;
  balanceAfter: number;
  relatedPaperId?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface GetTransactionsInputDTO {
  userId: string;
  page?: number;
  limit?: number;
}

export interface GetTransactionsOutputDTO {
  transactions: CreditTransactionOutputDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface VerifyLedgerIntegrityOutputDTO {
  isValid: boolean;
  currentBalance: number;
  calculatedBalance: number;
  difference: number;
}
