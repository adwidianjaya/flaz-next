"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
// implement dayjs relative time
import relativeTime from "dayjs/plugin/relativeTime";
import { deletePage } from "./action";
import { useState } from "react";
dayjs.extend(relativeTime);

export default function PageTable({ pages }) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (pageId, pageName) => {
    // console.log({ pageName });
    if (
      confirm(
        `Are you sure you want to delete "${pageName}"? This action cannot be undone.`,
      )
    ) {
      setDeleting(pageId);
      try {
        const result = await deletePage({ pageId });
        if (!result.success) {
          alert(`Failed to delete page: ${result.error}`);
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete page");
      } finally {
        setDeleting(null);
      }
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-semibold text-sm">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-sm">Path</th>
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
          {pages.map((page) => (
            <tr
              key={page.id}
              className="border-b hover:bg-accent/50 transition-colors"
            >
              <td className="px-4 py-3 text-sm">{page.name}</td>
              <td className="px-4 py-3 text-sm">
                <Link
                  href={`/${page.path}`}
                  className="text-primary hover:underline"
                >
                  {page.path}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {dayjs(page.updated_at).fromNow()}
              </td>
              <td
                className="px-4 py-3 text-sm space-x-2 flex"
                style={{ width: 160 }}
              >
                <Button
                  asChild
                  // variant="outline"
                  size="sm"
                >
                  <Link href={`/~pages/edit/${page.path}`}>Edit</Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(page.id, page.name || page.path)}
                  disabled={deleting === page.id}
                >
                  {deleting === page.id ? "Deleting..." : "Delete"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
