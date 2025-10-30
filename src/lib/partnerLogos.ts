// Utility to gather partner logos from src/assets/patners/ and expose them as an array
// We intentionally keep the folder name 'patners' to match the repository structure.

export type PartnerLogo = {
  src: string;
  name: string; // derived from filename
  alt: string;  // human readable alt text
};

const logoModules = (import.meta as any).glob(
  "/src/assets/patners/**/*.{png,jpg,jpeg,webp,svg}",
  { eager: true, import: "default" }
) as Record<string, string>;

function toTitleCase(s: string): string {
  return s
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getPartnerLogos(): PartnerLogo[] {
  const entries = Object.entries(logoModules);
  // deterministic order by path
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return entries.map(([path, url]) => {
    const file = path.split(/[/\\]/).pop() || "logo";
    const base = file.replace(/\.[^.]+$/, "");
    const name = toTitleCase(base);
    return { src: url, name, alt: `${name} logo` };
  });
}
