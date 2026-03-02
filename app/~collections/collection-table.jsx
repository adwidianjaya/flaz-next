"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus } from "lucide-react";
import { deleteCollection, createCollection } from "./action";
import { useState } from "react";
dayjs.extend(relativeTime);

const toTableName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export function CreateCollectionButton() {
  const router = useRouter();
  const [collectionName, setCollectionName] = useState("");
  const [tableName, setTableName] = useState("");
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateCollection = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!collectionName.trim()) {
      alert("Collection name is required");
      return;
    }
    if (!tableName.trim()) {
      alert("Table name is required");
      return;
    }

    setCreating(true);
    try {
      const result = await createCollection({ name: collectionName });
      if (result.success) {
        setCollectionName("");
        setTableName("");
        setDialogOpen(false);
        router.push(`/~collections/edit/${result.collection.id}`);
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
    <Dialog
      open={dialogOpen}
      onOpenChange={(isOpen) => {
        setCollectionName("");
        setTableName("");
        setDialogOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Enter a name for your new collection.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleCreateCollection}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Collection Name</label>
            <Input
              type="text"
              value={collectionName}
              onChange={(e) => {
                setCollectionName(e.target.value);
                setTableName(toTableName(e.target.value));
              }}
              placeholder="Enter collection name"
              disabled={creating}
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Table Name</label>
            <Input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Enter table name"
              disabled={creating || !collectionName.trim()}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating || !collectionName.trim() || !tableName.trim()}
            >
              {creating ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CollectionTable({ collections }) {
  const [deleting, setDeleting] = useState(null);

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

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="border-b border-emerald-200/80 bg-emerald-50/70">
            <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-900">
              Collection Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-900">
              Underlying Table Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-900">
              Updated
            </th>
            <th
              className="px-6 py-3 text-left text-sm font-semibold text-emerald-900"
              style={{ width: 160 }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {collections.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="px-6 py-10 text-center text-sm text-emerald-700"
              >
                No collections yet. Create one to get started.
              </td>
            </tr>
          ) : (
            collections.map((collection) => (
              <tr
                key={collection.id}
                className="border-b border-emerald-100/80 transition-colors hover:bg-emerald-50/60"
              >
                <td className="px-6 py-4 text-sm font-medium text-emerald-950">
                  {collection.name}
                </td>
                <td className="px-6 py-4 text-sm text-emerald-800/90">
                  {collection.table_name}
                </td>
                <td className="px-6 py-4 text-sm text-emerald-700">
                  {dayjs(collection.updated_at).fromNow()}
                </td>
                <td className="px-6 py-4 text-sm" style={{ width: 160 }}>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/~collections/edit/${collection.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleDelete(collection.id, collection.name)
                      }
                      disabled={deleting === collection.id}
                    >
                      {deleting === collection.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
