ALTER TABLE "set_like" DROP CONSTRAINT "set_like_user_id_set_id_pk";--> statement-breakpoint
ALTER TABLE "set_join" ADD COLUMN "join_count" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "set_join" ADD COLUMN "updated_at" timestamp DEFAULT now();