import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UIPrompter } from "./ui-prompter";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-dvh">
      <div className="w-full italic font-bold py-3 px-4">Flaz</div>
      <div className="flex flex-1 overflow-hidden">
        <UIPrompter />
      </div>
    </div>
  );
}
