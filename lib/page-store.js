import { promises as fs } from "node:fs";
import path from "node:path";

const PAGES_DIR = path.join(process.cwd(), "src", "data", "pages");
const INDEX_FILE = path.join(PAGES_DIR, "pages.json");

const DEFAULT_DEFINITION = {
  root: "",
  states: {},
  elements: {},
};

const DEFAULT_PAGE = {
  name: "",
  path: "/",
  definition: DEFAULT_DEFINITION,
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const nowIso = () => new Date().toISOString();

const normalizePath = (routePath = "/") => {
  const raw = String(routePath || "/").trim();
  if (!raw || raw === "/") return "/";

  const segments = raw
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

  if (!segments.length) return "/";

  return `/${segments.join("/")}`;
};

const snapshotFileName = (routePath) => {
  const normalized = normalizePath(routePath);
  return (`root${normalized.split("/").join(".")}.json`).replace(/\.\.+/g, ".");
};

const ensureStorage = async () => {
  await fs.mkdir(PAGES_DIR, { recursive: true });

  try {
    await fs.access(INDEX_FILE);
  } catch {
    await fs.writeFile(INDEX_FILE, JSON.stringify([], null, 2), "utf8");
  }
};

const readPages = async () => {
  await ensureStorage();

  try {
    const raw = await fs.readFile(INDEX_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
};

const writePages = async (pages) => {
  await ensureStorage();
  await fs.writeFile(INDEX_FILE, JSON.stringify(pages, null, 2), "utf8");
};

const writeSnapshot = async (routePath, definition) => {
  const filePath = path.join(PAGES_DIR, snapshotFileName(routePath));
  await fs.writeFile(filePath, JSON.stringify(definition ?? {}, null, 2), "utf8");
};

const ensureHomePage = async () => {
  const pages = await readPages();
  if (pages.length > 0) {
    return pages;
  }

  const createdAt = nowIso();
  const home = {
    ...DEFAULT_PAGE,
    created_at: createdAt,
    updated_at: createdAt,
  };

  await writePages([home]);
  await writeSnapshot("/", home.definition);

  return [home];
};

export const listPages = async () => {
  const pages = await ensureHomePage();
  return pages
    .slice()
    .sort((a, b) => String(a.path || "").localeCompare(String(b.path || "")));
};

export const loadPage = async (routePath) => {
  const normalizedPath = normalizePath(routePath);
  const pages = await readPages();

  const page = pages.find((item) => normalizePath(item.path) === normalizedPath);
  if (!page) {
    return {
      path: normalizedPath,
      name: "",
      definition: clone(DEFAULT_DEFINITION),
    };
  }

  return {
    ...page,
    path: normalizePath(page.path),
    name: page.name || "",
    definition: clone(page.definition || DEFAULT_DEFINITION),
  };
};

export const savePage = async ({ routePath, definition, name }) => {
  const normalizedPath = normalizePath(routePath);
  const pages = await readPages();
  const currentTime = nowIso();

  const index = pages.findIndex((item) => normalizePath(item.path) === normalizedPath);

  if (index >= 0) {
    const existing = pages[index] || {};
    pages[index] = {
      ...existing,
      name: name === undefined ? existing.name || "" : String(name || ""),
      path: normalizedPath,
      definition: clone(definition || DEFAULT_DEFINITION),
      created_at: existing.created_at || currentTime,
      updated_at: currentTime,
    };
  } else {
    pages.push({
      name: String(name || ""),
      path: normalizedPath,
      definition: clone(definition || DEFAULT_DEFINITION),
      created_at: currentTime,
      updated_at: currentTime,
    });
  }

  await writePages(pages);
  await writeSnapshot(normalizedPath, definition || DEFAULT_DEFINITION);

  return loadPage(normalizedPath);
};

export { normalizePath, DEFAULT_DEFINITION };
