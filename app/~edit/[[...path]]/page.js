import { loadPage, normalizePath } from "@/lib/page-store";
import EditorClient from "./page-client";

const toRoutePath = (segments) => {
  if (!Array.isArray(segments) || segments.length === 0) {
    return "/";
  }

  return normalizePath(
    `/${segments.map((part) => decodeURIComponent(part)).join("/")}`,
  );
};

export const dynamic = "force-dynamic";

export default async function EditRoute({ params }) {
  const awaitedParams = await params;
  const routePath = toRoutePath(awaitedParams?.path);
  const page = await loadPage(routePath);

  return <EditorClient routePath={routePath} initialPage={page} />;
}
