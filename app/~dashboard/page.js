import Link from "next/link";
import { ArrowUpRight, FileText, LibraryBig } from "lucide-react";
import { db } from "@/lib/db/drizzle";
import { collectionTable, pageTable } from "@/lib/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Dashboard",
};

const dashboardItems = [
  {
    href: "/~pages",
    title: "Pages",
    description: "Build visual routes and open the live page editor.",
    eyebrow: "Visual editor",
    icon: FileText,
    accent: "from-amber-100 via-orange-50 to-white",
  },
  {
    href: "/~collections",
    title: "Collections",
    description: "Manage content schemas that power structured editor data.",
    eyebrow: "Content model",
    icon: LibraryBig,
    accent: "from-emerald-100 via-teal-50 to-white",
  },
];

export default async function DashboardPage() {
  const [pages, collections] = await Promise.all([
    db.select().from(pageTable),
    db.select().from(collectionTable),
  ]);

  const counts = {
    "/~pages": pages.length,
    "/~collections": collections.length,
  };

  return (
    <div className="min-h-dvh bg-stone-50 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Card className="overflow-hidden border-stone-200 bg-white shadow-sm">
          <CardHeader className="gap-3 border-b border-stone-200 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-800 text-stone-50">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-300 pt-4">
              Flaz workspace
            </div>
            <div className="max-w-2xl space-y-2">
              <CardTitle className="text-3xl leading-tight font-semibold">
                Start in pages or data first in collections.
              </CardTitle>
              <CardDescription className="text-sm text-stone-300">
                This dashboard is structured as the editor landing page, with
                room for onboarding guidance as the workspace grows.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 p-4 md:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="grid gap-4 md:grid-cols-2">
              {dashboardItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group block"
                  >
                    <Card
                      className={`h-full min-h-72 justify-between border-stone-200 bg-gradient-to-br ${item.accent} p-0 shadow-none transition duration-200 hover:-translate-y-1 hover:border-stone-300 hover:shadow-lg`}
                    >
                      <CardHeader className="gap-6 p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="rounded-2xl border border-stone-300/80 bg-white/80 p-3 text-stone-900 shadow-sm backdrop-blur">
                            <Icon className="size-7" />
                          </div>
                          <div className="flex items-center gap-2 rounded-full border border-stone-300/80 bg-white/80 px-3 py-1 text-xs font-medium text-stone-600 backdrop-blur">
                            Open
                            <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                            {item.eyebrow}
                          </div>
                          <div>
                            <CardTitle className="text-3xl text-stone-950">
                              {item.title}
                            </CardTitle>
                            <CardDescription className="mt-3 max-w-xs text-base leading-relaxed text-stone-600">
                              {item.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="rounded-2xl border border-stone-300/80 bg-white/75 p-4 backdrop-blur">
                          <div className="text-sm text-stone-500">
                            Active {item.title.toLowerCase()}
                          </div>
                          <div className="mt-2 text-5xl font-semibold tracking-tight text-stone-950">
                            {counts[item.href]}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            <Card className="border-stone-200 bg-stone-100/80 shadow-none">
              <CardHeader className="gap-3">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Editor onboarding
                </div>
                <div>
                  <CardTitle className="text-xl text-stone-950">
                    Prepared for first-run guidance
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-relaxed text-stone-600">
                    Use this area for guided setup, starter templates, or
                    editorial checklists without changing the dashboard
                    structure.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-stone-600">
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white/80 p-4">
                  1. Create a page route to open the visual editor.
                </div>
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white/80 p-4">
                  2. Define collections when the editor needs structured data.
                </div>
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white/80 p-4">
                  3. Replace these placeholders with onboarding actions later.
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
