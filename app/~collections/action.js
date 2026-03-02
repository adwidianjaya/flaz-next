"use server";

import { db } from "@/lib/db/drizzle";
import { collectionTable, collectionDeletedTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sql } from "drizzle-orm";

export const createCollection = async ({ name }) => {
  const normalizedName = name?.trim();
  console.log("...createCollection", { normalizedName });

  if (!normalizedName) {
    return { success: false, error: "Collection name is required" };
  }

  try {
    const result = await db
      .insert(collectionTable)
      .values({
        name: normalizedName,
        schema: {},
      })
      .returning();

    revalidatePath("/~collections");
    return { success: true, collection: result[0] };
  } catch (error) {
    console.error("Create collection error:", error);
    return { success: false, error: "Failed to create collection" };
  }
};

export const saveCurrentCollectionName = async ({ name, collectionId }) => {
  const normalizedName = name === undefined ? undefined : name.trim();
  console.log("...saveCurrentCollectionName", {
    name,
    normalizedName,
    collectionId,
  });

  if (!normalizedName) {
    return { success: false, error: "Collection name is required" };
  }

  try {
    await db
      .update(collectionTable)
      .set({
        name: normalizedName,
      })
      .where(eq(collectionTable.id, collectionId));

    revalidatePath("/~collections");
    revalidatePath(`/~collections/edit/${collectionId}`);

    return { success: true };
  } catch (error) {
    console.error("Save collection name error:", error);
    return { success: false, error: "Failed to save collection name" };
  }
};

export const saveCurrentCollection = async ({ collectionId, schema }) => {
  console.log("...saveCurrentCollection", { collectionId });

  try {
    await db
      .update(collectionTable)
      .set({
        schema,
      })
      .where(eq(collectionTable.id, collectionId));

    revalidatePath("/~collections");
    revalidatePath(`/~collections/edit/${collectionId}`);

    return { success: true };
  } catch (error) {
    console.error("Save collection error:", error);
    return { success: false, error: "Failed to save collection" };
  }
};

export const deleteCollection = async ({ collectionId }) => {
  console.log("...deleteCollection", { collectionId });

  try {
    // Get the collection to copy to deleted table
    const collections = await db
      .select()
      .from(collectionTable)
      .where(eq(collectionTable.id, collectionId))
      .limit(1);

    if (!collections.length) {
      return { success: false, error: "Collection not found" };
    }

    const collection = collections[0];

    // Insert into deleted table with current timestamp
    await db.insert(collectionDeletedTable).values({
      id: collection.id,
      name: collection.name,
      schema: collection.schema,
      created_at: collection.created_at,
      updated_at: collection.updated_at,
      deleted_at: sql`now()`,
    });

    // Delete from active table
    await db.delete(collectionTable).where(eq(collectionTable.id, collectionId));

    revalidatePath("/~collections");

    return { success: true };
  } catch (error) {
    console.error("Delete collection error:", error);
    return { success: false, error: "Failed to delete collection" };
  }
};
