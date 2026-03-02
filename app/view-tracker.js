import { db } from "@/lib/db/drizzle";
import { viewTable } from "@/lib/db/schema";
import { headers } from "next/headers";

export async function recordView(pageId, path) {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent");
  const ipAddress =
    headerList.get("x-forwarded-for") ||
    headerList.get("x-real-ip") ||
    "unknown";

  try {
    await db.insert(viewTable).values({
      page_id: pageId,
      path: path,
      user_agent: userAgent,
      ip_address: ipAddress,
    });
  } catch (error) {
    console.error("Failed to record view:", error);
  }
}
