import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// IC Registration table
export const usersIc = pgTable("users_ic", {
  id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
  hashIc: text("hash_ic").notNull().unique(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertIcUserSchema = createInsertSchema(usersIc).omit({
  id: true,
  createdAt: true,
});

export type InsertIcUser = z.infer<typeof insertIcUserSchema>;
export type IcUser = typeof usersIc.$inferSelect;

// OCR Result validation schemas
export const ocrResultSchema = z.object({
  icNumber: z.string().regex(/^\d{12}$/, "IC Number must be exactly 12 digits"),
  fullName: z.string().min(1, "Full name is required").regex(/^[a-zA-Z\s]+$/, "Full name must contain only letters and spaces"),
});

export const manualInputSchema = z.object({
  icNumber: z.string().regex(/^\d{12}$/, "IC Number must be exactly 12 digits"),
  fullName: z.string().min(1, "Full name is required"),
});

export type OcrResult = z.infer<typeof ocrResultSchema>;
export type ManualInput = z.infer<typeof manualInputSchema>;
