"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { createPage } from "./action";
import { buildPagePathFromName, normalizePagePath } from "./path-utils";

const initialState = {
  name: "",
  path: "",
};

export function CreatePageButton() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formState, setFormState] = useState(initialState);
  const [pathTouched, setPathTouched] = useState(false);
  const [creating, setCreating] = useState(false);

  const resetForm = () => {
    setFormState(initialState);
    setPathTouched(false);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      resetForm();
    }
    setDialogOpen(isOpen);
  };

  const handleCreatePage = async (event) => {
    event.preventDefault();

    const nextName = formState.name.trim();
    const nextPath = normalizePagePath(formState.path);

    if (!nextName) {
      alert("Page name is required");
      return;
    }

    if (!nextPath) {
      alert("Page path is required");
      return;
    }

    setCreating(true);
    try {
      const result = await createPage({
        name: nextName,
        path: nextPath,
      });

      if (!result?.success) {
        alert(`Failed to create page: ${result?.error || "Unknown error"}`);
        return;
      }

      resetForm();
      setDialogOpen(false);
      router.push(`/~pages/edit${result.page.path}`);
    } catch (error) {
      console.error("Create page error:", error);
      alert("Failed to create page");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Page
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
          <DialogDescription>
            Enter a page name and route path before opening the editor.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleCreatePage}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Page Name</label>
            <Input
              type="text"
              value={formState.name}
              onChange={(event) => {
                const nextName = event.target.value;

                setFormState((currentState) => ({
                  name: nextName,
                  path: pathTouched
                    ? currentState.path
                    : buildPagePathFromName(nextName),
                }));
              }}
              placeholder="Enter page name"
              disabled={creating}
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Path</label>
            <Input
              type="text"
              value={formState.path}
              onChange={(event) => {
                setPathTouched(true);
                setFormState((currentState) => ({
                  ...currentState,
                  path: event.target.value,
                }));
              }}
              onBlur={() =>
                setFormState((currentState) => ({
                  ...currentState,
                  path: normalizePagePath(currentState.path),
                }))
              }
              placeholder="/about"
              disabled={creating}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating || !formState.name.trim() || !formState.path.trim()}
            >
              {creating ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
