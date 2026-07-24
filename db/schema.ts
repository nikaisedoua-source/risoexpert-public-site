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

export const supportRequests = sqliteTable("support_requests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  machine: text("machine").notNull(),
  urgency: text("urgency").notNull(),
  errorMessage: text("error_message"),
  problem: text("problem").notNull(),
  status: text("status").notNull().default("nouvelle"),
  consentedAt: text("consented_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  googleSub: text("google_sub").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  picture: text("picture"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const userSessions = sqliteTable("user_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
});
