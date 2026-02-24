# Credit Ledger & Deduction System

## Overview

This module implements Epic 12 — a complete credit ledger system with atomic deductions, immutable transaction history, and balance management. The system ensures data integrity through database constraints and pessimistic locking.

## Key Features

### ✅ Atomic Credit Deduction

- Credit deduction uses database transactions with `SELECT FOR UPDATE` locking
- No paper can be generated without a matching credit deduction
- Balance cannot go below 0
- Concurrent requests are handled safely

### ✅ Immutable Ledger

- All credit transactions are recorded in `credit_transactions` table
- Database triggers prevent UPDATE and DELETE operations on transactions
- Every transaction records: type, delta, resulting balance, reference ID, timestamp

### ✅ Balance Integrity

- Each user has one row in `users` table with `credit_balance`
- Balance is updated atomically with transaction creation
- Ledger integrity can be verified: sum of all deltas equals current balance

### ✅ Low Credit Notifications

- Service provides `shouldNotify` flag when balance drops to ≤5 from >5
- Notification fires once per drop event (not on every subsequent deduction)
- Frontend can use this flag to trigger push notifications

## API Endpoints

### `GET /credits/balance`

Get current credit balance for authenticated user.

**Response:**

```json
{
  "success": true,
  "data": {
    "balance": 42,
    "userId": "uuid"
  }
}
```

### `GET /credits/transactions`

Get paginated transaction history.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response:**

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "userId": "uuid",
        "type": "deduction",
        "creditsChange": -1,
        "balanceAfter": 41,
        "relatedPaperId": "uuid",
        "notes": "Paper generation",
        "createdAt": "2026-02-25T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### `GET /credits/verify-integrity`

Verify ledger integrity (dev/admin endpoint).

**Response:**

```json
{
  "success": true,
  "data": {
    "isValid": true,
    "currentBalance": 42,
    "calculatedBalance": 42,
    "difference": 0
  }
}
```

### `POST /credits/add` ⚠️ Admin Only

Manually add credits (for bonuses, refunds, or testing).

**Request Body:**

```json
{
  "userId": "uuid",
  "amount": 10,
  "transactionType": "bonus",
  "notes": "Welcome bonus"
}
```

## Database Schema

### `users` table

- `credit_balance` (int): Current balance with CHECK constraint (>= 0)
- `total_credits_purchased` (int): Lifetime purchase total

### `credit_transactions` table

- `id` (uuid): Transaction ID
- `user_id` (uuid): Foreign key to users
- `transaction_type` (varchar): "purchase" | "deduction" | "refund" | "bonus"
- `credits_change` (int): Delta (negative for deductions)
- `balance_after` (int): Resulting balance after transaction
- `related_paper_id` (uuid): Reference to generated paper
- `payment_gateway_id` (varchar): For purchases
- `payment_amount_inr` (decimal): Purchase amount
- `razorpay_payment_id` (varchar): Razorpay reference
- `notes` (text): Optional description
- `created_at` (timestamp): Immutable timestamp

**Constraints:**

- `balance_after >= 0` check constraint
- Immutability enforced by database triggers

## Usage Examples

### In Paper Generation Flow

```typescript
import { creditService } from "../container";

async function generatePaper(userId: string, paperId: string) {
  try {
    // Atomically deduct credit
    const result = await creditService.deductCredit(
      userId,
      paperId,
      "Paper generation for JEE Physics"
    );

    // Check if low credit notification should be sent
    if (result.shouldNotify) {
      // Trigger push notification
      await sendLowCreditNotification(userId, result.newBalance);
    }

    return {
      paperId,
      newBalance: result.newBalance,
    };
  } catch (error) {
    if (error.code === "INSUFFICIENT_CREDITS") {
      // Return 402 Payment Required
      throw new PaymentRequiredError("Insufficient credits");
    }
    throw error;
  }
}
```

### Adding Credits After Purchase

```typescript
import { creditService } from "../container";

async function processPurchase(userId: string, tierId: string, razorpayPaymentId: string) {
  const tier = await getPricingTier(tierId);

  const result = await creditService.addCredits({
    userId,
    amount: tier.credits + tier.bonusCredits,
    transactionType: "purchase",
    paymentGatewayId: tierId,
    paymentAmountInr: tier.priceINR,
    paymentStatus: "success",
    razorpayPaymentId,
    notes: `Purchased ${tier.tierName}`,
  });

  return result.newBalance;
}
```

## Concurrency Safety

The system handles concurrent requests safely:

**Scenario:** Two simultaneous generate requests with balance = 1

1. Request A locks the user row with `SELECT FOR UPDATE`
2. Request B waits for the lock
3. Request A deducts 1 credit, balance = 0
4. Request A commits and releases lock
5. Request B acquires lock, sees balance = 0
6. Request B throws `INSUFFICIENT_CREDITS` error
7. One paper created, one request returns 402 ✅

## Testing Requirements (Epic 12 DoD)

### ✅ Concurrency Test

```bash
# Two simultaneous requests with balance = 1
# Expected: One success (200), one 402
```

### ✅ Ledger Integrity Test

```bash
# Call GET /credits/verify-integrity
# Expected: isValid = true (sum of deltas = current balance)
```

### ✅ Notification Logic Test

```typescript
// Balance 6 → 5: shouldNotify = true
// Balance 5 → 4: shouldNotify = false
// Balance 3 → 2: shouldNotify = false
```

### ✅ Transaction History Test

```bash
# Test with 0, 1, and 50+ entries
# Expected: Correct pagination, sorted by date DESC
```

## Error Codes

- `INSUFFICIENT_CREDITS` - Balance < 1 for deduction (HTTP 402)
- `INVALID_AMOUNT` - Negative or zero amount for credit addition (HTTP 400)
- `INVALID_PAGE` - Page number < 1 (HTTP 400)
- `INVALID_LIMIT` - Limit not in range 1-100 (HTTP 400)

## Integration with Paper Generation

The credit deduction is integrated into the question paper generation flow:

1. User requests paper generation
2. System validates user and exam
3. System atomically deducts 1 credit
4. On success: Paper is generated, balance updates, notification flag returned
5. On failure: No paper created, credit not deducted

See [questionPaper.controller.ts](../question-paper/questionPaper.controller.ts) for implementation.

## Database Migration

Run the migration to add immutability constraints:

```bash
cd apps/api
npx prisma migrate deploy
```

The migration adds:

- Immutability triggers on `credit_transactions`
- Check constraints for non-negative balances
- Performance indexes

## Future Enhancements

- [ ] Webhook integration for Razorpay payment capture
- [ ] Credit expiry system (if needed)
- [ ] Bulk credit operations for admin
- [ ] Analytics dashboard for credit usage patterns
- [ ] Automated low-credit email reminders
