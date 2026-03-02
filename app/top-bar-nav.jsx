"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/~dashboard", label: "Dashboard" },
  { href: "/~pages", label: "Pages" },
  { href: "/~collections", label: "Collections" },
  { href: "/~assets", label: "Assets" },
];

const isActive = (pathname, href) => {
  if (href === "/~dashboard") {
    return pathname === "/~dashboard";
  }
  return pathname.startsWith(href);
};

export const TopBarNav = () => {
  const pathname = usePathname() || "";

  return (
    <div className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-3">
        <Link href="/~dashboard">
          <div>
            <Image
              src="/logo.png"
              alt="Flaz"
              height={32}
              width={32}
              className="h-8 w-auto inline-block"
            />
            <div className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              Flaz
            </div>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-medium transition",
                  active
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
