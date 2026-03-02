import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { loadCurrentCollection } from "../../loader";
import { CollectionEditor } from "./collection-editor";
import { CollectionNameInput } from "./collection-name-input";

export const dynamic = "force-dynamic";

const resolveCurrentCollection = async (params) => {
  const { collectionId } = await params;
  const currentCollection = await loadCurrentCollection(collectionId);
  return { collectionId, currentCollection };
};

export async function generateMetadata({ params }) {
  const { currentCollection } = await resolveCurrentCollection(params);

  return {
    title: currentCollection?.name
      ? `${currentCollection.name} Collection`
      : "Edit Collection",
  };
}

export default async function Page({ params }) {
  const { currentCollection } = await resolveCurrentCollection(params);

  if (!currentCollection?.id) {
    notFound();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-stone-50">
      <header className="border-b border-gray-200 bg-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/~collections"
              className="inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-900"
            >
              <ChevronLeft className="size-4" />
              Back to collections
            </Link>
            <CollectionNameInput
              collectionId={currentCollection.id}
              initialName={currentCollection.name}
              tableName={currentCollection.table_name}
            />
          </div>
          <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
            Dynamic Collection Builder
          </div>
        </div>
      </header>

      <CollectionEditor collection={currentCollection} />
    </div>
  );
}
