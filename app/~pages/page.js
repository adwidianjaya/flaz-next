import { db } from "@/lib/db/drizzle";
import { pageTable } from "@/lib/db/schema";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageTable from "./page-table";
import { CreatePageButton } from "./create-page-button";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Pages",
};

export default async function Page() {
  const pages = await db.select().from(pageTable);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-amber-50 via-amber-100/80 to-stone-50 p-6">
      <div className="mx-auto max-w-6xl">
        <Card className="gap-0 overflow-hidden border border-amber-200/60 bg-white shadow-lg">
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-300" />
          <CardHeader className="gap-4 border-b border-amber-100 bg-amber-50/80 px-6 py-5 text-amber-900">
            <div>
              <CardTitle className="text-2xl text-amber-900">Pages</CardTitle>
              <CardDescription className="text-sm text-amber-700">
                Manage visual pages and jump directly into the editor.
              </CardDescription>
            </div>
            <CardAction>
              <CreatePageButton />
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <div className="rounded-b-2xl border-t border-amber-100 bg-white/60 px-6 py-6">
              <PageTable pages={pages} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
