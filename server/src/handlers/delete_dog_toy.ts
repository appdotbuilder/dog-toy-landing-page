import { db } from '../db';
import { dogToysTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const deleteDogToy = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    // First check if the dog toy exists
    const existingToy = await db.select()
      .from(dogToysTable)
      .where(eq(dogToysTable.id, id))
      .execute();

    if (existingToy.length === 0) {
      return {
        success: false,
        message: `Dog toy with ID ${id} not found`
      };
    }

    // Delete the dog toy
    await db.delete(dogToysTable)
      .where(eq(dogToysTable.id, id))
      .execute();

    return {
      success: true,
      message: `Dog toy with ID ${id} deleted successfully`
    };
  } catch (error) {
    console.error('Dog toy deletion failed:', error);
    throw error;
  }
};