"use client";

import { useState } from "react";
import Image from "next/image";
import { deleteAsset } from "./action";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, FileIcon } from "lucide-react";
import { toast } from "sonner";

export default function AssetGrid({ assets }) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (assetId, assetName) => {
    if (confirm(`Are you sure you want to delete "${assetName}"?`)) {
      setDeleting(assetId);
      const result = await deleteAsset({ assetId });
      if (result.success) {
        toast.success("Asset deleted");
      } else {
        toast.error("Failed to delete asset");
      }
      setDeleting(null);
    }
  };

  if (!assets?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400">
        <FileIcon className="mb-4 h-12 w-12 opacity-20" />
        <p>No assets found. Upload or generate some!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="group relative flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition hover:shadow-md"
        >
          <div className="relative aspect-square w-full bg-stone-100">
            {asset.type === "image" ? (
              <img
                src={asset.url}
                alt={asset.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <FileIcon className="h-12 w-12 text-stone-300" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition group-hover:opacity-100">
              <Button
                size="icon"
                variant="secondary"
                asChild
                className="h-8 w-8"
              >
                <a href={asset.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8"
                onClick={() => handleDelete(asset.id, asset.name)}
                disabled={deleting === asset.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-3">
            <p
              className="truncate text-xs font-medium text-stone-700"
              title={asset.name}
            >
              {asset.name}
            </p>
            <p className="mt-1 text-[10px] text-stone-400 uppercase tracking-wider">
              {asset.mime_type || asset.type}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
