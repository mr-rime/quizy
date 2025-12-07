CREATE TABLE "set_comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"set_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "set_join" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"set_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "set_join_user_id_set_id_pk" PRIMARY KEY("user_id","set_id")
);
--> statement-breakpoint
CREATE TABLE "set_like" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"set_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "set_like_user_id_set_id_pk" PRIMARY KEY("user_id","set_id")
);
--> statement-breakpoint
ALTER TABLE "saved_set" DROP CONSTRAINT "saved_set_user_id_set_id_pk";--> statement-breakpoint
ALTER TABLE "set_comment" ADD CONSTRAINT "set_comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_comment" ADD CONSTRAINT "set_comment_set_id_flashcard_set_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."flashcard_set"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_join" ADD CONSTRAINT "set_join_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_join" ADD CONSTRAINT "set_join_set_id_flashcard_set_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."flashcard_set"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_like" ADD CONSTRAINT "set_like_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_like" ADD CONSTRAINT "set_like_set_id_flashcard_set_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."flashcard_set"("id") ON DELETE cascade ON UPDATE no action;