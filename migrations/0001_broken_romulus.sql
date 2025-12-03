ALTER TABLE "user" RENAME COLUMN "upated_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "card" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "flashcard_set" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "card" DROP COLUMN "upated_at";--> statement-breakpoint
ALTER TABLE "flashcard_set" DROP COLUMN "upated_at";