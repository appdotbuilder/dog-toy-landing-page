import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { landingPageContentTable } from '../db/schema';
import { type CreateLandingPageContentInput } from '../schema';
import { getLandingPageContent, getHeroContent, getCtaContent } from '../handlers/get_landing_page_content';

// Test data
const heroContent: CreateLandingPageContentInput = {
  section_type: 'hero',
  title: 'Welcome to Paw-some Toys',
  subtitle: 'The best toys for your furry friend',
  content: 'Discover our amazing collection of dog toys',
  image_url: 'https://example.com/hero.jpg',
  button_text: 'Shop Now',
  button_url: 'https://example.com/shop',
  is_active: true
};

const ctaContent: CreateLandingPageContentInput = {
  section_type: 'cta',
  title: 'Ready to Make Your Dog Happy?',
  subtitle: 'Get started today',
  content: 'Join thousands of happy pet owners',
  image_url: 'https://example.com/cta.jpg',
  button_text: 'Get Started',
  button_url: 'https://example.com/signup',
  is_active: true
};

const inactiveHeroContent: CreateLandingPageContentInput = {
  section_type: 'hero',
  title: 'Inactive Hero',
  subtitle: 'This should not appear',
  content: 'This content is inactive',
  image_url: 'https://example.com/inactive.jpg',
  button_text: 'Hidden',
  button_url: 'https://example.com/hidden',
  is_active: false
};

describe('getLandingPageContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return all active landing page content', async () => {
    // Insert test data
    await db.insert(landingPageContentTable)
      .values([
        {
          section_type: heroContent.section_type,
          title: heroContent.title,
          subtitle: heroContent.subtitle,
          content: heroContent.content,
          image_url: heroContent.image_url,
          button_text: heroContent.button_text,
          button_url: heroContent.button_url,
          is_active: heroContent.is_active
        },
        {
          section_type: ctaContent.section_type,
          title: ctaContent.title,
          subtitle: ctaContent.subtitle,
          content: ctaContent.content,
          image_url: ctaContent.image_url,
          button_text: ctaContent.button_text,
          button_url: ctaContent.button_url,
          is_active: ctaContent.is_active
        },
        {
          section_type: inactiveHeroContent.section_type,
          title: inactiveHeroContent.title,
          subtitle: inactiveHeroContent.subtitle,
          content: inactiveHeroContent.content,
          image_url: inactiveHeroContent.image_url,
          button_text: inactiveHeroContent.button_text,
          button_url: inactiveHeroContent.button_url,
          is_active: inactiveHeroContent.is_active
        }
      ])
      .execute();

    const results = await getLandingPageContent();

    expect(results).toHaveLength(2);
    expect(results.every(content => content.is_active)).toBe(true);
    
    // Check that both active contents are returned
    const heroResult = results.find(r => r.section_type === 'hero');
    const ctaResult = results.find(r => r.section_type === 'cta');
    
    expect(heroResult).toBeDefined();
    expect(ctaResult).toBeDefined();
    expect(heroResult?.title).toBe('Welcome to Paw-some Toys');
    expect(ctaResult?.title).toBe('Ready to Make Your Dog Happy?');
  });

  it('should return empty array when no active content exists', async () => {
    // Insert only inactive content
    await db.insert(landingPageContentTable)
      .values({
        section_type: inactiveHeroContent.section_type,
        title: inactiveHeroContent.title,
        subtitle: inactiveHeroContent.subtitle,
        content: inactiveHeroContent.content,
        image_url: inactiveHeroContent.image_url,
        button_text: inactiveHeroContent.button_text,
        button_url: inactiveHeroContent.button_url,
        is_active: inactiveHeroContent.is_active
      })
      .execute();

    const results = await getLandingPageContent();
    expect(results).toHaveLength(0);
  });

  it('should return results ordered by updated_at desc', async () => {
    // Insert test data with different timestamps
    const firstResult = await db.insert(landingPageContentTable)
      .values({
        section_type: 'hero',
        title: 'First Hero',
        subtitle: 'First subtitle',
        content: 'First content',
        image_url: 'https://example.com/first.jpg',
        button_text: 'First Button',
        button_url: 'https://example.com/first',
        is_active: true
      })
      .returning()
      .execute();

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    const secondResult = await db.insert(landingPageContentTable)
      .values({
        section_type: 'cta',
        title: 'Second CTA',
        subtitle: 'Second subtitle',
        content: 'Second content',
        image_url: 'https://example.com/second.jpg',
        button_text: 'Second Button',
        button_url: 'https://example.com/second',
        is_active: true
      })
      .returning()
      .execute();

    const results = await getLandingPageContent();
    
    expect(results).toHaveLength(2);
    // Most recently updated should come first
    expect(results[0].title).toBe('Second CTA');
    expect(results[1].title).toBe('First Hero');
    expect(results[0].updated_at >= results[1].updated_at).toBe(true);
  });
});

describe('getHeroContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return active hero content', async () => {
    // Insert hero content
    await db.insert(landingPageContentTable)
      .values({
        section_type: heroContent.section_type,
        title: heroContent.title,
        subtitle: heroContent.subtitle,
        content: heroContent.content,
        image_url: heroContent.image_url,
        button_text: heroContent.button_text,
        button_url: heroContent.button_url,
        is_active: heroContent.is_active
      })
      .execute();

    const result = await getHeroContent();

    expect(result).toBeDefined();
    expect(result?.section_type).toBe('hero');
    expect(result?.title).toBe('Welcome to Paw-some Toys');
    expect(result?.subtitle).toBe('The best toys for your furry friend');
    expect(result?.content).toBe('Discover our amazing collection of dog toys');
    expect(result?.image_url).toBe('https://example.com/hero.jpg');
    expect(result?.button_text).toBe('Shop Now');
    expect(result?.button_url).toBe('https://example.com/shop');
    expect(result?.is_active).toBe(true);
    expect(result?.id).toBeDefined();
    expect(result?.created_at).toBeInstanceOf(Date);
    expect(result?.updated_at).toBeInstanceOf(Date);
  });

  it('should return null when no active hero content exists', async () => {
    // Insert inactive hero content
    await db.insert(landingPageContentTable)
      .values({
        section_type: inactiveHeroContent.section_type,
        title: inactiveHeroContent.title,
        subtitle: inactiveHeroContent.subtitle,
        content: inactiveHeroContent.content,
        image_url: inactiveHeroContent.image_url,
        button_text: inactiveHeroContent.button_text,
        button_url: inactiveHeroContent.button_url,
        is_active: inactiveHeroContent.is_active
      })
      .execute();

    const result = await getHeroContent();
    expect(result).toBeNull();
  });

  it('should return null when no hero content exists at all', async () => {
    // Insert only CTA content
    await db.insert(landingPageContentTable)
      .values({
        section_type: ctaContent.section_type,
        title: ctaContent.title,
        subtitle: ctaContent.subtitle,
        content: ctaContent.content,
        image_url: ctaContent.image_url,
        button_text: ctaContent.button_text,
        button_url: ctaContent.button_url,
        is_active: ctaContent.is_active
      })
      .execute();

    const result = await getHeroContent();
    expect(result).toBeNull();
  });

  it('should return most recently updated hero when multiple exist', async () => {
    // Insert first hero
    await db.insert(landingPageContentTable)
      .values({
        section_type: 'hero',
        title: 'Old Hero',
        subtitle: 'Old subtitle',
        content: 'Old content',
        image_url: 'https://example.com/old.jpg',
        button_text: 'Old Button',
        button_url: 'https://example.com/old',
        is_active: true
      })
      .execute();

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Insert second hero
    await db.insert(landingPageContentTable)
      .values({
        section_type: 'hero',
        title: 'New Hero',
        subtitle: 'New subtitle',
        content: 'New content',
        image_url: 'https://example.com/new.jpg',
        button_text: 'New Button',
        button_url: 'https://example.com/new',
        is_active: true
      })
      .execute();

    const result = await getHeroContent();
    
    expect(result).toBeDefined();
    expect(result?.title).toBe('New Hero');
  });
});

describe('getCtaContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return active CTA content', async () => {
    // Insert CTA content
    await db.insert(landingPageContentTable)
      .values({
        section_type: ctaContent.section_type,
        title: ctaContent.title,
        subtitle: ctaContent.subtitle,
        content: ctaContent.content,
        image_url: ctaContent.image_url,
        button_text: ctaContent.button_text,
        button_url: ctaContent.button_url,
        is_active: ctaContent.is_active
      })
      .execute();

    const result = await getCtaContent();

    expect(result).toBeDefined();
    expect(result?.section_type).toBe('cta');
    expect(result?.title).toBe('Ready to Make Your Dog Happy?');
    expect(result?.subtitle).toBe('Get started today');
    expect(result?.content).toBe('Join thousands of happy pet owners');
    expect(result?.image_url).toBe('https://example.com/cta.jpg');
    expect(result?.button_text).toBe('Get Started');
    expect(result?.button_url).toBe('https://example.com/signup');
    expect(result?.is_active).toBe(true);
    expect(result?.id).toBeDefined();
    expect(result?.created_at).toBeInstanceOf(Date);
    expect(result?.updated_at).toBeInstanceOf(Date);
  });

  it('should return null when no active CTA content exists', async () => {
    // Insert inactive CTA content
    await db.insert(landingPageContentTable)
      .values({
        section_type: 'cta',
        title: 'Inactive CTA',
        subtitle: 'This should not appear',
        content: 'Inactive content',
        image_url: 'https://example.com/inactive-cta.jpg',
        button_text: 'Hidden',
        button_url: 'https://example.com/hidden',
        is_active: false
      })
      .execute();

    const result = await getCtaContent();
    expect(result).toBeNull();
  });

  it('should return null when no CTA content exists at all', async () => {
    // Insert only hero content
    await db.insert(landingPageContentTable)
      .values({
        section_type: heroContent.section_type,
        title: heroContent.title,
        subtitle: heroContent.subtitle,
        content: heroContent.content,
        image_url: heroContent.image_url,
        button_text: heroContent.button_text,
        button_url: heroContent.button_url,
        is_active: heroContent.is_active
      })
      .execute();

    const result = await getCtaContent();
    expect(result).toBeNull();
  });

  it('should return most recently updated CTA when multiple exist', async () => {
    // Insert first CTA
    await db.insert(landingPageContentTable)
      .values({
        section_type: 'cta',
        title: 'Old CTA',
        subtitle: 'Old CTA subtitle',
        content: 'Old CTA content',
        image_url: 'https://example.com/old-cta.jpg',
        button_text: 'Old CTA Button',
        button_url: 'https://example.com/old-cta',
        is_active: true
      })
      .execute();

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Insert second CTA
    await db.insert(landingPageContentTable)
      .values({
        section_type: 'cta',
        title: 'New CTA',
        subtitle: 'New CTA subtitle',
        content: 'New CTA content',
        image_url: 'https://example.com/new-cta.jpg',
        button_text: 'New CTA Button',
        button_url: 'https://example.com/new-cta',
        is_active: true
      })
      .execute();

    const result = await getCtaContent();
    
    expect(result).toBeDefined();
    expect(result?.title).toBe('New CTA');
  });
});