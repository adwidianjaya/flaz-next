import { handlePromptRoute } from "@/lib/json-render/prompt";

export async function POST(request) {
  return handlePromptRoute(request);
}
