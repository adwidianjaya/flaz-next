import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UIPrompter } from "./ui-prompter";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-dvh">
      <div className="flex-none w-full italic font-bold py-3 px-4">Flaz</div>
      <div className="h-full">
        <UIPrompter />
      </div>
    </div>
  );
}
