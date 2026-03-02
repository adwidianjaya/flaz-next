import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

import { LogViewer } from "./log-viewer";
import { SideNavigator } from "./side-navigator";
import { PromptInput } from "./prompt-input";
import { PageNameInput } from "./page-name-input";
import { loadCurrentPage } from "../../loader";
import { Renderer, RendererProvider } from "@/lib/json-render/ui/renderer";

export const dynamic = "force-dynamic";

const resolveCurrentPage = async (params) => {
  const { paths = [] } = await params;
  const path = ["", ...(paths || [])].join("/");
  // console.log({ paths, path });
  const currentPage = await loadCurrentPage(path);
  // console.log({ currentPage });
  return { currentPage, path };
};

// export const metadata = {
//   title: "Edit Page",
// };
export async function generateMetadata({ params, searchParams }, parent) {
  const { currentPage } = await resolveCurrentPage(params);
  // console.log({ currentPage, parent });

  return {
    title: currentPage?.name || "Edit Page",
    description: currentPage?.description || "No Description",
  };
}

export default async function Page({ params }) {
  const { currentPage, path } = await resolveCurrentPage(params);

  return (
    <RendererProvider initialDefinition={currentPage?.definition}>
      <div className="flex min-h-dvh flex-col bg-stone-50">
        <header className="border-b border-gray-200 bg-white px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/~pages"
                className="inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-900"
              >
                <ChevronLeft className="size-4" />
                Back to pages
              </Link>
              <PageNameInput initialName={currentPage?.name} path={path} />
            </div>
            <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
              Dynamic Page Builder
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="flex w-[320px] shrink-0 flex-col border-r border-gray-200 bg-white">
            <SideNavigator />
            <PromptInput />
          </aside>

          <main className="flex min-w-0 flex-1 flex-col bg-stone-50">
            <div className="border-b border-gray-200 bg-white px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    Page Preview
                  </div>
                  <div className="text-sm text-gray-500">
                    Edit the page structure from the sidebar while reviewing the
                    live output here.
                  </div>
                </div>
                <div className="text-xs text-gray-500">Live editor</div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-5">
              <div
                className={cn(
                  "min-h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
                )}
              >
                <div className="min-h-full px-4 py-4 text-xs">
                  <Renderer />
                </div>
              </div>
            </div>

            <LogViewer />
          </main>
        </div>
      </div>
    </RendererProvider>
  );
}
