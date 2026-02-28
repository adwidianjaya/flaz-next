import Link from "next/link";
import { listPages, normalizePath } from "@/lib/page-store";
import Script from "next/script";

const toEditHref = (pagePath) => {
  const normalized = normalizePath(pagePath || "/");
  if (normalized === "/") return "/~edit/";

  const encodedPath = normalized
    .replace(/^\/+/, "")
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `/~edit/${encodedPath}`;
};

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Pages",
};

export default async function PagesRoute() {
  const pages = await listPages();

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" />

      <main className="mx-auto max-w-4xl px-4 py-6 w-full">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Pages</h1>
          <Link
            className="rounded border px-3 py-1 text-sm hover:bg-gray-700"
            href="/~edit/"
          >
            Open Root Editor
          </Link>
        </div>

        {!pages.length ? (
          <div className="rounded border bg-gray-50 px-4 py-3 text-sm">
            No pages found in storage.
          </div>
        ) : (
          <div className="overflow-x-auto rounded border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Path</th>
                  <th className="px-3 py-2">Updated</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr className="border-t" key={page.path || "root"}>
                    <td className="px-3 py-2">{page.name || "-"}</td>
                    <td className="px-3 py-2">
                      <code>{page.path || "/"}</code>
                    </td>
                    <td className="px-3 py-2">
                      {page.updated_at
                        ? new Date(page.updated_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Link
                        className="inline-flex rounded bg-black px-2 py-1 text-xs text-white hover:bg-gray-700"
                        href={toEditHref(page.path)}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
