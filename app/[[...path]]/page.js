import { loadCurrentPage } from "@/app/~pages/loader";
import { Renderer, RendererProvider } from "@/lib/json-render/ui/renderer";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RendererPage({ params }) {
  const { path: pathSegments = [] } = await params;
  const path = ["", ...(pathSegments || [])].join("/");
  const currentPage = await loadCurrentPage(path);

  if (!currentPage?.id) notFound();
  // console.log({ currentPage });

  return (
    <RendererProvider initialDefinition={currentPage?.definition}>
      <Renderer />
    </RendererProvider>
  );
}
