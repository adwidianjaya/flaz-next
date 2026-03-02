import { loadCurrentPage } from "@/app/~pages/loader";
import { Renderer, RendererProvider } from "@/lib/json-render/ui/renderer";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const resolveCurrentPage = async (params) => {
  const { path: pathSegments = [] } = await params;
  const path = ["", ...(pathSegments || [])].join("/");
  const currentPage = await loadCurrentPage(path);

  return { currentPage, path };
};

export async function generateMetadata({ params }) {
  const { currentPage } = await resolveCurrentPage(params);

  return {
    title: currentPage?.name || "Flaz Next",
    description: currentPage?.description || "",
  };
}

export default async function RendererPage({ params }) {
  const { currentPage } = await resolveCurrentPage(params);

  if (!currentPage?.id) notFound();
  // console.log({ currentPage });

  return (
    <RendererProvider initialDefinition={currentPage?.definition}>
      <Renderer />
    </RendererProvider>
  );
}
