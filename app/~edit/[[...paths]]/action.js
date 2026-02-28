"use server";

import { db } from "@/lib/db/drizzle";
import { pageTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const saveCurrentPage = async ({ name, path, definition, schema }) => {
  const normalizedName = name === undefined ? undefined : name.trim();
  // console.log("...saveCurrentPage", { name, normalizedName, path });

  const payload = {
    name: normalizedName ?? "",
    definition,
    schema,
  };
  await db
    .insert(pageTable)
    .values({
      path,
      ...payload,
    })
    .onConflictDoUpdate({
      target: [pageTable.path],
      set: {
        ...payload,
      },
    });

  // let pages = await db
  //   .select()
  //   .from(pageTable)
  //   .where(eq(pageTable.path, currentPath));
  // let currentPage = pages[0];
  // console.log("...saveCurrentPage", { currentPage, name, path });

  // const fileName = ("root" + currentPath.split("/").join(".") + ".json")
  //   .split("..")
  //   .join(".");
  // fs.writeFileSync(
  //   path.join(process.cwd(), "src/data/pages", fileName),
  //   JSON.stringify(currentPage.definition, null, 2),
  // );

  return {
    success: true,
  };
};
