CREATE TABLE "processed_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_url" text NOT NULL,
	"optimized_url" text NOT NULL,
	"width" integer,
	"height" integer,
	"created_at" timestamp DEFAULT now()
);
