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
import { TopBarNav } from "@/app/_components/top-bar-nav";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Collections",
};

export default async function Page() {
  const collections = await db.select().from(collectionTable);

  return (
    <div className="min-h-dvh bg-linear-to-b from-emerald-50 via-emerald-100/80 to-stone-50">
      <TopBarNav />
      <div className="mx-auto max-w-6xl px-6 py-6">
        <Card className="gap-0 overflow-hidden border border-emerald-200/60 bg-white shadow-lg">
          <div className="h-1 w-full bg-linear-to-r from-emerald-500 via-emerald-400 to-teal-300" />
          <CardHeader className="gap-4 border-b border-emerald-100 bg-emerald-50/80 px-6 py-5 text-emerald-900">
            <div>
              <CardTitle className="text-2xl text-emerald-900">
                Collections
              </CardTitle>
              <CardDescription className="text-sm text-emerald-700">
                Manage collection schemas and jump directly into the editor.
              </CardDescription>
            </div>
            <CardAction>
              <CreateCollectionButton />
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <div className="rounded-b-2xl border-t border-emerald-100 bg-white/60 px-6 py-6">
              <CollectionTable collections={collections} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
