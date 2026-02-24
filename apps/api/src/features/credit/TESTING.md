# Testing Notes

## Test Files Created

- `credit.service.spec.ts` - Unit tests for credit service
- `credit.integration.spec.ts` - Integration tests for Epic 12 DoD

## Setup Required

The test files use `vitest` as the testing framework. To run tests, install vitest:

```bash
cd apps/api
npm install -D vitest @vitest/ui
```

Or if using pnpm:

```bash
pnpm add -D vitest @vitest/ui
```

## Running Tests

```bash
# Run all credit tests
npm test credit

# Run specific test file
npm test credit.service.spec.ts

# Run with coverage
npm test -- --coverage
```

## Manual Testing

### Test Credit Balance

```bash
curl -H "Authorization: Bearer YOUR_JWT" \
  http://localhost:3000/api/credits/balance
```

### Test Transaction History

```bash
curl -H "Authorization: Bearer YOUR_JWT" \
  "http://localhost:3000/api/credits/transactions?page=1&limit=20"
```

### Test Credit Deduction

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"examId": "exam-uuid"}' \
  http://localhost:3000/api/papers/generate
```

### Test Ledger Integrity

```bash
curl -H "Authorization: Bearer YOUR_JWT" \
  http://localhost:3000/api/credits/verify-integrity
```

## Concurrency Testing

To test concurrent requests (Epic 12 DoD requirement):

```bash
# Using Apache Bench
ab -n 2 -c 2 \
   -H "Authorization: Bearer YOUR_JWT" \
   -p paper.json \
   -T application/json \
   http://localhost:3000/api/papers/generate

# Using k6
k6 run concurrency-test.js
```

## Database Testing

Verify immutability constraints:

```sql
-- This should fail with "Credit transactions are immutable"
UPDATE credit_transactions SET credits_change = 0 WHERE id = 'some-uuid';

-- This should also fail
DELETE FROM credit_transactions WHERE id = 'some-uuid';

-- Verify non-negative balance constraint
UPDATE users SET credit_balance = -1 WHERE id = 'some-uuid';
-- Should fail with constraint violation
```

## Test Data Setup

```sql
-- Create test user with credits
INSERT INTO users (id, full_name, phone_number, user_type, credit_balance, is_active)
VALUES (
  gen_random_uuid(),
  'Test User',
  '+919999999999',
  'student',
  10,
  true
);

-- Verify initial balance
SELECT id, full_name, credit_balance FROM users WHERE phone_number = '+919999999999';
```
