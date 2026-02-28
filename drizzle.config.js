import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// console.log("...process.env.DATABASE_URL", process.env.DATABASE_URL);

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
