import { serial, text, pgTable, timestamp, numeric, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Define the dog toy category enum
export const dogToyCategoryEnum = pgEnum('dog_toy_category', ['chew', 'fetch', 'interactive', 'plush', 'rope']);

// Define the landing page section type enum
export const landingPageSectionTypeEnum = pgEnum('landing_page_section_type', ['hero', 'cta']);

// Dog toys table
export const dogToysTable = pgTable('dog_toys', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  image_url: text('image_url').notNull(),
  category: dogToyCategoryEnum('category').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  featured: boolean('featured').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Landing page content table
export const landingPageContentTable = pgTable('landing_page_content', {
  id: serial('id').primaryKey(),
  section_type: landingPageSectionTypeEnum('section_type').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  content: text('content'),
  image_url: text('image_url'),
  button_text: text('button_text'),
  button_url: text('button_url'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// TypeScript types for the table schemas
export type DogToy = typeof dogToysTable.$inferSelect;
export type NewDogToy = typeof dogToysTable.$inferInsert;
export type LandingPageContent = typeof landingPageContentTable.$inferSelect;
export type NewLandingPageContent = typeof landingPageContentTable.$inferInsert;

// Important: Export all tables for proper query building
export const tables = { 
  dogToys: dogToysTable,
  landingPageContent: landingPageContentTable 
};