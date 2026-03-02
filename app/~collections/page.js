import { db } from "@/lib/db/drizzle";
import { collectionTable } from "@/lib/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CollectionTable from "./collection-table";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Collections",
};

export default async function Page() {
  const collections = await db.select().from(collectionTable);

  return (
    <div className="p-6 bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 h-dvh">
      <Card>
        <CardHeader>
          <CardTitle>Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <CollectionTable collections={collections} />
        </CardContent>
      </Card>
    </div>
  );
}
