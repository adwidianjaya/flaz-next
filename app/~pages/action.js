"use server";

import { db } from "@/lib/db/drizzle";
import { pageTable, pageDeletedTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import fs from "node:fs";
import path from "node:path";
import { sql } from "drizzle-orm";

export const saveCurrentPageName = async ({ name, path }) => {
  const normalizedName = name === undefined ? undefined : name.trim();
  console.log("...saveCurrentPageName", {
    name,
    normalizedName,
    path,
  });

  await db
    .update(pageTable)
    .set({
      name: normalizedName ?? "",
    })
    .where(eq(pageTable.path, path));

  revalidatePath("/~pages");
  revalidatePath(`/~pages/edit${path}`);

  return {
    success: true,
  };
};

export const saveCurrentPage = async ({
  name,
  path: currentPath,
  definition,
  schema,
}) => {
  const normalizedName = name === undefined ? undefined : name.trim();
  console.log(
    "...saveCurrentPage",
    {
      name,
      normalizedName,
      currentPath,
    },
    // definition.elements["form-title"].props,
  );

  const payload = {
    name: normalizedName ?? "",
    definition,
    schema,
  };
  await db
    .insert(pageTable)
    .values({
      path: currentPath,
      ...payload,
    })
    .onConflictDoUpdate({
      target: [pageTable.path],
      set: {
        ...payload,
      },
    });

  let pages = await db
    .select()
    .from(pageTable)
    .where(eq(pageTable.path, currentPath))
    .limit(1);
  let currentPage = pages[0];
  // console.log("...saveCurrentPage", { currentPage, name, currentPath });

  if (currentPage) {
    const fileName = ("root" + currentPath.split("/").join(".") + ".json")
      .split("..")
      .join(".");
    fs.writeFileSync(
      path.join(process.cwd(), "tmp/pages", fileName),
      JSON.stringify(currentPage.definition, null, 2),
    );
  }

  return {
    success: true,
  };
};

export const deletePage = async ({ pageId, path: pagePath }) => {
  console.log("...deletePage", { pageId, pagePath });

  // Get the page to copy to deleted table
  const pages = await db
    .select()
    .from(pageTable)
    .where(eq(pageTable.id, pageId))
    .limit(1);

  if (!pages.length) {
    return { success: false, error: "Page not found" };
  }

  const page = pages[0];

  // Insert into deleted table with current timestamp
  await db.insert(pageDeletedTable).values({
    id: page.id,
    name: page.name,
    path: page.path,
    schema: page.schema,
    definition: page.definition,
    created_at: page.created_at,
    updated_at: page.updated_at,
    deleted_at: sql`now()`,
  });

  // Delete from active table
  await db.delete(pageTable).where(eq(pageTable.id, pageId));

  revalidatePath("/~pages");

  return { success: true };
};
