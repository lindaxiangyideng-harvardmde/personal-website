import Link from "next/link";

const work = [
  { number: "01", title: "Biochar Metabolism", slug: "biochar-metabolism", image: "/portfolio/biochar-architecture.jpg", tags: "Architecture / Material / Ecology", question: "Waste → carbon → building repair", motion: "biochar" },
  { number: "02", title: "The Proxy Landscape", slug: "proxy-landscape", image: "/portfolio/proxy-map.jpg", tags: "Architecture / Computation / Ecology", question: "Water → evidence → coastal repair", motion: "proxy" },
  { number: "03", title: "Museum Reorganization", slug: "museum-reorganization", image: "/portfolio/museum-process.jpg", tags: "Architecture / Computation", question: "Plan → routes → spatial choice", motion: "museum" },
  { number: "04", title: "Mycelium Living Facade", slug: "mycelium-living-facade", image: "/portfolio/mycelium-facade.jpg", tags: "Architecture / Material / Ecology", question: "Growth → maturity → decay", motion: "mycelium" },
] as const;

function MotionPreview({ type }: { type: (typeof work)[number]["motion"] }) {
  if (type === "biochar") return <div className="motion biochar-motion" aria-hidden="true"><i /><i /><i /><i /><i /></div>;
  if (type === "proxy") return <div className="motion proxy-motion" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ "--n": i } as React.CSSProperties} />)}</div>;
  if (type === "museum") return <div className="motion museum-motion" aria-hidden="true"><i /><i /><i /><i /><b>01</b><b>02</b><b>03</b><b>04</b></div>;
  return <div className="motion mycelium-motion" aria-hidden="true"><i /><i /><i /><span>GROWTH</span><span>MATURE</span><span>DECAY</span></div>;
}

export default function WorkIndex() {
  return <main className="work-index-page">
    <header className="index-header">
      <Link className="home-mark" href="/">LINDA DENG</Link>
      <p>Selected Work / 2022–2025</p>
      <nav><Link href="/">Home</Link><Link href="/about">About</Link></nav>
    </header>

    <section className="index-intro">
      <span>01 / INDEX</span>
      <h1>Selected<br /><i>research systems.</i></h1>
      <p>Each preview animates the project’s central method—not a decorative effect. Final images will replace these portfolio spreads after the visual direction is confirmed.</p>
    </section>

    <section className="project-index" aria-label="Selected projects">
      {work.map(project => <Link href={`/work/${project.slug}`} className={`index-project preview-${project.motion}`} key={project.slug}>
        <figure>
          <img src={project.image} alt={`${project.title} portfolio preview`} />
          <MotionPreview type={project.motion} />
          <figcaption>Hover / focus to trace the system</figcaption>
        </figure>
        <div className="index-project-copy">
          <span>{project.number}</span>
          <p>{project.tags}</p>
          <h2>{project.title}</h2>
          <h3>{project.question}</h3>
          <small>View project ↗</small>
        </div>
      </Link>)}
    </section>

    <footer><span>LINDA DENG</span><span>DESIGN / RESEARCH / TECHNOLOGY</span><span>NEW YORK · 2026</span></footer>
  </main>;
}
