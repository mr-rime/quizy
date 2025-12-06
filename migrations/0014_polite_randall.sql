CREATE TABLE "saved_set" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"set_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "saved_set_user_id_set_id_pk" PRIMARY KEY("user_id","set_id")
);
--> statement-breakpoint
ALTER TABLE "saved_set" ADD CONSTRAINT "saved_set_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_set" ADD CONSTRAINT "saved_set_set_id_flashcard_set_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."flashcard_set"("id") ON DELETE cascade ON UPDATE no action;