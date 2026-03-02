import { cn } from "@/lib/utils";
import { loadCurrentCollection } from "../../loader";
import { CollectionNameInput } from "./collection-name-input";
import { CollectionSchemaEditor } from "./collection-schema-editor";

export const dynamic = "force-dynamic";

const resolveCurrentCollection = async (params) => {
  const { collection: collectionId } = await params;
  const currentCollection = await loadCurrentCollection(collectionId);
  return { currentCollection, collectionId };
};

export async function generateMetadata({ params }) {
  const { currentCollection } = await resolveCurrentCollection(params);

  return {
    title: currentCollection?.name || "Edit Collection",
  };
}

export default async function Page({ params }) {
  const { currentCollection, collectionId } = await resolveCurrentCollection(params);

  return (
    <div className="flex flex-col w-full h-dvh">
      <div className="w-full py-3 px-4 bg-gray-200 flex items-center justify-between gap-4">
        <div className="italic font-semibold flex items-center">
          <img
            src="/logo.svg"
            alt="Flaz Logo"
            className="h-8 w-auto inline-block rounded-lg overflow-hidden"
          />
          &nbsp; Flaz - Collections
        </div>
        <CollectionNameInput
          initialName={currentCollection?.name}
          collectionId={collectionId}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={cn("w-full flex flex-col", "border-t border-gray-200")}>
          <div className="sticky top-0 z-10 bg-gray-600 text-white px-4 py-2">
            <h2 className="text-sm font-semibold">Collection Schema</h2>
          </div>
          <CollectionSchemaEditor
            collectionId={collectionId}
            initialSchema={currentCollection?.schema || {}}
          />
        </div>
      </div>
    </div>
  );
}
