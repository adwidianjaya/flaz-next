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
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Path
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Views
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Updated
            </th>
            <th
              className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
              style={{ width: 160 }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {!pages.length && (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-10 text-center text-sm text-gray-500"
              >
                No pages yet. Create one to start building.
              </td>
            </tr>
          )}
          {pages.map((page) => (
            <tr
              key={page.id}
              className="border-b border-gray-200 transition-colors hover:bg-stone-50"
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {page.name || "Untitled page"}
              </td>
              <td className="px-6 py-4 text-sm">
                <Link
                  href={page.path}
                  className="text-gray-600 underline decoration-dashed underline-offset-4 transition hover:text-gray-900"
                >
                  {page.path}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {page.view_count || 0}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {dayjs(page.updated_at).fromNow()}
              </td>
              <td
                className="px-6 py-4 text-sm"
                style={{ width: 160 }}
              >
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/~pages/edit${page.path}`}>Edit</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(page.id, page.name || page.path)}
                    disabled={deleting === page.id}
                  >
                    {deleting === page.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
