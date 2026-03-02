"use server";

import { db } from "@/lib/db/drizzle";
import { assetTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addAsset({ name, url, type, mime_type, size, width, height }) {
  try {
    const [newAsset] = await db
      .insert(assetTable)
      .values({
        name,
        url,
        type: type || "image",
        mime_type,
        size,
        width: width?.toString(),
        height: height?.toString(),
      })
      .returning();

    revalidatePath("/~assets");
    return { success: true, asset: newAsset };
  } catch (error) {
    console.error("Failed to add asset:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAsset({ assetId }) {
  try {
    await db.delete(assetTable).where(eq(assetTable.id, assetId));
    revalidatePath("/~assets");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete asset:", error);
    return { success: false, error: error.message };
  }
}
