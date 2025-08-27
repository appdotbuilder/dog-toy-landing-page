import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { landingPageContentTable } from '../db/schema';
import { type UpdateLandingPageContentInput, type CreateLandingPageContentInput } from '../schema';
import { updateLandingPageContent } from '../handlers/update_landing_page_content';
import { eq } from 'drizzle-orm';

// Helper function to create a landing page content record
const createTestLandingPageContent = async (overrides: Partial<CreateLandingPageContentInput> = {}) => {
  const defaultData: CreateLandingPageContentInput = {
    section_type: 'hero',
    title: 'Original Title',
    subtitle: 'Original Subtitle',
    content: 'Original content text',
    image_url: 'https://example.com/original.jpg',
    button_text: 'Original Button',
    button_url: 'https://example.com/original',
    is_active: true
  };

  const data = { ...defaultData, ...overrides };

  const result = await db.insert(landingPageContentTable)
    .values(data)
    .returning()
    .execute();

  return result[0];
};

describe('updateLandingPageContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update all fields of a landing page content record', async () => {
    // Create test record
    const original = await createTestLandingPageContent();

    const updateInput: UpdateLandingPageContentInput = {
      id: original.id,
      section_type: 'cta',
      title: 'Updated Title',
      subtitle: 'Updated Subtitle',
      content: 'Updated content text',
      image_url: 'https://example.com/updated.jpg',
      button_text: 'Updated Button',
      button_url: 'https://example.com/updated',
      is_active: false
    };

    const result = await updateLandingPageContent(updateInput);

    // Verify all fields were updated
    expect(result.id).toEqual(original.id);
    expect(result.section_type).toEqual('cta');
    expect(result.title).toEqual('Updated Title');
    expect(result.subtitle).toEqual('Updated Subtitle');
    expect(result.content).toEqual('Updated content text');
    expect(result.image_url).toEqual('https://example.com/updated.jpg');
    expect(result.button_text).toEqual('Updated Button');
    expect(result.button_url).toEqual('https://example.com/updated');
    expect(result.is_active).toEqual(false);
    expect(result.created_at).toEqual(original.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > original.updated_at).toBe(true);
  });

  it('should update only specified fields', async () => {
    // Create test record
    const original = await createTestLandingPageContent();

    const updateInput: UpdateLandingPageContentInput = {
      id: original.id,
      title: 'Only Title Updated',
      is_active: false
    };

    const result = await updateLandingPageContent(updateInput);

    // Verify only specified fields were updated
    expect(result.id).toEqual(original.id);
    expect(result.section_type).toEqual(original.section_type); // Unchanged
    expect(result.title).toEqual('Only Title Updated'); // Updated
    expect(result.subtitle).toEqual(original.subtitle); // Unchanged
    expect(result.content).toEqual(original.content); // Unchanged
    expect(result.image_url).toEqual(original.image_url); // Unchanged
    expect(result.button_text).toEqual(original.button_text); // Unchanged
    expect(result.button_url).toEqual(original.button_url); // Unchanged
    expect(result.is_active).toEqual(false); // Updated
    expect(result.created_at).toEqual(original.created_at); // Unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > original.updated_at).toBe(true);
  });

  it('should update nullable fields to null', async () => {
    // Create test record with non-null values
    const original = await createTestLandingPageContent({
      subtitle: 'Has subtitle',
      content: 'Has content',
      image_url: 'https://example.com/image.jpg',
      button_text: 'Has button text',
      button_url: 'https://example.com/button'
    });

    const updateInput: UpdateLandingPageContentInput = {
      id: original.id,
      subtitle: null,
      content: null,
      image_url: null,
      button_text: null,
      button_url: null
    };

    const result = await updateLandingPageContent(updateInput);

    // Verify nullable fields were set to null
    expect(result.subtitle).toBeNull();
    expect(result.content).toBeNull();
    expect(result.image_url).toBeNull();
    expect(result.button_text).toBeNull();
    expect(result.button_url).toBeNull();
    expect(result.updated_at > original.updated_at).toBe(true);
  });

  it('should save updated data to database', async () => {
    // Create test record
    const original = await createTestLandingPageContent();

    const updateInput: UpdateLandingPageContentInput = {
      id: original.id,
      title: 'Database Update Test',
      section_type: 'cta'
    };

    await updateLandingPageContent(updateInput);

    // Verify data was saved to database
    const savedRecord = await db.select()
      .from(landingPageContentTable)
      .where(eq(landingPageContentTable.id, original.id))
      .execute();

    expect(savedRecord).toHaveLength(1);
    expect(savedRecord[0].title).toEqual('Database Update Test');
    expect(savedRecord[0].section_type).toEqual('cta');
    expect(savedRecord[0].updated_at).toBeInstanceOf(Date);
    expect(savedRecord[0].updated_at > original.updated_at).toBe(true);
  });

  it('should throw error when trying to update non-existent record', async () => {
    const updateInput: UpdateLandingPageContentInput = {
      id: 99999, // Non-existent ID
      title: 'This should fail'
    };

    await expect(updateLandingPageContent(updateInput))
      .rejects
      .toThrow(/Landing page content with ID 99999 not found/i);
  });

  it('should handle updating record with minimal data', async () => {
    // Create record with only required fields
    const original = await createTestLandingPageContent({
      subtitle: null,
      content: null,
      image_url: null,
      button_text: null,
      button_url: null
    });

    const updateInput: UpdateLandingPageContentInput = {
      id: original.id,
      title: 'Minimal Update Test'
    };

    const result = await updateLandingPageContent(updateInput);

    expect(result.title).toEqual('Minimal Update Test');
    expect(result.subtitle).toBeNull();
    expect(result.content).toBeNull();
    expect(result.image_url).toBeNull();
    expect(result.button_text).toBeNull();
    expect(result.button_url).toBeNull();
    expect(result.updated_at > original.updated_at).toBe(true);
  });

  it('should handle updating between different section types', async () => {
    // Create hero section
    const heroSection = await createTestLandingPageContent({
      section_type: 'hero',
      title: 'Hero Section'
    });

    // Update to CTA section
    const updateInput: UpdateLandingPageContentInput = {
      id: heroSection.id,
      section_type: 'cta',
      title: 'Now a CTA Section'
    };

    const result = await updateLandingPageContent(updateInput);

    expect(result.section_type).toEqual('cta');
    expect(result.title).toEqual('Now a CTA Section');
  });

  it('should update is_active status correctly', async () => {
    // Create active content
    const activeContent = await createTestLandingPageContent({
      is_active: true
    });

    // Deactivate it
    const updateInput: UpdateLandingPageContentInput = {
      id: activeContent.id,
      is_active: false
    };

    const result = await updateLandingPageContent(updateInput);

    expect(result.is_active).toEqual(false);
    expect(result.updated_at > activeContent.updated_at).toBe(true);
  });
});