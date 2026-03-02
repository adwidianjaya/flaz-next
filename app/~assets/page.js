import { db } from "@/lib/db/drizzle";
import { assetTable } from "@/lib/db/schema";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TopBarNav } from "@/app/top-bar-nav";
import AssetGrid from "./asset-grid";
import AssetProducer from "./asset-producer";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Assets",
};

export default async function AssetsPage() {
  const assets = await db
    .select()
    .from(assetTable)
    .orderBy(desc(assetTable.created_at));

  return (
    <div className="min-h-dvh bg-linear-to-b from-purple-50 via-indigo-50/80 to-stone-50">
      <TopBarNav />
      <div className="mx-auto max-w-6xl px-6 py-6">
        <Card className="gap-0 overflow-hidden border border-purple-200/60 bg-white shadow-lg">
          <div className="h-1 w-full bg-linear-to-r from-purple-600 via-indigo-500 to-blue-400" />
          <CardHeader className="gap-4 border-b border-purple-100 bg-purple-50/80 px-6 py-5 text-purple-900">
            <div>
              <CardTitle className="text-2xl text-purple-900">Assets</CardTitle>
              <CardDescription className="text-sm text-purple-700">
                Manage and produce images, logos, and files for your pages.
              </CardDescription>
            </div>
            <CardAction>
              <AssetProducer />
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <div className="rounded-b-2xl border-t border-purple-100 bg-white/60 px-6 py-6">
              <AssetGrid assets={assets} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
