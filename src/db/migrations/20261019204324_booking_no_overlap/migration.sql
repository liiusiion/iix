-- Custom SQL migration file, put your code below! --

-- btree_gist lets a GiST index combine equality on uuid with range overlap
CREATE EXTENSION IF NOT EXISTS btree_gist;
--> statement-breakpoint

-- Active bookings of the same property can't overlap. Ranges are half-open [start, end),
-- so a booking may start exactly when the previous one ends.
ALTER TABLE "main"."bookings" ADD CONSTRAINT "bookings_no_overlap" EXCLUDE USING gist (
	"property_id" WITH =,
	tstzrange("start_date", "end_date", '[)') WITH &&
) WHERE ("status" IN ('Pending', 'Confirmed'));
