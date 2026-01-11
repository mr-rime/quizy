ALTER TABLE "card" ADD COLUMN "word_type" varchar(50);--> statement-breakpoint
ALTER TABLE "flashcard_set" ADD COLUMN "category" varchar(50) DEFAULT 'other' NOT NULL;