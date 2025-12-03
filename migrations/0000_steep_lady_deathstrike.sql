CREATE TABLE "card" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"set_id" uuid NOT NULL,
	"term" varchar(255) NOT NULL,
	"definition" varchar(2000),
	"image_url" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"upated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flashcard_set" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"upated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"upated_at" timestamp,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_set_id_flashcard_set_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."flashcard_set"("id") ON DELETE cascade ON UPDATE no action;