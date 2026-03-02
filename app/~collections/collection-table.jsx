"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { deleteCollection, createCollection } from "./action";
import { useState } from "react";
dayjs.extend(relativeTime);

export default function CollectionTable({ collections }) {
  const [deleting, setDeleting] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async (collectionId, collectionName) => {
    if (
      confirm(
        `Are you sure you want to delete "${collectionName}"? This action cannot be undone.`,
      )
    ) {
      setDeleting(collectionId);
      try {
        const result = await deleteCollection({ collectionId });
        if (!result.success) {
          alert(`Failed to delete collection: ${result.error}`);
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete collection");
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      alert("Collection name is required");
      return;
    }

    setCreating(true);
    try {
      const result = await createCollection({ name: newCollectionName });
      if (result.success) {
        setNewCollectionName("");
        setDialogOpen(false);
      } else {
        alert(`Failed to create collection: ${result.error}`);
      }
    } catch (error) {
      console.error("Create error:", error);
      alert("Failed to create collection");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>+ New Collection</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Enter a name for your new collection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Collection Name</label>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !creating) {
                    handleCreateCollection();
                  }
                }}
                placeholder="Enter collection name"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                disabled={creating}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCollection}
                disabled={creating || !newCollectionName.trim()}
              >
                {creating ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left font-semibold text-sm">
                Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-sm">
                Updated
              </th>
              <th
                className="px-4 py-3 text-left font-semibold text-sm"
                style={{ width: 160 }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {collections.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                  No collections yet. Create one to get started.
                </td>
              </tr>
            ) : (
              collections.map((collection) => (
                <tr
                  key={collection.id}
                  className="border-b hover:bg-accent/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm">{collection.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {dayjs(collection.updated_at).fromNow()}
                  </td>
                  <td
                    className="px-4 py-3 text-sm space-x-2 flex"
                    style={{ width: 160 }}
                  >
                    <Button asChild size="sm">
                      <Link href={`/~collections/edit/${collection.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(collection.id, collection.name)}
                      disabled={deleting === collection.id}
                    >
                      {deleting === collection.id ? "Deleting..." : "Delete"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
