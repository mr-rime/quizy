ALTER TABLE "folder" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "folder" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;