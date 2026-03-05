/**
 * Payment DTOs for Razorpay integration
 */

// ============================================
// CREATE ORDER (Client initiates payment)
// ============================================

export interface CreateOrderInputDTO {
  creditPackId: string;
  userId: string;
}

export interface CreateOrderOutputDTO {
  orderId: string; // Razorpay order ID
  amount: number; // Amount in paise
  keyId: string; // Razorpay Key ID for client SDK
  currency: string; // Always "INR"
  timeout?: number; // Optional: timeout for the payment
}

// ============================================
// RAZORPAY WEBHOOK PAYLOAD
// ============================================

export interface RazorpayPaymentEntity {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  amount_refunded: number;
  refund_status?: string;
  captured: boolean;
  card_id?: string;
  bank?: string;
  wallet?: string;
  vpa?: string;
  email: string;
  contact: string;
  fee?: number;
  tax?: number;
  error_code?: string;
  error_description?: string;
  error_source?: string;
  error_reason?: string;
  error_step?: string;
  acquirer_data?: {
    auth_code?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notes?: Record<string, any>;
  created_at: number;
  order_id?: string;
  amount_paid?: number;
}

export interface RazorpayOrderEntity {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt?: string;
  offer_id?: string;
  status: string;
  attempts: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notes?: Record<string, any>;
  created_at: number;
}

export interface RazorpayWebhookPayload {
  event: string; // e.g., "payment.authorized", "payment.captured", "payment.failed"
  created_at: number;
  contains: string[]; // e.g., ["payment", "order"]
  data: {
    entity: string; // "payment" or "order"
    payment?: RazorpayPaymentEntity;
    order?: RazorpayOrderEntity;
  };
}

// ============================================
// WEBHOOK VERIFICATION & PROCESSING
// ============================================

export interface WebhookVerificationInput {
  payload: RazorpayWebhookPayload;
  signature: string;
  secret: string;
}

export interface ProcessWebhookInputDTO {
  event: string;
  razorpayPaymentId: string;
  orderId: string;
  amount: number; // in paise
  status: "captured" | "failed" | "authorized" | "created";
  email?: string;
  contact?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notes?: Record<string, any>;
}

export interface ProcessWebhookOutputDTO {
  success: boolean;
  message: string;
  idempotent?: boolean; // True if this webhook was already processed
  creditAdded?: number;
  newBalance?: number;
}

// ============================================
// PAYMENT RECORD (Database DTO)
// ============================================

export interface PaymentRecordDTO {
  id: string;
  userId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string; // Null if payment not captured
  creditPackId: string;
  amount: number; // in paise
  amountInr: number; // in INR
  status: "pending" | "captured" | "failed" | "refunded";
  errorCode?: string;
  errorDescription?: string;
  processedAt?: Date;
  createdAt: Date;
}

// ============================================
// ERROR PAYLOADS
// ============================================

export interface PaymentErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    status: number;
  };
}

export interface InvalidSignatureError extends PaymentErrorResponse {
  error: {
    code: "INVALID_SIGNATURE";
    message: "Webhook signature verification failed";
    status: 401;
  };
}
