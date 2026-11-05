import type { ProjectSlug } from "./data";
import { projectPosition } from "./catalog";
import { SiteNav } from "../SiteNav";

/** Project page header; highlights the category the project belongs to. */
export function ProjectHeader({ slug, className }: { slug: ProjectSlug; className: string }) {
  return <header className={className}>
    <a className="mark" href="/">LINDA DENG</a>
    <SiteNav current={projectPosition(slug).category} />
  </header>;
}

/** The "01 / 2026" kicker, numbered by the project's position in its category. */
export function ProjectNumber({ slug }: { slug: ProjectSlug }) {
  const position = projectPosition(slug);
  return <span>{`${position.number} / ${position.year}`}</span>;
}

/** Back-to-category and next-project links at the end of a project page. */
export function ProjectNext({ slug, className }: { slug: ProjectSlug; className: string }) {
  const { categoryLabel, categoryHref, next } = projectPosition(slug);
  return <section className={className}>
    <a href={categoryHref}>Back to {categoryLabel} ↗</a>
    <a href={`/work/${next.slug}`}>{next.wrapsToStart ? `Return to project ${next.number}` : "Next project"} — {next.title} →</a>
  </section>;
}
