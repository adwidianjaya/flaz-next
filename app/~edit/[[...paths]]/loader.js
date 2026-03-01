import { pageTable } from "@/lib/db/schema";
import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_PAGE = {
  schema: {},
  definition: {
    root: "",
    states: {},
    elements: {},
  },
};

export const loadCurrentPage = async (currentPath) => {
  console.log("...loadCurrentPage", { currentPath });

  let pages = await db
    .select()
    .from(pageTable)
    .where(eq(pageTable.path, currentPath));
  let currentPage = pages[0];

  if (currentPage) {
    const fileName = ("root" + currentPath.split("/").join(".") + ".json")
      .split("..")
      .join(".");
    fs.writeFileSync(
      path.join(process.cwd(), "tmp/pages", fileName),
      JSON.stringify(currentPage.definition, null, 2),
    );
  }

  // console.log({ currentPage });
  return currentPage;
};
