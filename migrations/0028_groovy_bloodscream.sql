CREATE TYPE "public"."category" AS ENUM('english', 'other');--> statement-breakpoint
ALTER TABLE "flashcard_set" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "flashcard_set" ALTER COLUMN "category" SET DEFAULT 'english'::"public"."category";--> statement-breakpoint
ALTER TABLE "flashcard_set" ALTER COLUMN "category" SET DATA TYPE "public"."category" USING "category"::"public"."category";