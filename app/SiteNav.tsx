import { categories, type CategoryKey } from "./work/categories";

type NavKey = CategoryKey | "about";

const navLinks: readonly { key: NavKey; label: string; href: string }[] = [
  { key: "product", label: categories.product.label, href: categories.product.href },
  { key: "architecture", label: "Architecture", href: categories.architecture.href },
  { key: "about", label: "About", href: "/about" },
];

/** Primary navigation shared by the home page, index pages, and project pages. */
export function SiteNav({ current }: { current?: NavKey }) {
  return <nav aria-label="Primary navigation">
    {navLinks.map(link => <a href={link.href} aria-current={current === link.key ? "page" : undefined} key={link.key}>{link.label}</a>)}
  </nav>;
}
