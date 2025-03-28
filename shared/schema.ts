import { pgTable, text, serial, integer, boolean, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  contentType: varchar("content_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  uploadDate: varchar("upload_date", { length: 100 }).notNull(),
  imageData: text("image_data").notNull(), // Base64 encoded image data
  imageType: varchar("image_type", { length: 50 }).notNull(), // e.g., "historical", "palm-leaf", etc.
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  contentType: varchar("content_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  uploadDate: varchar("upload_date", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("uploaded"),
  enhancementEnabled: boolean("enhancement_enabled").default(true),
  spellCheckEnabled: boolean("spell_check_enabled").default(true),
  layoutAnalysisEnabled: boolean("layout_analysis_enabled").default(true),
  ocrMode: varchar("ocr_mode", { length: 20 }).default("auto"),
  outputFormat: varchar("output_format", { length: 10 }).default("txt"),
  confidenceThreshold: integer("confidence_threshold").default(80),
  originalText: text("original_text"),
  processedText: text("processed_text"),
  processingSummary: jsonb("processing_summary")
});

export const insertDocumentSchema = createInsertSchema(documents)
  .omit({ id: true, originalText: true, processedText: true, processingSummary: true })
  .extend({
    enhancementEnabled: z.boolean().default(true),
    spellCheckEnabled: z.boolean().default(true),
    layoutAnalysisEnabled: z.boolean().default(true),
    ocrMode: z.enum(["auto", "modern", "historical", "palm"]).default("auto"),
    outputFormat: z.enum(["txt", "pdf", "json"]).default("txt"),
    confidenceThreshold: z.number().min(0).max(100).default(80),
  });

export const updateDocumentSchema = createInsertSchema(documents)
  .omit({ id: true })
  .partial();

export const processingResultSchema = z.object({
  documentId: z.number(),
  extractedText: z.string(),
  confidence: z.number(),
  processingTime: z.number(),
  charCount: z.number(),
  stages: z.array(
    z.object({
      name: z.string(),
      status: z.enum(["completed", "failed"]),
      progress: z.number(),
      timeMs: z.number(),
    })
  ),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type UpdateDocument = z.infer<typeof updateDocumentSchema>;
export type ProcessingResult = z.infer<typeof processingResultSchema>;
