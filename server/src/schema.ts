import { z } from 'zod';

// Dog toy schema
export const dogToySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image_url: z.string().url(),
  category: z.enum(['chew', 'fetch', 'interactive', 'plush', 'rope']),
  price: z.number().positive(),
  featured: z.boolean(),
  created_at: z.coerce.date()
});

export type DogToy = z.infer<typeof dogToySchema>;

// Input schema for creating dog toys
export const createDogToyInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  image_url: z.string().url('Must be a valid URL'),
  category: z.enum(['chew', 'fetch', 'interactive', 'plush', 'rope']),
  price: z.number().positive('Price must be positive'),
  featured: z.boolean().default(false)
});

export type CreateDogToyInput = z.infer<typeof createDogToyInputSchema>;

// Input schema for updating dog toys
export const updateDogToyInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  image_url: z.string().url('Must be a valid URL').optional(),
  category: z.enum(['chew', 'fetch', 'interactive', 'plush', 'rope']).optional(),
  price: z.number().positive('Price must be positive').optional(),
  featured: z.boolean().optional()
});

export type UpdateDogToyInput = z.infer<typeof updateDogToyInputSchema>;

// Landing page content schema
export const landingPageContentSchema = z.object({
  id: z.number(),
  section_type: z.enum(['hero', 'cta']),
  title: z.string(),
  subtitle: z.string().nullable(),
  content: z.string().nullable(),
  image_url: z.string().url().nullable(),
  button_text: z.string().nullable(),
  button_url: z.string().url().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type LandingPageContent = z.infer<typeof landingPageContentSchema>;

// Input schema for creating landing page content
export const createLandingPageContentInputSchema = z.object({
  section_type: z.enum(['hero', 'cta']),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  image_url: z.string().url('Must be a valid URL').nullable().optional(),
  button_text: z.string().nullable().optional(),
  button_url: z.string().url('Must be a valid URL').nullable().optional(),
  is_active: z.boolean().default(true)
});

export type CreateLandingPageContentInput = z.infer<typeof createLandingPageContentInputSchema>;

// Input schema for updating landing page content
export const updateLandingPageContentInputSchema = z.object({
  id: z.number(),
  section_type: z.enum(['hero', 'cta']).optional(),
  title: z.string().min(1, 'Title is required').optional(),
  subtitle: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  image_url: z.string().url('Must be a valid URL').nullable().optional(),
  button_text: z.string().nullable().optional(),
  button_url: z.string().url('Must be a valid URL').nullable().optional(),
  is_active: z.boolean().optional()
});

export type UpdateLandingPageContentInput = z.infer<typeof updateLandingPageContentInputSchema>;