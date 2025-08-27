import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { dogToysTable } from '../db/schema';
import { type CreateDogToyInput } from '../schema';
import { createDogToy } from '../handlers/create_dog_toy';
import { eq } from 'drizzle-orm';

// Complete test input with all required fields
const testInput: CreateDogToyInput = {
  name: 'Squeaky Ball',
  description: 'A fun squeaky ball for dogs to fetch and play with',
  image_url: 'https://example.com/squeaky-ball.jpg',
  category: 'fetch',
  price: 15.99,
  featured: false
};

// Test input for featured toy
const featuredToyInput: CreateDogToyInput = {
  name: 'Premium Rope Toy',
  description: 'High-quality rope toy for heavy chewers',
  image_url: 'https://example.com/rope-toy.jpg',
  category: 'rope',
  price: 24.50,
  featured: true
};

describe('createDogToy', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a dog toy with all fields', async () => {
    const result = await createDogToy(testInput);

    // Basic field validation
    expect(result.name).toEqual('Squeaky Ball');
    expect(result.description).toEqual(testInput.description);
    expect(result.image_url).toEqual(testInput.image_url);
    expect(result.category).toEqual('fetch');
    expect(result.price).toEqual(15.99);
    expect(typeof result.price).toEqual('number'); // Ensure numeric conversion
    expect(result.featured).toEqual(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a featured dog toy', async () => {
    const result = await createDogToy(featuredToyInput);

    expect(result.name).toEqual('Premium Rope Toy');
    expect(result.category).toEqual('rope');
    expect(result.price).toEqual(24.50);
    expect(typeof result.price).toEqual('number');
    expect(result.featured).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save dog toy to database', async () => {
    const result = await createDogToy(testInput);

    // Query using proper drizzle syntax
    const dogToys = await db.select()
      .from(dogToysTable)
      .where(eq(dogToysTable.id, result.id))
      .execute();

    expect(dogToys).toHaveLength(1);
    expect(dogToys[0].name).toEqual('Squeaky Ball');
    expect(dogToys[0].description).toEqual(testInput.description);
    expect(dogToys[0].image_url).toEqual(testInput.image_url);
    expect(dogToys[0].category).toEqual('fetch');
    expect(parseFloat(dogToys[0].price)).toEqual(15.99); // Database stores as string
    expect(dogToys[0].featured).toEqual(false);
    expect(dogToys[0].created_at).toBeInstanceOf(Date);
  });

  it('should create multiple dog toys with different categories', async () => {
    const chewToyInput: CreateDogToyInput = {
      name: 'Dental Chew Bone',
      description: 'Helps clean teeth while chewing',
      image_url: 'https://example.com/chew-bone.jpg',
      category: 'chew',
      price: 12.99,
      featured: false
    };

    const interactiveToyInput: CreateDogToyInput = {
      name: 'Puzzle Feeder',
      description: 'Interactive puzzle that dispenses treats',
      image_url: 'https://example.com/puzzle-feeder.jpg',
      category: 'interactive',
      price: 29.99,
      featured: true
    };

    const chewToy = await createDogToy(chewToyInput);
    const interactiveToy = await createDogToy(interactiveToyInput);

    expect(chewToy.category).toEqual('chew');
    expect(chewToy.price).toEqual(12.99);
    expect(chewToy.featured).toEqual(false);

    expect(interactiveToy.category).toEqual('interactive');
    expect(interactiveToy.price).toEqual(29.99);
    expect(interactiveToy.featured).toEqual(true);

    // Verify both are in database
    const allToys = await db.select().from(dogToysTable).execute();
    expect(allToys).toHaveLength(2);
  });

  it('should handle decimal prices correctly', async () => {
    const precisionTestInput: CreateDogToyInput = {
      name: 'Precision Price Toy',
      description: 'Testing decimal precision',
      image_url: 'https://example.com/precision-toy.jpg',
      category: 'plush',
      price: 19.95,
      featured: false
    };

    const result = await createDogToy(precisionTestInput);

    expect(result.price).toEqual(19.95);
    expect(typeof result.price).toEqual('number');

    // Verify in database
    const savedToy = await db.select()
      .from(dogToysTable)
      .where(eq(dogToysTable.id, result.id))
      .execute();

    expect(parseFloat(savedToy[0].price)).toEqual(19.95);
  });

  it('should create toys with all available categories', async () => {
    const categories = ['chew', 'fetch', 'interactive', 'plush', 'rope'] as const;
    const createdToys = [];

    for (let i = 0; i < categories.length; i++) {
      const categoryInput: CreateDogToyInput = {
        name: `${categories[i]} toy`,
        description: `A ${categories[i]} toy for testing`,
        image_url: `https://example.com/${categories[i]}-toy.jpg`,
        category: categories[i],
        price: 10.99 + i,
        featured: i % 2 === 0
      };

      const toy = await createDogToy(categoryInput);
      createdToys.push(toy);
      expect(toy.category).toEqual(categories[i]);
    }

    expect(createdToys).toHaveLength(5);

    // Verify all categories are represented
    const uniqueCategories = [...new Set(createdToys.map(toy => toy.category))];
    expect(uniqueCategories).toHaveLength(5);
  });
});