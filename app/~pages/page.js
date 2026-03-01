import Script from "next/script";
import { db } from "@/lib/db/drizzle";
import { pageTable } from "@/lib/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageTable from "./page-table";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Pages",
};

export default async function Page() {
  const pages = await db.select().from(pageTable);

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <PageTable pages={pages} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
