"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, Plus, Loader2, ArrowLeft, Check } from "lucide-react";
import { addAsset, searchUnsplash } from "./action";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AssetProducer() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [selecting, setSelecting] = useState(null);

  const handleSimulatedUpload = async () => {
    setLoading(true);
    const result = await addAsset({
      name: "Placeholder " + new Date().toLocaleTimeString(),
      url: `https://picsum.photos/800/600?random=${Math.random()}`,
      type: "image",
      mime_type: "image/jpeg",
      size: "124 KB",
    });

    if (result.success) {
      toast.success("Asset added!");
      setOpen(false);
    } else {
      toast.error("Failed to add asset");
    }
    setLoading(false);
  };

  const handleUnsplashSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);

    const result = await searchUnsplash(query);
    if (result.success) {
      setSearchResults(result.results);
      if (result.results.length === 0) {
        toast.error("No images found for: " + query);
      }
    } else {
      toast.error(result.error || "Failed to search Unsplash");
    }
    setLoading(false);
  };

  const handleSelectUnsplashImage = async (img) => {
    setSelecting(img.id);
    const result = await addAsset({
      name: img.alt || `Unsplash: ${img.user}`,
      url: img.url,
      type: "image",
      mime_type: "image/jpeg",
      width: img.width,
      height: img.height,
      size: "External",
    });

    if (result.success) {
      toast.success("Asset saved to library!");
      setOpen(false);
      // Reset state for next time
      setSearchResults(null);
      setQuery("");
    } else {
      toast.error("Failed to save asset");
    }
    setSelecting(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setSearchResults(null);
          setQuery("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-2">
            {searchResults && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -ml-2"
                onClick={() => setSearchResults(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>
              {searchResults ? `Results for "${query}"` : "Add New Asset"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {searchResults
              ? "Pick an image to save it to your library."
              : "Generate an image from Unsplash or upload a file."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {!searchResults ? (
            <div className="flex flex-col gap-8">
              <form onSubmit={handleUnsplashSearch} className="space-y-3">
                <label className="text-sm font-medium text-stone-700">
                  Search Unsplash
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                    <Input
                      placeholder="e.g. coffee, office, nature..."
                      className="pl-10 h-10"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || !query}
                    className="h-10 px-6"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-stone-400 font-medium">
                    Or
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-stone-700">
                  Upload File
                </label>
                <Button
                  variant="outline"
                  className="w-full h-32 flex-col gap-3 border-dashed border-2 hover:bg-stone-50 border-stone-200"
                  onClick={handleSimulatedUpload}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                  ) : (
                    <>
                      <div className="p-3 bg-purple-50 rounded-full">
                        <Upload className="h-6 w-6 text-purple-600" />
                      </div>
                      <span className="text-stone-600">
                        Upload Image or File
                      </span>
                    </>
                  )}
                </Button>
                <p className="text-center text-[10px] text-stone-400">
                  Maximum file size: 10MB.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {searchResults.map((img) => (
                <button
                  key={img.id}
                  className="group relative aspect-square w-full overflow-hidden rounded-lg bg-stone-100 ring-offset-2 transition hover:ring-2 hover:ring-purple-500 disabled:opacity-50"
                  onClick={() => handleSelectUnsplashImage(img)}
                  disabled={!!selecting}
                >
                  <img
                    src={img.thumb}
                    alt={img.alt}
                    // fill
                    className="object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                    {selecting === img.id ? (
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    ) : (
                      <div className="rounded-full bg-white/90 p-2 opacity-0 shadow-sm transition group-hover:opacity-100">
                        <Plus className="h-4 w-4 text-purple-600" />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="truncate text-[10px] text-white/90">
                      by {img.user}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {searchResults && (
          <div className="p-4 border-t border-stone-100 bg-stone-50 text-[10px] text-stone-400 text-center">
            Images provided by Unsplash. Selecting an image adds it directly to
            your assets.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
