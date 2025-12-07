-- Manual migration to fix set_join table structure
-- Drop the old id column and add composite primary key

-- First, drop the old primary key constraint
ALTER TABLE "set_join" DROP CONSTRAINT IF EXISTS "set_join_pkey";

-- Drop the id column
ALTER TABLE "set_join" DROP COLUMN IF EXISTS "id";

-- Add the new columns if they don't exist
ALTER TABLE "set_join" ADD COLUMN IF NOT EXISTS "join_count" integer DEFAULT 1 NOT NULL;
ALTER TABLE "set_join" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();

-- Create the composite primary key
ALTER TABLE "set_join" ADD CONSTRAINT "set_join_pkey" PRIMARY KEY("user_id", "set_id");
