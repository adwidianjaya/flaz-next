"use server";

import { db } from "@/lib/db/drizzle";
import { configTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getConfigs() {
  const rows = await db.select().from(configTable);
  const configMap = {};
  rows.forEach((row) => {
    configMap[row.key] = row.value;
  });
  return configMap;
}

export async function updateConfigs(configs) {
  try {
    for (const [key, value] of Object.entries(configs)) {
      await db
        .insert(configTable)
        .values({ key, value, updated_at: new Date() })
        .onConflictDoUpdate({
          target: configTable.key,
          set: { value, updated_at: new Date() },
        });
    }
    revalidatePath("/~config");
    return { success: true };
  } catch (error) {
    console.error("Failed to update configs:", error);
    return { success: false, error: error.message };
  }
}
