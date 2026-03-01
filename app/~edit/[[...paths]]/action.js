"use server";

import { db } from "@/lib/db/drizzle";
import { pageTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";

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
