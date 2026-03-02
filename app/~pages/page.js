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
    <div className="min-h-dvh bg-stone-50 p-6">
      <div className="mx-auto max-w-6xl">
        <Card className="gap-0 overflow-hidden border-gray-200 bg-white shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <div>
              <CardTitle>Pages</CardTitle>
              <CardDescription>
                Manage visual pages and jump directly into the editor.
              </CardDescription>
            </div>
            <CardAction>
              <CreatePageButton />
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <PageTable pages={pages} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
