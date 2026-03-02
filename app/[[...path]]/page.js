import { loadCurrentPage } from "@/app/~pages/loader";
import { Renderer, RendererProvider } from "@/lib/json-render/ui/renderer";
import { notFound } from "next/navigation";
import { recordView } from "../view-tracker";
import { getConfigs } from "@/app/~config/action";

export const dynamic = "force-dynamic";

const resolveCurrentPage = async (params) => {
  const { path: pathSegments = [] } = await params;
  const path = ["", ...(pathSegments || [])].join("/");
  const currentPage = await loadCurrentPage(path);

  return { currentPage, path };
};

export async function generateMetadata({ params }) {
  const { currentPage } = await resolveCurrentPage(params);
  const configs = await getConfigs();

  const siteName = configs.SITE_NAME || "Flaz Next";
  const defaultDesc = configs.SITE_DESCRIPTION || "";

  return {
    title: currentPage?.name ? `${currentPage.name} | ${siteName}` : siteName,
    description: currentPage?.description || defaultDesc,
    icons: {
      icon: configs.FAVICON_URL || "/favicon.ico",
    },
  };
}

export default async function RendererPage({ params }) {
  const { currentPage, path } = await resolveCurrentPage(params);

  if (!currentPage?.id) notFound();
  // console.log({ currentPage });

  // Record view (async but not awaited)
  recordView(currentPage.id, path).catch((err) =>
    console.error("View record failed:", err),
  );

  return (
    <RendererProvider initialDefinition={currentPage?.definition}>
      <Renderer />
    </RendererProvider>
  );
}
