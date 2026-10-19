CREATE SCHEMA "main";
--> statement-breakpoint
CREATE TYPE "main"."property_type" AS ENUM('Cabin', 'Room');--> statement-breakpoint
CREATE TYPE "main"."role" AS ENUM('Guest', 'Admin', 'Booking Manager');--> statement-breakpoint
CREATE TYPE "main"."booking_status" AS ENUM('Pending', 'Confirmed', 'Cancelled', 'Rejected');--> statement-breakpoint
CREATE TABLE "main"."properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" varchar(100) NOT NULL,
	"type" "main"."property_type" NOT NULL,
	"capacity" smallint NOT NULL,
	"price" integer NOT NULL,
	"rating" real,
	"description" text NOT NULL,
	"photos" varchar[],
	CONSTRAINT "min_title_length" CHECK (char_length("title") >= 3),
	CONSTRAINT "capacity_positive" CHECK ("capacity" >= 1 AND "capacity" <= 100),
	CONSTRAINT "price_positive" CHECK ("price" >= 0),
	CONSTRAINT "rating_valid" CHECK ("rating" IS NULL OR ("rating" >= 0 AND "rating" <= 5))
);
--> statement-breakpoint
CREATE TABLE "main"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"phone" varchar(12),
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"role" "main"."role" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "main"."booking_status" NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"message" varchar(1000),
	"property_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "main"."bookings" ADD CONSTRAINT "bookings_property_id_properties_id_fkey" FOREIGN KEY ("property_id") REFERENCES "main"."properties"("id");--> statement-breakpoint
ALTER TABLE "main"."bookings" ADD CONSTRAINT "bookings_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "main"."users"("id");