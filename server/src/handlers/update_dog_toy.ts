import { db } from '../db';
import { dogToysTable } from '../db/schema';
import { type UpdateDogToyInput, type DogToy } from '../schema';
import { eq } from 'drizzle-orm';

export const updateDogToy = async (input: UpdateDogToyInput): Promise<DogToy> => {
  try {
    // Build update object with only provided fields
    const updateData: Record<string, any> = {};
    
    if (input.name !== undefined) updateData['name'] = input.name;
    if (input.description !== undefined) updateData['description'] = input.description;
    if (input.image_url !== undefined) updateData['image_url'] = input.image_url;
    if (input.category !== undefined) updateData['category'] = input.category;
    if (input.price !== undefined) updateData['price'] = input.price.toString(); // Convert number to string for numeric column
    if (input.featured !== undefined) updateData['featured'] = input.featured;

    // Update the dog toy record
    const result = await db.update(dogToysTable)
      .set(updateData)
      .where(eq(dogToysTable.id, input.id))
      .returning()
      .execute();

    // Check if the toy was found and updated
    if (result.length === 0) {
      throw new Error(`Dog toy with id ${input.id} not found`);
    }

    // Convert numeric fields back to numbers before returning
    const dogToy = result[0];
    return {
      ...dogToy,
      price: parseFloat(dogToy.price) // Convert string back to number
    };
  } catch (error) {
    console.error('Dog toy update failed:', error);
    throw error;
  }
};