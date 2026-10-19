ALTER TABLE "main"."bookings" RENAME COLUMN "user_id" TO "guest_id";--> statement-breakpoint
ALTER TABLE "main"."bookings" ADD CONSTRAINT "valid_date_range" CHECK ("start_date" < "end_date");