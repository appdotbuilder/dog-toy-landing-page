import { db } from '../db';
import { dogToysTable } from '../db/schema';
import { type CreateDogToyInput, type DogToy } from '../schema';

export const createDogToy = async (input: CreateDogToyInput): Promise<DogToy> => {
  try {
    // Insert dog toy record
    const result = await db.insert(dogToysTable)
      .values({
        name: input.name,
        description: input.description,
        image_url: input.image_url,
        category: input.category,
        price: input.price.toString(), // Convert number to string for numeric column
        featured: input.featured
      })
      .returning()
      .execute();

    // Convert numeric fields back to numbers before returning
    const dogToy = result[0];
    return {
      ...dogToy,
      price: parseFloat(dogToy.price) // Convert string back to number
    };
  } catch (error) {
    console.error('Dog toy creation failed:', error);
    throw error;
  }
};