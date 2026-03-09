import { z } from "zod";

export const createPaymentOrderSchema = z.object({
  creditPackId: z
    .string({ required_error: "creditPackId is required" })
    .min(1, "creditPackId cannot be empty"),
});

export type CreatePaymentOrderInput = z.infer<typeof createPaymentOrderSchema>;

const webhookPaymentEntitySchema = z
  .object({
    id: z.string().min(1, "payment.id is required"),
    order_id: z.string().min(1, "payment.order_id is required"),
    amount: z.number(),
    amount_paid: z.number().optional(),
    email: z.string().optional(),
    contact: z.string().optional(),
    notes: z.record(z.any()).optional(),
  })
  .passthrough();

const webhookOrderEntitySchema = z
  .object({
    id: z.string().min(1, "order.id is required"),
  })
  .passthrough();

export const razorpayWebhookSchema = z
  .object({
    event: z.string().min(1, "event is required"),
    created_at: z.number().optional(),
    data: z
      .object({
        payment: webhookPaymentEntitySchema,
        order: webhookOrderEntitySchema,
      })
      .passthrough(),
  })
  .passthrough();
