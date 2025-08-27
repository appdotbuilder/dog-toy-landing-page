import { db } from '../db';
import { landingPageContentTable } from '../db/schema';
import { type LandingPageContent } from '../schema';
import { eq, and, desc } from 'drizzle-orm';

export const getLandingPageContent = async (): Promise<LandingPageContent[]> => {
  try {
    const results = await db.select()
      .from(landingPageContentTable)
      .where(eq(landingPageContentTable.is_active, true))
      .orderBy(desc(landingPageContentTable.updated_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch landing page content:', error);
    throw error;
  }
};

export const getHeroContent = async (): Promise<LandingPageContent | null> => {
  try {
    const results = await db.select()
      .from(landingPageContentTable)
      .where(
        and(
          eq(landingPageContentTable.section_type, 'hero'),
          eq(landingPageContentTable.is_active, true)
        )
      )
      .orderBy(desc(landingPageContentTable.updated_at))
      .limit(1)
      .execute();

    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Failed to fetch hero content:', error);
    throw error;
  }
};

export const getCtaContent = async (): Promise<LandingPageContent | null> => {
  try {
    const results = await db.select()
      .from(landingPageContentTable)
      .where(
        and(
          eq(landingPageContentTable.section_type, 'cta'),
          eq(landingPageContentTable.is_active, true)
        )
      )
      .orderBy(desc(landingPageContentTable.updated_at))
      .limit(1)
      .execute();

    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Failed to fetch CTA content:', error);
    throw error;
  }
};