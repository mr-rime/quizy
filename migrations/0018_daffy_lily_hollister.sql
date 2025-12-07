DROP TABLE "set_like" CASCADE;--> statement-breakpoint
ALTER TABLE "flashcard_set" ADD COLUMN "like_count" integer DEFAULT 0 NOT NULL;