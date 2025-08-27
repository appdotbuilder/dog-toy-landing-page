import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { landingPageContentTable } from '../db/schema';
import { type CreateLandingPageContentInput } from '../schema';
import { createLandingPageContent } from '../handlers/create_landing_page_content';
import { eq } from 'drizzle-orm';

// Test input with all fields
const fullTestInput: CreateLandingPageContentInput = {
  section_type: 'hero',
  title: 'Welcome to DogToys',
  subtitle: 'Find the perfect toy for your furry friend',
  content: 'Discover our amazing collection of premium dog toys.',
  image_url: 'https://example.com/hero-image.jpg',
  button_text: 'Shop Now',
  button_url: 'https://example.com/shop',
  is_active: true
};

// Minimal test input (required fields only)
const minimalTestInput: CreateLandingPageContentInput = {
  section_type: 'cta',
  title: 'Call to Action',
  is_active: false
};

describe('createLandingPageContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create landing page content with all fields', async () => {
    const result = await createLandingPageContent(fullTestInput);

    // Basic field validation
    expect(result.section_type).toEqual('hero');
    expect(result.title).toEqual('Welcome to DogToys');
    expect(result.subtitle).toEqual('Find the perfect toy for your furry friend');
    expect(result.content).toEqual('Discover our amazing collection of premium dog toys.');
    expect(result.image_url).toEqual('https://example.com/hero-image.jpg');
    expect(result.button_text).toEqual('Shop Now');
    expect(result.button_url).toEqual('https://example.com/shop');
    expect(result.is_active).toBe(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create landing page content with minimal fields', async () => {
    const result = await createLandingPageContent(minimalTestInput);

    // Basic field validation
    expect(result.section_type).toEqual('cta');
    expect(result.title).toEqual('Call to Action');
    expect(result.subtitle).toBeNull();
    expect(result.content).toBeNull();
    expect(result.image_url).toBeNull();
    expect(result.button_text).toBeNull();
    expect(result.button_url).toBeNull();
    expect(result.is_active).toBe(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save landing page content to database', async () => {
    const result = await createLandingPageContent(fullTestInput);

    // Query using proper drizzle syntax
    const content = await db.select()
      .from(landingPageContentTable)
      .where(eq(landingPageContentTable.id, result.id))
      .execute();

    expect(content).toHaveLength(1);
    expect(content[0].section_type).toEqual('hero');
    expect(content[0].title).toEqual('Welcome to DogToys');
    expect(content[0].subtitle).toEqual('Find the perfect toy for your furry friend');
    expect(content[0].content).toEqual('Discover our amazing collection of premium dog toys.');
    expect(content[0].image_url).toEqual('https://example.com/hero-image.jpg');
    expect(content[0].button_text).toEqual('Shop Now');
    expect(content[0].button_url).toEqual('https://example.com/shop');
    expect(content[0].is_active).toBe(true);
    expect(content[0].created_at).toBeInstanceOf(Date);
    expect(content[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle null optional fields correctly', async () => {
    const inputWithExplicitNulls: CreateLandingPageContentInput = {
      section_type: 'hero',
      title: 'Test Title',
      subtitle: null,
      content: null,
      image_url: null,
      button_text: null,
      button_url: null,
      is_active: true
    };

    const result = await createLandingPageContent(inputWithExplicitNulls);

    expect(result.subtitle).toBeNull();
    expect(result.content).toBeNull();
    expect(result.image_url).toBeNull();
    expect(result.button_text).toBeNull();
    expect(result.button_url).toBeNull();

    // Verify in database
    const content = await db.select()
      .from(landingPageContentTable)
      .where(eq(landingPageContentTable.id, result.id))
      .execute();

    expect(content[0].subtitle).toBeNull();
    expect(content[0].content).toBeNull();
    expect(content[0].image_url).toBeNull();
    expect(content[0].button_text).toBeNull();
    expect(content[0].button_url).toBeNull();
  });

  it('should use default is_active value when not provided', async () => {
    const inputWithoutIsActive: CreateLandingPageContentInput = {
      section_type: 'cta',
      title: 'Test CTA',
      is_active: true // Zod default value
    };

    const result = await createLandingPageContent(inputWithoutIsActive);

    // The Zod schema has default(true) for is_active
    expect(result.is_active).toBe(true);

    // Verify in database
    const content = await db.select()
      .from(landingPageContentTable)
      .where(eq(landingPageContentTable.id, result.id))
      .execute();

    expect(content[0].is_active).toBe(true);
  });

  it('should create multiple landing page content entries', async () => {
    const heroInput: CreateLandingPageContentInput = {
      section_type: 'hero',
      title: 'Hero Section',
      is_active: true
    };

    const ctaInput: CreateLandingPageContentInput = {
      section_type: 'cta',
      title: 'CTA Section',
      is_active: false
    };

    const heroResult = await createLandingPageContent(heroInput);
    const ctaResult = await createLandingPageContent(ctaInput);

    expect(heroResult.id).not.toEqual(ctaResult.id);
    expect(heroResult.section_type).toEqual('hero');
    expect(ctaResult.section_type).toEqual('cta');
    expect(heroResult.is_active).toBe(true);
    expect(ctaResult.is_active).toBe(false);

    // Verify both exist in database
    const allContent = await db.select()
      .from(landingPageContentTable)
      .execute();

    expect(allContent).toHaveLength(2);
  });
});