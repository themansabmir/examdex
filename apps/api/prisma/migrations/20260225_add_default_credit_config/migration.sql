-- Epic 12: Add Default Credit Configuration Master Data Table

-- Create default_credit_config table for managing default credits on registration
CREATE TABLE default_credit_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    credits_per_new_student integer NOT NULL DEFAULT 10,
    description text,
    is_active boolean NOT NULL DEFAULT true,
    updated_by uuid,
    updated_at timestamp(6) with time zone NOT NULL DEFAULT now(),
    created_at timestamp(6) with time zone NOT NULL DEFAULT now()
);

-- Create index for active configs
CREATE INDEX idx_default_credit_config_active ON default_credit_config(is_active, updated_at DESC);

-- Add foreign key to users table
ALTER TABLE default_credit_config
ADD CONSTRAINT fk_default_credit_config_updated_by
FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

-- Insert default configuration if not exists
INSERT INTO default_credit_config (id, credits_per_new_student, description, is_active)
SELECT gen_random_uuid(), 10, 'Default credits for newly registered students', true
WHERE NOT EXISTS (SELECT 1 FROM default_credit_config WHERE is_active = true);
