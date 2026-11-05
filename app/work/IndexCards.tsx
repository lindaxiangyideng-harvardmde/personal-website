import type { CSSProperties } from "react";
import ViewportVideo from "../ViewportVideo";
import { projects, type ProjectSlug } from "./data";
import { projectPosition } from "./catalog";

type Motion = "alan" | "biochar" | "proxy" | "museum" | "mycelium";

type Card = {
  image: string;
  video?: string;
  videoLabel?: string;
  videoCaption?: string;
  tags: string;
  question: string;
  motion?: Motion;
};

/** Index-cover presentation for every project, independent of where it is listed. */
const cards: Record<ProjectSlug, Card> = {
  "maas-profit-analyzer": { image: "/portfolio/maas/dashboard-top.png", tags: "Data Product / Financial Analytics", question: "Workbooks → audit → decision" },
  "alan": { image: "/portfolio/alan/alan-carolina-sphinx-card.webp", video: "/portfolio/alan/alan-carolina-sphinx-card.mp4", videoLabel: "ALAN: Carolina sphinx contribution transforming into interpretive space", videoCaption: "Contribution → Interpretive · Carolina sphinx", tags: "Environmental Data / Computation / Ecology", question: "Spectrum → receptor contribution → perceptual space", motion: "alan" },
  "second-world": { image: "/portfolio/second-world/p5_animation/previews/second-world-animation-60s.png", tags: "Data Visualization / Computation", question: "Intention → digital behavior → body response" },
  "biochar-metabolism": { image: "/portfolio/biochar/community-system.jpg", tags: "Architecture / Material / Ecology", question: "Waste → carbon → building repair", motion: "biochar" },
  "proxy-landscape": { image: "/portfolio/proxy/hero-map-spontaneous-clear.webp", tags: "Architecture / Computation / Ecology", question: "Water → evidence → coastal repair", motion: "proxy" },
  "museum-reorganization": { image: "/portfolio/museum/film-poster.webp", tags: "Architecture / Computation", question: "Plan → routes → spatial choice", motion: "museum" },
  "mycelium-living-facade": { image: "/portfolio/mycelium/hero-facade.webp", tags: "Architecture / Material / Ecology", question: "Growth → maturity → decay", motion: "mycelium" },
  "conflict-light-dark": { image: "/portfolio/conflict/day.webp", tags: "Architecture / Material", question: "Light → contrast → cultural expression" },
  "lens-on-the-move": { image: "/portfolio/lens/forest-hero.webp", tags: "Architecture / Material", question: "Mobility → adaptation → dwelling" },
  "future-truck-stop": { image: "/portfolio/truck-stop/hero.webp", tags: "Architecture / Ecology", question: "Energy → infrastructure → human activity" },
  "hope-in-gap": { image: "/portfolio/hope/hero.webp", tags: "Architecture", question: "Urban gaps → modular housing → community" },
};

function MotionPreview({ type }: { type: Motion }) {
  if (type === "alan") return <div className="motion alan-motion" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ "--n": i } as CSSProperties} />)}<span>PHYSICAL</span><span>CONTRIBUTION</span><span>INTERPRETIVE</span></div>;
  if (type === "biochar") return <div className="motion biochar-motion" aria-hidden="true"><span className="biochar-cycle" /><i className="biochar-trunk" /><i className="biochar-branch branch-one" /><i className="biochar-branch branch-two" /><i className="biochar-branch branch-three" /><i className="biochar-branch branch-four" /></div>;
  if (type === "proxy") return <div className="motion proxy-motion" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ "--n": i } as CSSProperties} />)}</div>;
  if (type === "museum") return <div className="motion museum-motion" aria-hidden="true"><i /><i /><i /><i /><b>01</b><b>02</b><b>03</b><b>04</b></div>;
  return <div className="motion mycelium-motion" aria-hidden="true"><i /><i /><i /><span>GROWTH</span><span>MATURE</span><span>DECAY</span></div>;
}

/** Large alternating cover used for the lead projects of a category. */
export function FeaturedCard({ slug }: { slug: ProjectSlug }) {
  const card = cards[slug];
  const { title, year } = projects[slug];
  const { number } = projectPosition(slug);
  const caption = card.videoCaption ?? (card.motion ? "Hover / focus to trace the system" : `${year} / PROJECT VIEW`);
  return <a href={`/work/${slug}`} className={`index-project ${card.motion ? `preview-${card.motion}` : ""} card-${slug}`}>
    <figure>
      {card.video
        ? <ViewportVideo src={card.video} poster={card.image} label={card.videoLabel ?? title} />
        : <img src={card.image} alt={`${title} portfolio preview`} />}
      {!card.video && card.motion ? <MotionPreview type={card.motion} /> : null}
      <figcaption>{caption}</figcaption>
    </figure>
    <div className="index-project-copy">
      <span>{number}</span>
      <p>{card.tags}</p>
      <h2>{title}</h2>
      <h3>{card.question}</h3>
      <small>View project ↗</small>
    </div>
  </a>;
}

/** Compact grid cover used for further studies. */
export function GridCard({ slug }: { slug: ProjectSlug }) {
  const card = cards[slug];
  const { title, year } = projects[slug];
  const { number } = projectPosition(slug);
  return <a href={`/work/${slug}`} className={`additional-project card-${slug}`}>
    <figure><img src={card.image} alt={`${title} selected project cover`} /><figcaption>{year} / PROJECT VIEW</figcaption></figure>
    <div className="additional-project-copy">
      <span>{number}</span><p>{card.tags}</p>
      <h2>{title}</h2><h3>{card.question}</h3><small>View project ↗</small>
    </div>
  </a>;
}
