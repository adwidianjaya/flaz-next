import { pageTable } from "@/lib/db/schema";
import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";

const DEFAULT_PAGE = {
  schema: {},
  definition: {
    root: "",
    states: {},
    elements: {},
  },
};

export const loadCurrentPage = async (path) => {
  let pages = await db.select().from(pageTable).where(eq(pageTable.path, path));
  let currentPage = pages[0] || DEFAULT_PAGE;

  return currentPage;
};
