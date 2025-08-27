import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { dogToysTable } from '../db/schema';
import { getDogToys, getFeaturedDogToys } from '../handlers/get_dog_toys';

// Test data for dog toys
const testToys = [
  {
    name: 'Squeaky Ball',
    description: 'A fun squeaky ball for fetch',
    image_url: 'https://example.com/squeaky-ball.jpg',
    category: 'fetch' as const,
    price: '12.99',
    featured: true
  },
  {
    name: 'Rope Toy',
    description: 'Durable rope toy for tugging',
    image_url: 'https://example.com/rope-toy.jpg',
    category: 'rope' as const,
    price: '8.50',
    featured: false
  },
  {
    name: 'Interactive Puzzle',
    description: 'Mental stimulation puzzle toy',
    image_url: 'https://example.com/puzzle.jpg',
    category: 'interactive' as const,
    price: '24.99',
    featured: true
  },
  {
    name: 'Chew Bone',
    description: 'Long-lasting chew bone',
    image_url: 'https://example.com/chew-bone.jpg',
    category: 'chew' as const,
    price: '15.75',
    featured: false
  }
];

describe('getDogToys', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no toys exist', async () => {
    const result = await getDogToys();
    expect(result).toEqual([]);
  });

  it('should fetch all dog toys', async () => {
    // Insert test data
    await db.insert(dogToysTable).values(testToys).execute();

    const result = await getDogToys();

    expect(result).toHaveLength(4);
    
    // Verify all toys are returned
    expect(result.map(toy => toy.name).sort()).toEqual([
      'Chew Bone',
      'Interactive Puzzle',
      'Rope Toy',
      'Squeaky Ball'
    ]);

    // Verify data structure and types
    result.forEach(toy => {
      expect(toy.id).toBeDefined();
      expect(typeof toy.name).toBe('string');
      expect(typeof toy.description).toBe('string');
      expect(typeof toy.image_url).toBe('string');
      expect(['chew', 'fetch', 'interactive', 'plush', 'rope']).toContain(toy.category);
      expect(typeof toy.price).toBe('number'); // Numeric conversion check
      expect(typeof toy.featured).toBe('boolean');
      expect(toy.created_at).toBeInstanceOf(Date);
    });
  });

  it('should convert price from string to number correctly', async () => {
    // Insert single toy with specific price
    await db.insert(dogToysTable).values([testToys[0]]).execute();

    const result = await getDogToys();

    expect(result).toHaveLength(1);
    expect(result[0].price).toBe(12.99);
    expect(typeof result[0].price).toBe('number');
  });

  it('should preserve all toy properties', async () => {
    // Insert single toy
    await db.insert(dogToysTable).values([testToys[2]]).execute();

    const result = await getDogToys();

    expect(result).toHaveLength(1);
    const toy = result[0];
    expect(toy.name).toBe('Interactive Puzzle');
    expect(toy.description).toBe('Mental stimulation puzzle toy');
    expect(toy.image_url).toBe('https://example.com/puzzle.jpg');
    expect(toy.category).toBe('interactive');
    expect(toy.price).toBe(24.99);
    expect(toy.featured).toBe(true);
    expect(toy.id).toBeDefined();
    expect(toy.created_at).toBeInstanceOf(Date);
  });
});

describe('getFeaturedDogToys', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no featured toys exist', async () => {
    // Insert only non-featured toys
    await db.insert(dogToysTable).values([testToys[1], testToys[3]]).execute();

    const result = await getFeaturedDogToys();
    expect(result).toEqual([]);
  });

  it('should return empty array when no toys exist at all', async () => {
    const result = await getFeaturedDogToys();
    expect(result).toEqual([]);
  });

  it('should fetch only featured dog toys', async () => {
    // Insert all test toys (2 featured, 2 not featured)
    await db.insert(dogToysTable).values(testToys).execute();

    const result = await getFeaturedDogToys();

    expect(result).toHaveLength(2);
    
    // Verify only featured toys are returned
    const featuredNames = result.map(toy => toy.name).sort();
    expect(featuredNames).toEqual(['Interactive Puzzle', 'Squeaky Ball']);

    // Verify all returned toys are featured
    result.forEach(toy => {
      expect(toy.featured).toBe(true);
    });
  });

  it('should convert price from string to number for featured toys', async () => {
    // Insert featured toys
    await db.insert(dogToysTable).values([testToys[0], testToys[2]]).execute();

    const result = await getFeaturedDogToys();

    expect(result).toHaveLength(2);
    result.forEach(toy => {
      expect(typeof toy.price).toBe('number');
    });

    // Verify specific prices
    const squeakyBall = result.find(toy => toy.name === 'Squeaky Ball');
    const puzzle = result.find(toy => toy.name === 'Interactive Puzzle');
    
    expect(squeakyBall?.price).toBe(12.99);
    expect(puzzle?.price).toBe(24.99);
  });

  it('should preserve all featured toy properties', async () => {
    // Insert one featured toy
    await db.insert(dogToysTable).values([testToys[0]]).execute();

    const result = await getFeaturedDogToys();

    expect(result).toHaveLength(1);
    const toy = result[0];
    expect(toy.name).toBe('Squeaky Ball');
    expect(toy.description).toBe('A fun squeaky ball for fetch');
    expect(toy.image_url).toBe('https://example.com/squeaky-ball.jpg');
    expect(toy.category).toBe('fetch');
    expect(toy.price).toBe(12.99);
    expect(toy.featured).toBe(true);
    expect(toy.id).toBeDefined();
    expect(toy.created_at).toBeInstanceOf(Date);
  });

  it('should not return non-featured toys even if other toys exist', async () => {
    // Insert mix of featured and non-featured toys
    await db.insert(dogToysTable).values(testToys).execute();

    const result = await getFeaturedDogToys();

    expect(result).toHaveLength(2);
    
    // Ensure no non-featured toys are included
    const nonFeaturedNames = ['Rope Toy', 'Chew Bone'];
    result.forEach(toy => {
      expect(nonFeaturedNames).not.toContain(toy.name);
      expect(toy.featured).toBe(true);
    });
  });
});