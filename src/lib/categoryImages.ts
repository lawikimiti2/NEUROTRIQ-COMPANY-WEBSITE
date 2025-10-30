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

function findFirstMatch(tokens: string[]): string | undefined {
  const entries = Object.entries(allImages);
  // Prefer deterministic ordering by path
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  const lowerTokens = tokens.map((t) => t.toLowerCase());
  const found = entries.find(([path]) => {
    const p = path.toLowerCase();
    return lowerTokens.some((tok) => p.includes(tok));
  });
  return found?.[1];
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
