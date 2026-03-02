import { getConfigs } from "./action";
import { TopBarNav } from "@/app/top-bar-nav";
import ConfigForm from "./config-form";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Configuration",
};

export default async function ConfigPage() {
  const initialConfigs = await getConfigs();

  return (
    <div className="min-h-dvh bg-stone-50">
      <TopBarNav />
      <div className="mx-auto max-w-6xl px-8">
        <ConfigForm initialConfigs={initialConfigs} />
      </div>
    </div>
  );
}
