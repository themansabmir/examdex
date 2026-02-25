-- Epic 12: Credit Ledger & Deduction System
-- Add constraints and triggers to ensure immutability and integrity

-- Create function to prevent credit transaction modifications
CREATE OR REPLACE FUNCTION prevent_credit_transaction_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Credit transactions are immutable and cannot be modified or deleted';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent updates on credit_transactions
CREATE TRIGGER prevent_credit_transaction_update
    BEFORE UPDATE ON credit_transactions
    FOR EACH ROW
    EXECUTE FUNCTION prevent_credit_transaction_modification();

-- Create trigger to prevent deletes on credit_transactions
CREATE TRIGGER prevent_credit_transaction_delete
    BEFORE DELETE ON credit_transactions
    FOR EACH ROW
    EXECUTE FUNCTION prevent_credit_transaction_modification();

-- Add check constraint to ensure balance is non-negative (if not already exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_credit_balance_check'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_credit_balance_check CHECK (credit_balance >= 0);
    END IF;
END $$;

-- Add check constraint to ensure balanceAfter in transactions is non-negative
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'credit_transactions_balance_after_check'
    ) THEN
        ALTER TABLE credit_transactions ADD CONSTRAINT credit_transactions_balance_after_check CHECK (balance_after >= 0);
    END IF;
END $$;

-- Create index for performance on user credit balance lookups
CREATE INDEX IF NOT EXISTS idx_users_credit_balance ON users(id, credit_balance);

-- Create index for credit transaction queries by user and date
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_date ON credit_transactions(user_id, created_at DESC);
