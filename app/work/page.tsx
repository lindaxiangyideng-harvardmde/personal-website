const work = [
  { number: "01", title: "Biochar Metabolism", slug: "biochar-metabolism", image: "/portfolio/biochar-architecture.jpg", tags: "Architecture / Material / Ecology", question: "Waste → carbon → building repair", motion: "biochar" },
  { number: "02", title: "The Proxy Landscape", slug: "proxy-landscape", image: "/portfolio/proxy-map.jpg", tags: "Architecture / Computation / Ecology", question: "Water → evidence → coastal repair", motion: "proxy" },
  { number: "03", title: "Museum Reorganization", slug: "museum-reorganization", image: "/portfolio/museum-process.jpg", tags: "Architecture / Computation", question: "Plan → routes → spatial choice", motion: "museum" },
  { number: "04", title: "Mycelium Living Facade", slug: "mycelium-living-facade", image: "/portfolio/mycelium-facade.jpg", tags: "Architecture / Material / Ecology", question: "Growth → maturity → decay", motion: "mycelium" },
] as const;

const additionalWork = [
  { number: "05", title: "Conflict in Light and Dark", slug: "conflict-light-dark", image: "/portfolio/conflict-light-dark.jpg", tags: "Architecture / Material", question: "Light → contrast → cultural expression", year: "2023" },
  { number: "06", title: "Lens on the Move", slug: "lens-on-the-move", image: "/portfolio/lens-on-the-move.jpg", tags: "Architecture / Material", question: "Mobility → adaptation → dwelling", year: "2024" },
  { number: "07", title: "Intertwined Energy and Human Activities", slug: "future-truck-stop", image: "/portfolio/future-truck-stop.jpg", tags: "Architecture / Ecology", question: "Energy → infrastructure → human activity", year: "2023" },
  { number: "08", title: "Hope in Gap", slug: "hope-in-gap", image: "/portfolio/hope-in-gap.jpg", tags: "Architecture", question: "Urban gaps → modular housing → community", year: "2020" },
  { number: "09", title: "MaaS Ecosystem Profit Analyzer", slug: "maas-profit-analyzer", image: "/portfolio/maas/dashboard-top.png", tags: "Data Product / Financial Analytics", question: "Workbooks → audit → decision", year: "2026" },
] as const;

function MotionPreview({ type }: { type: (typeof work)[number]["motion"] }) {
  if (type === "biochar") return <div className="motion biochar-motion" aria-hidden="true"><span className="biochar-cycle" /><i className="biochar-trunk" /><i className="biochar-branch branch-one" /><i className="biochar-branch branch-two" /><i className="biochar-branch branch-three" /><i className="biochar-branch branch-four" /></div>;
  if (type === "proxy") return <div className="motion proxy-motion" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ "--n": i } as React.CSSProperties} />)}</div>;
  if (type === "museum") return <div className="motion museum-motion" aria-hidden="true"><i /><i /><i /><i /><b>01</b><b>02</b><b>03</b><b>04</b></div>;
  return <div className="motion mycelium-motion" aria-hidden="true"><i /><i /><i /><span>GROWTH</span><span>MATURE</span><span>DECAY</span></div>;
}

export default function WorkIndex() {
  return <main className="work-index-page">
    <header className="index-header">
      <a className="home-mark" href="/">LINDA DENG</a>
      <p>Selected Work / 2022–2025</p>
      <nav><a href="/">Home</a><a href="/about">About</a></nav>
    </header>

    <section className="index-intro">
      <span>01 / INDEX</span>
      <h1>Selected<br /><i>research systems.</i></h1>
      <p>Each preview animates the project’s central method—not a decorative effect. Final images will replace these portfolio spreads after the visual direction is confirmed.</p>
    </section>

    <section className="project-index" aria-label="Selected projects">
      {work.map(project => <a href={`/work/${project.slug}`} className={`index-project preview-${project.motion}`} key={project.slug}>
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
      </a>)}
    </section>

    <section className="additional-work" aria-labelledby="additional-work-title">
      <header className="additional-work-head">
        <span>02 / ADDITIONAL + ONGOING</span>
        <div><h2 id="additional-work-title">Further studies.</h2><p>A quieter index of spatial studies, adaptable systems, and work in development.</p></div>
      </header>
      <div className="additional-work-grid">
        {additionalWork.map(project => <a href={`/work/${project.slug}`} className="additional-project" key={project.slug}>
          <figure><img src={project.image} alt={`${project.title} portfolio spread`} /><figcaption>{project.year} / PORTFOLIO STUDY</figcaption></figure>
          <div className="additional-project-copy">
            <span>{project.number}</span><p>{project.tags}</p>
            <h2>{project.title}</h2><h3>{project.question}</h3><small>View project ↗</small>
          </div>
        </a>)}
      </div>
    </section>

    <footer><span>LINDA DENG</span><span>DESIGN / RESEARCH / TECHNOLOGY</span><span>NEW YORK · 2026</span></footer>
  </main>;
}
