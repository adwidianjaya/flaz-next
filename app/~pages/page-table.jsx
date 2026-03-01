"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PageTable({ pages }) {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
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
            <th className="px-4 py-3 text-left font-semibold text-sm">
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
                {formatDate(page.updated_at)}
              </td>
              <td className="px-4 py-3 text-sm">
                <Button
                  asChild
                  // variant="outline"
                  size="sm"
                >
                  <Link href={`/~edit/${page.path}`}>Edit</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
