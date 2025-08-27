import { db } from '../db';
import { landingPageContentTable } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { type UpdateLandingPageContentInput, type LandingPageContent } from '../schema';

export const updateLandingPageContent = async (input: UpdateLandingPageContentInput): Promise<LandingPageContent> => {
  try {
    // First verify the record exists
    const existingRecord = await db.select()
      .from(landingPageContentTable)
      .where(eq(landingPageContentTable.id, input.id))
      .execute();

    if (existingRecord.length === 0) {
      throw new Error(`Landing page content with ID ${input.id} not found`);
    }

    // Build update object only with provided fields
    const updateData: any = {};

    if (input.section_type !== undefined) {
      updateData.section_type = input.section_type;
    }
    if (input.title !== undefined) {
      updateData.title = input.title;
    }
    if (input.subtitle !== undefined) {
      updateData.subtitle = input.subtitle;
    }
    if (input.content !== undefined) {
      updateData.content = input.content;
    }
    if (input.image_url !== undefined) {
      updateData.image_url = input.image_url;
    }
    if (input.button_text !== undefined) {
      updateData.button_text = input.button_text;
    }
    if (input.button_url !== undefined) {
      updateData.button_url = input.button_url;
    }
    if (input.is_active !== undefined) {
      updateData.is_active = input.is_active;
    }

    // Always update the updated_at timestamp
    updateData.updated_at = sql`now()`;

    // Perform the update
    const result = await db.update(landingPageContentTable)
      .set(updateData)
      .where(eq(landingPageContentTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Failed to update landing page content with ID ${input.id}`);
    }

    return result[0];
  } catch (error) {
    console.error('Landing page content update failed:', error);
    throw error;
  }
};