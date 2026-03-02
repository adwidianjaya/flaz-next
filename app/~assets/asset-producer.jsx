"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, Plus, Loader2 } from "lucide-react";
import { addAsset } from "./action";
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

  const handleSimulatedUpload = async () => {
    setLoading(true);
    // In a real app, this would be a file upload to S3 or similar.
    // For this prototype, we'll use a placeholder image.
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

    // Simulate Unsplash search and selection of first result
    // In a real implementation, we'd fetch from Unsplash API
    const result = await addAsset({
      name: `Unsplash: ${query}`,
      url: `https://source.unsplash.com/featured/?${encodeURIComponent(query)}&${Math.random()}`,
      type: "image",
      mime_type: "image/jpeg",
      size: "2 MB",
    });

    if (result.success) {
      toast.success(`Produced asset for: ${query}`);
      setQuery("");
      setOpen(false);
    } else {
      toast.error("Failed to produce asset");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Generate an image from Unsplash or upload a file.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <form onSubmit={handleUnsplashSearch} className="space-y-2">
            <label className="text-sm font-medium">Search Unsplash</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
                <Input
                  placeholder="e.g. coffee, office, logo..."
                  className="pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading || !query}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Produce"
                )}
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-stone-500">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload File</label>
            <Button
              variant="outline"
              className="w-full gap-2 border-dashed py-8"
              onClick={handleSimulatedUpload}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Image or File
                </>
              )}
            </Button>
            <p className="text-center text-[10px] text-stone-400">
              Drag and drop supported in full version.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
