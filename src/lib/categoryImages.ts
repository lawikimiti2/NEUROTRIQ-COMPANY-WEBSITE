// Centralized helpers to reference images by service category folders.
// This avoids brittle hard-coded filenames and maps to the project's actual folders.

export type CategoryName =
  | "it"
  | "security"
  | "smart"
  | "electrical"
  | "tender"
  | "consultancy";

// Eagerly import all images so Vite resolves them and we can select by folder name.
const allImages = (import.meta as any).glob(
  "/src/assets/**/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
) as Record<string, string>;

// Map category to folder-identifying substrings (case-insensitive)
const categoryFolderTokens: Record<CategoryName, string[]> = {
  it: [
    "i t and networking", // actual folder name in repo
    "it-and-networking",
    "networking",
  ],
  security: ["security solutions", "security"],
  smart: ["smart infrastructure", "smart-infrastructure", "smart"],
  electrical: ["/electrical/", "\\electrical\\", "electrical"],
  tender: ["tenders", "tender"],
  consultancy: ["consultancy works", "consultancy"],
};

function findAllMatches(tokens: string[]): string[] {
  const entries = Object.entries(allImages);
  // Prefer deterministic ordering by path
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  const lowerTokens = tokens.map((t) => t.toLowerCase());
  return entries
    .filter(([path]) => {
      const p = path.toLowerCase();
      return lowerTokens.some((tok) => p.includes(tok));
    })
    .map(([, url]) => url);
}

function findFirstMatch(tokens: string[]): string | undefined {
  return findAllMatches(tokens)[0];
}

// All images available for a category's folder, for callers that want to
// show a different photo per item instead of repeating the same one.
export function getCategoryImages(category: CategoryName): string[] {
  const matches = findAllMatches(categoryFolderTokens[category]);
  return matches.length > 0 ? matches : Object.values(allImages);
}

export function pickCategoryImage(category: CategoryName): string {
  // Try the category's folder tokens
  const tokens = categoryFolderTokens[category];
  const hit = findFirstMatch(tokens);
  if (hit) return hit;

  // Fallbacks across all images: try a generic token
  const genericToken = category === "it" ? "it" : category;
  const generic = findFirstMatch([genericToken]);
  if (generic) return generic;

  // Last resort: pick any available image so the UI never breaks
  const any = Object.values(allImages)[0];
  return any || "";
}

export const categoryImages = {
  it: pickCategoryImage("it"),
  security: pickCategoryImage("security"),
  smart: pickCategoryImage("smart"),
  electrical: pickCategoryImage("electrical"),
  tender: pickCategoryImage("tender"),
  consultancy: pickCategoryImage("consultancy"),
};

// Helper: choose by human-readable title string
export function imageForTitle(title: string, fallback?: string): string {
  const t = title.toLowerCase();
  if (t.includes("security")) return categoryImages.security;
  if (t.includes("consult")) return categoryImages.consultancy;
  if (t.includes("tender")) return categoryImages.tender;
  if (t.includes("it")) return categoryImages.it;
  if (t.includes("elect")) return categoryImages.electrical;
  if (t.includes("smart")) return categoryImages.smart;
  return fallback || Object.values(allImages)[0] || "";
}
