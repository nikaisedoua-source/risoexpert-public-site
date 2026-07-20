import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const visitorLocations = sqliteTable("visitor_locations", {
  cityKey: text("city_key").primaryKey(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  visits: integer("visits").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});
