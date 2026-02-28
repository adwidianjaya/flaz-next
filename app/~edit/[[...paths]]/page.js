import Script from "next/script";
import { LogViewer } from "./log-viewer";
import { SideNavigator } from "./side-navigator";
import { cn } from "@/lib/utils";
import { PromptInput } from "./prompt-input";
import { loadCurrentPage } from "./loader";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Edit Page",
};

export default async function Page({ params }) {
  const { paths = [] } = await params;
  const path = ["", ...(paths || [])].join("/");
  // console.log({ paths, path });
  const currentPage = await loadCurrentPage(path);
  // console.log({ currentPage });

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" />

      <div className="flex flex-col w-full h-dvh">
        <div className="w-full py-3 px-4 bg-gray-200 flex items-center justify-between gap-4">
          <div className="italic font-semibold flex items-center">
            <img
              src="/logo.svg"
              alt="Flaz Logo"
              className="h-8 w-auto inline-block rounded-lg overflow-hidden"
            />
            &nbsp; Flaz
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div
            className={cn(
              "w-1/4 flex flex-col",
              "border-b border-t border-gray-200",
            )}
          >
            <SideNavigator initialDefinition={currentPage?.definition} />

            <PromptInput />
          </div>

          <div
            className={cn(
              "w-3/4 flex flex-col bg-gray-50",
              "border-b border-t border-l border-gray-200",
            )}
          >
            <div className="w-full h-full text-xs overflow-scroll">
              <div className="sticky top-0 z-10 bg-gray-600 text-white px-2 py-1 mb-1 text-xs">
                Preview
              </div>
              <div className="px-3 py-2">
                {/* <Renderer bind:states={schema.states} elements={schema.elements} /> */}
              </div>
            </div>

            <LogViewer />
          </div>
        </div>
      </div>
    </>
  );
}
