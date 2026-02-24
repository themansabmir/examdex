export interface CreditTransactionProps {
  id: string;
  userId: string;
  transactionType: "purchase" | "deduction" | "refund" | "bonus";
  creditsChange: number;
  balanceAfter: number;
  paymentGatewayId?: string | null;
  paymentAmountInr?: number | null;
  paymentStatus?: string | null;
  razorpayPaymentId?: string | null;
  relatedPaperId?: string | null;
  notes?: string | null;
  createdAt: Date;
}

export class CreditTransaction {
  readonly id: string;
  readonly userId: string;
  readonly transactionType: "purchase" | "deduction" | "refund" | "bonus";
  readonly creditsChange: number;
  readonly balanceAfter: number;
  readonly paymentGatewayId?: string | null;
  readonly paymentAmountInr?: number | null;
  readonly paymentStatus?: string | null;
  readonly razorpayPaymentId?: string | null;
  readonly relatedPaperId?: string | null;
  readonly notes?: string | null;
  readonly createdAt: Date;

  constructor(props: CreditTransactionProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.transactionType = props.transactionType;
    this.creditsChange = props.creditsChange;
    this.balanceAfter = props.balanceAfter;
    this.paymentGatewayId = props.paymentGatewayId;
    this.paymentAmountInr = props.paymentAmountInr;
    this.paymentStatus = props.paymentStatus;
    this.razorpayPaymentId = props.razorpayPaymentId;
    this.relatedPaperId = props.relatedPaperId;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
  }

  isDeduction(): boolean {
    return this.transactionType === "deduction";
  }

  isCredit(): boolean {
    return ["purchase", "refund", "bonus"].includes(this.transactionType);
  }

  isPurchase(): boolean {
    return this.transactionType === "purchase";
  }

  isRefund(): boolean {
    return this.transactionType === "refund";
  }
}

export interface CreditBalanceInfo {
  userId: string;
  balance: number;
  lastUpdated: Date;
}
