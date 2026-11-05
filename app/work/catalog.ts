import { projects, type ProjectSlug } from "./data";
import { categories, type CategoryKey } from "./categories";

export { categories, type CategoryKey };

export type ProjectPosition = {
  category: CategoryKey;
  categoryLabel: string;
  categoryHref: string;
  /** Two-digit position inside its category, e.g. "01". */
  number: string;
  year: string;
  next: { slug: ProjectSlug; title: string; number: string; wrapsToStart: boolean };
};

export function projectPosition(slug: ProjectSlug): ProjectPosition {
  for (const key of Object.keys(categories) as CategoryKey[]) {
    const category = categories[key];
    const slugs: readonly ProjectSlug[] = category.slugs;
    const index = slugs.indexOf(slug);
    if (index === -1) continue;
    const nextIndex = (index + 1) % slugs.length;
    const nextSlug = slugs[nextIndex];
    return {
      category: key,
      categoryLabel: category.label,
      categoryHref: category.href,
      number: twoDigits(index + 1),
      year: projects[slug].year,
      next: { slug: nextSlug, title: projects[nextSlug].title, number: twoDigits(nextIndex + 1), wrapsToStart: nextIndex === 0 },
    };
  }
  throw new Error(`Project "${slug}" is not listed in any category in app/work/catalog.ts`);
}

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}
