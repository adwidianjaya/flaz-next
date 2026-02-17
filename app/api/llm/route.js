import { deployPromptRoute } from "@/lib/json-render";

export async function POST(request) {
  return deployPromptRoute(request);
}
