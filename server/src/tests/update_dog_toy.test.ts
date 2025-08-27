import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { dogToysTable } from '../db/schema';
import { type UpdateDogToyInput, type CreateDogToyInput } from '../schema';
import { updateDogToy } from '../handlers/update_dog_toy';
import { eq } from 'drizzle-orm';

// Helper function to create a test dog toy
const createTestDogToy = async (input: CreateDogToyInput) => {
  const result = await db.insert(dogToysTable)
    .values({
      name: input.name,
      description: input.description,
      image_url: input.image_url,
      category: input.category,
      price: input.price.toString(),
      featured: input.featured
    })
    .returning()
    .execute();

  return {
    ...result[0],
    price: parseFloat(result[0].price)
  };
};

// Test input for creating initial dog toy
const initialDogToy: CreateDogToyInput = {
  name: 'Original Toy',
  description: 'Original description',
  image_url: 'https://example.com/original.jpg',
  category: 'chew',
  price: 15.99,
  featured: false
};

describe('updateDogToy', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update a dog toy with all fields', async () => {
    // Create initial dog toy
    const createdToy = await createTestDogToy(initialDogToy);

    const updateInput: UpdateDogToyInput = {
      id: createdToy.id,
      name: 'Updated Toy Name',
      description: 'Updated description',
      image_url: 'https://example.com/updated.jpg',
      category: 'fetch',
      price: 24.99,
      featured: true
    };

    const result = await updateDogToy(updateInput);

    // Verify all fields were updated
    expect(result.id).toEqual(createdToy.id);
    expect(result.name).toEqual('Updated Toy Name');
    expect(result.description).toEqual('Updated description');
    expect(result.image_url).toEqual('https://example.com/updated.jpg');
    expect(result.category).toEqual('fetch');
    expect(result.price).toEqual(24.99);
    expect(typeof result.price).toEqual('number');
    expect(result.featured).toEqual(true);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update only specified fields', async () => {
    // Create initial dog toy
    const createdToy = await createTestDogToy(initialDogToy);

    const updateInput: UpdateDogToyInput = {
      id: createdToy.id,
      name: 'Partially Updated Name',
      price: 29.99
    };

    const result = await updateDogToy(updateInput);

    // Verify only specified fields were updated
    expect(result.name).toEqual('Partially Updated Name');
    expect(result.price).toEqual(29.99);
    // Other fields should remain unchanged
    expect(result.description).toEqual(initialDogToy.description);
    expect(result.image_url).toEqual(initialDogToy.image_url);
    expect(result.category).toEqual(initialDogToy.category);
    expect(result.featured).toEqual(initialDogToy.featured);
  });

  it('should update the dog toy in database', async () => {
    // Create initial dog toy
    const createdToy = await createTestDogToy(initialDogToy);

    const updateInput: UpdateDogToyInput = {
      id: createdToy.id,
      name: 'Database Updated Toy',
      price: 19.99,
      featured: true
    };

    await updateDogToy(updateInput);

    // Verify changes were persisted in database
    const dbToys = await db.select()
      .from(dogToysTable)
      .where(eq(dogToysTable.id, createdToy.id))
      .execute();

    expect(dbToys).toHaveLength(1);
    expect(dbToys[0].name).toEqual('Database Updated Toy');
    expect(parseFloat(dbToys[0].price)).toEqual(19.99);
    expect(dbToys[0].featured).toEqual(true);
    expect(dbToys[0].created_at).toBeInstanceOf(Date);
  });

  it('should update only featured status', async () => {
    // Create initial dog toy
    const createdToy = await createTestDogToy(initialDogToy);

    const updateInput: UpdateDogToyInput = {
      id: createdToy.id,
      featured: true
    };

    const result = await updateDogToy(updateInput);

    expect(result.featured).toEqual(true);
    expect(result.name).toEqual(initialDogToy.name);
    expect(result.price).toEqual(initialDogToy.price);
  });

  it('should handle category updates', async () => {
    // Create initial dog toy
    const createdToy = await createTestDogToy(initialDogToy);

    const updateInput: UpdateDogToyInput = {
      id: createdToy.id,
      category: 'interactive'
    };

    const result = await updateDogToy(updateInput);

    expect(result.category).toEqual('interactive');
    expect(result.name).toEqual(initialDogToy.name);
    expect(result.price).toEqual(initialDogToy.price);
  });

  it('should throw error when dog toy does not exist', async () => {
    const updateInput: UpdateDogToyInput = {
      id: 99999, // Non-existent ID
      name: 'Updated Name'
    };

    await expect(updateDogToy(updateInput)).rejects.toThrow(/Dog toy with id 99999 not found/i);
  });

  it('should handle numeric price conversion correctly', async () => {
    // Create initial dog toy
    const createdToy = await createTestDogToy(initialDogToy);

    const updateInput: UpdateDogToyInput = {
      id: createdToy.id,
      price: 123.45
    };

    const result = await updateDogToy(updateInput);

    expect(result.price).toEqual(123.45);
    expect(typeof result.price).toEqual('number');

    // Verify in database storage
    const dbToy = await db.select()
      .from(dogToysTable)
      .where(eq(dogToysTable.id, createdToy.id))
      .execute();

    expect(parseFloat(dbToy[0].price)).toEqual(123.45);
  });

  it('should handle boolean featured field correctly', async () => {
    // Create initial dog toy with featured = false
    const createdToy = await createTestDogToy({
      ...initialDogToy,
      featured: false
    });

    // Update to featured = true
    let updateInput: UpdateDogToyInput = {
      id: createdToy.id,
      featured: true
    };

    let result = await updateDogToy(updateInput);
    expect(result.featured).toEqual(true);

    // Update back to featured = false
    updateInput = {
      id: createdToy.id,
      featured: false
    };

    result = await updateDogToy(updateInput);
    expect(result.featured).toEqual(false);
  });
});