import type { ProjectSlug } from "./data";

/**
 * The single source of truth for how projects are grouped and ordered.
 * Project numbers, index order, and "next project" links are all derived
 * from these lists, so reordering a project only means moving it here.
 */
export const categories = {
  product: {
    label: "Product Design",
    href: "/product-design",
    slugs: ["maas-profit-analyzer", "alan", "second-world"],
  },
  architecture: {
    label: "Architecture & Spatial Work",
    href: "/architecture",
    slugs: [
      "biochar-metabolism",
      "proxy-landscape",
      "museum-reorganization",
      "mycelium-living-facade",
      "conflict-light-dark",
      "lens-on-the-move",
      "future-truck-stop",
      "hope-in-gap",
    ],
  },
} as const satisfies Record<string, { label: string; href: string; slugs: readonly ProjectSlug[] }>;

export type CategoryKey = keyof typeof categories;
