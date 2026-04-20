CREATE TABLE "site_setting" (
	"key" varchar(50) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "site_setting" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "folder_set" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "folder" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_private" boolean DEFAULT false NOT NULL;