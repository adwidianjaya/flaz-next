const FALLBACK_PAGE_NAME = "Untitled page";
const FALLBACK_PAGE_PATH = "/untitled-page";

const slugifyPagePathSegment = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const buildPagePathFromName = (name) => {
  const slug = slugifyPagePathSegment(name || "");
  return slug ? `/${slug}` : FALLBACK_PAGE_PATH;
};

export const normalizePagePath = (value) => {
  const segments = (value || "")
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .map(slugifyPagePathSegment)
    .filter(Boolean);

  return segments.length ? `/${segments.join("/")}` : FALLBACK_PAGE_PATH;
};

export const normalizePageName = (value) => {
  const trimmedValue = value?.trim();
  return trimmedValue || FALLBACK_PAGE_NAME;
};
