import { collectionTable } from "@/lib/db/schema";
import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { buildCollectionSchema } from "./schema";

const DEFAULT_COLLECTION = {
  schema: buildCollectionSchema(),
};

export const loadCurrentCollection = async (collectionId) => {
  console.log("...loadCurrentCollection", { collectionId });

  let collections = await db
    .select()
    .from(collectionTable)
    .where(eq(collectionTable.id, collectionId));
  let currentCollection = collections[0];

  if (currentCollection) {
    currentCollection = {
      ...currentCollection,
      schema: buildCollectionSchema(currentCollection.schema),
    };
  }

  return currentCollection || DEFAULT_COLLECTION;
};
