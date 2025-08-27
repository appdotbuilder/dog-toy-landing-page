import { db } from '../db';
import { dogToysTable } from '../db/schema';
import { type DogToy } from '../schema';
import { eq } from 'drizzle-orm';

export const getDogToys = async (): Promise<DogToy[]> => {
  try {
    const results = await db.select()
      .from(dogToysTable)
      .execute();

    // Convert numeric fields back to numbers before returning
    return results.map(toy => ({
      ...toy,
      price: parseFloat(toy.price) // Convert string back to number
    }));
  } catch (error) {
    console.error('Fetching dog toys failed:', error);
    throw error;
  }
};

export const getFeaturedDogToys = async (): Promise<DogToy[]> => {
  try {
    const results = await db.select()
      .from(dogToysTable)
      .where(eq(dogToysTable.featured, true))
      .execute();

    // Convert numeric fields back to numbers before returning
    return results.map(toy => ({
      ...toy,
      price: parseFloat(toy.price) // Convert string back to number
    }));
  } catch (error) {
    console.error('Fetching featured dog toys failed:', error);
    throw error;
  }
};