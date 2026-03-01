"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/~pages/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col w-full h-dvh">
      <div className="w-full italic font-semibold py-3 px-4">Flaz</div>
      <div className="flex flex-1 overflow-hidden flex-col justify-center items-center">
        <div className="italic text-3xl text-gray-500 animate-pulse">
          Flaz is loading...
        </div>
      </div>
    </div>
  );
}
