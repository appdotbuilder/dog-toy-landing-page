import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { dogToysTable } from '../db/schema';
import { type CreateDogToyInput } from '../schema';
import { deleteDogToy } from '../handlers/delete_dog_toy';
import { eq } from 'drizzle-orm';

// Test data for creating dog toys
const testDogToy: CreateDogToyInput = {
  name: 'Test Chew Toy',
  description: 'A durable chew toy for testing',
  image_url: 'https://example.com/toy.jpg',
  category: 'chew',
  price: 15.99,
  featured: false
};

const anotherTestToy: CreateDogToyInput = {
  name: 'Interactive Ball',
  description: 'An interactive ball for dogs',
  image_url: 'https://example.com/ball.jpg',
  category: 'interactive',
  price: 25.50,
  featured: true
};

describe('deleteDogToy', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should successfully delete an existing dog toy', async () => {
    // Create a test dog toy
    const insertResult = await db.insert(dogToysTable)
      .values({
        name: testDogToy.name,
        description: testDogToy.description,
        image_url: testDogToy.image_url,
        category: testDogToy.category,
        price: testDogToy.price.toString(),
        featured: testDogToy.featured
      })
      .returning()
      .execute();

    const createdToy = insertResult[0];

    // Delete the dog toy
    const result = await deleteDogToy(createdToy.id);

    // Verify successful deletion response
    expect(result.success).toBe(true);
    expect(result.message).toEqual(`Dog toy with ID ${createdToy.id} deleted successfully`);
  });

  it('should remove the dog toy from the database', async () => {
    // Create a test dog toy
    const insertResult = await db.insert(dogToysTable)
      .values({
        name: testDogToy.name,
        description: testDogToy.description,
        image_url: testDogToy.image_url,
        category: testDogToy.category,
        price: testDogToy.price.toString(),
        featured: testDogToy.featured
      })
      .returning()
      .execute();

    const createdToy = insertResult[0];

    // Verify toy exists before deletion
    const beforeDeletion = await db.select()
      .from(dogToysTable)
      .where(eq(dogToysTable.id, createdToy.id))
      .execute();
    expect(beforeDeletion).toHaveLength(1);

    // Delete the dog toy
    await deleteDogToy(createdToy.id);

    // Verify toy no longer exists in database
    const afterDeletion = await db.select()
      .from(dogToysTable)
      .where(eq(dogToysTable.id, createdToy.id))
      .execute();
    expect(afterDeletion).toHaveLength(0);
  });

  it('should return failure when trying to delete non-existent dog toy', async () => {
    const nonExistentId = 99999;

    const result = await deleteDogToy(nonExistentId);

    expect(result.success).toBe(false);
    expect(result.message).toEqual(`Dog toy with ID ${nonExistentId} not found`);
  });

  it('should only delete the specified dog toy and leave others unchanged', async () => {
    // Create multiple test dog toys
    const firstToyResult = await db.insert(dogToysTable)
      .values({
        name: testDogToy.name,
        description: testDogToy.description,
        image_url: testDogToy.image_url,
        category: testDogToy.category,
        price: testDogToy.price.toString(),
        featured: testDogToy.featured
      })
      .returning()
      .execute();

    const secondToyResult = await db.insert(dogToysTable)
      .values({
        name: anotherTestToy.name,
        description: anotherTestToy.description,
        image_url: anotherTestToy.image_url,
        category: anotherTestToy.category,
        price: anotherTestToy.price.toString(),
        featured: anotherTestToy.featured
      })
      .returning()
      .execute();

    const firstToy = firstToyResult[0];
    const secondToy = secondToyResult[0];

    // Delete only the first toy
    const result = await deleteDogToy(firstToy.id);

    // Verify successful deletion
    expect(result.success).toBe(true);

    // Verify first toy is deleted
    const firstToyCheck = await db.select()
      .from(dogToysTable)
      .where(eq(dogToysTable.id, firstToy.id))
      .execute();
    expect(firstToyCheck).toHaveLength(0);

    // Verify second toy still exists
    const secondToyCheck = await db.select()
      .from(dogToysTable)
      .where(eq(dogToysTable.id, secondToy.id))
      .execute();
    expect(secondToyCheck).toHaveLength(1);
    expect(secondToyCheck[0].name).toEqual(anotherTestToy.name);
  });

  it('should handle deletion with various dog toy categories', async () => {
    // Create toys with different categories
    const categories = ['chew', 'fetch', 'interactive', 'plush', 'rope'] as const;
    const createdToys = [];

    for (const category of categories) {
      const toyResult = await db.insert(dogToysTable)
        .values({
          name: `${category} toy`,
          description: `A ${category} toy for testing`,
          image_url: `https://example.com/${category}.jpg`,
          category: category,
          price: '19.99',
          featured: false
        })
        .returning()
        .execute();
      
      createdToys.push(toyResult[0]);
    }

    // Delete toys of different categories
    for (const toy of createdToys) {
      const result = await deleteDogToy(toy.id);
      expect(result.success).toBe(true);
      expect(result.message).toEqual(`Dog toy with ID ${toy.id} deleted successfully`);
    }

    // Verify all toys are deleted
    const remainingToys = await db.select().from(dogToysTable).execute();
    expect(remainingToys).toHaveLength(0);
  });
});