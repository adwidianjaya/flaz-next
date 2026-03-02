import { db } from "@/lib/db/drizzle";
import { collectionTable } from "@/lib/db/schema";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CollectionTable, { CreateCollectionButton } from "./collection-table";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Collections",
};

export default async function Page() {
  const collections = await db.select().from(collectionTable);

  return (
    <div className="min-h-dvh bg-stone-50 p-6">
      <div className="mx-auto max-w-6xl">
        <Card className="gap-0 overflow-hidden border-gray-200 bg-white shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <div>
              <CardTitle>Collections</CardTitle>
              <CardDescription>
                Manage collection schemas and jump directly into the editor.
              </CardDescription>
            </div>
            <CardAction>
              <CreateCollectionButton />
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <CollectionTable collections={collections} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
