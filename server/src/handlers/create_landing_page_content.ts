import { db } from '../db';
import { landingPageContentTable } from '../db/schema';
import { type CreateLandingPageContentInput, type LandingPageContent } from '../schema';

export const createLandingPageContent = async (input: CreateLandingPageContentInput): Promise<LandingPageContent> => {
  try {
    // Insert landing page content record
    const result = await db.insert(landingPageContentTable)
      .values({
        section_type: input.section_type,
        title: input.title,
        subtitle: input.subtitle || null,
        content: input.content || null,
        image_url: input.image_url || null,
        button_text: input.button_text || null,
        button_url: input.button_url || null,
        is_active: input.is_active
      })
      .returning()
      .execute();

    // Return the created landing page content
    return result[0];
  } catch (error) {
    console.error('Landing page content creation failed:', error);
    throw error;
  }
};