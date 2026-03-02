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

export async function searchUnsplash(query) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return { success: false, error: "Unsplash API key not configured" };
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      results: data.results.map((img) => ({
        id: img.id,
        url: img.urls.regular,
        thumb: img.urls.small,
        alt: img.alt_description || img.description || "Unsplash image",
        user: img.user.name,
        width: img.width,
        height: img.height,
      })),
    };
  } catch (error) {
    console.error("Unsplash search failed:", error);
    return { success: false, error: error.message };
  }
}
