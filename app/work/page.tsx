const work = [
  { number: "01", title: "ALAN", slug: "alan", image: "/portfolio/alan/cover.svg", tags: "Environmental Data / Computation / Ecology", question: "Spectrum → receptor contribution → perceptual space", motion: "alan" },
  { number: "02", title: "Biochar Metabolism", slug: "biochar-metabolism", image: "/portfolio/biochar/community-system.jpg", tags: "Architecture / Material / Ecology", question: "Waste → carbon → building repair", motion: "biochar" },
  { number: "03", title: "The Proxy Landscape", slug: "proxy-landscape", image: "/portfolio/proxy/hero-map-spontaneous-clear.webp", tags: "Architecture / Computation / Ecology", question: "Water → evidence → coastal repair", motion: "proxy" },
  { number: "04", title: "Museum Reorganization", slug: "museum-reorganization", image: "/portfolio/museum/film-poster.webp", tags: "Architecture / Computation", question: "Plan → routes → spatial choice", motion: "museum" },
  { number: "05", title: "Mycelium Living Facade", slug: "mycelium-living-facade", image: "/portfolio/mycelium/hero-facade.webp", tags: "Architecture / Material / Ecology", question: "Growth → maturity → decay", motion: "mycelium" },
] as const;

const additionalWork = [
  { number: "06", title: "Conflict in Light and Dark", slug: "conflict-light-dark", image: "/portfolio/conflict/day.webp", tags: "Architecture / Material", question: "Light → contrast → cultural expression", year: "2023" },
  { number: "07", title: "Lens on the Move", slug: "lens-on-the-move", image: "/portfolio/lens/forest-hero.webp", tags: "Architecture / Material", question: "Mobility → adaptation → dwelling", year: "2024" },
  { number: "08", title: "Intertwined Energy and Human Activities", slug: "future-truck-stop", image: "/portfolio/truck-stop/hero.webp", tags: "Architecture / Ecology", question: "Energy → infrastructure → human activity", year: "2023" },
  { number: "09", title: "Hope in Gap", slug: "hope-in-gap", image: "/portfolio/hope/hero.webp", tags: "Architecture", question: "Urban gaps → modular housing → community", year: "2020" },
  { number: "10", title: "MaaS Ecosystem Profit Analyzer", slug: "maas-profit-analyzer", image: "/portfolio/maas/dashboard-top.png", tags: "Data Product / Financial Analytics", question: "Workbooks → audit → decision", year: "2026" },
  { number: "11", title: "Second World", slug: "second-world", image: "/portfolio/second-world/p5_animation/previews/second-world-animation-60s.png", tags: "Data Visualization / Computation", question: "Intention → digital behavior → body response", year: "2026" },
] as const;

function MotionPreview({ type }: { type: (typeof work)[number]["motion"] }) {
  if (type === "alan") return <div className="motion alan-motion" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ "--n": i } as React.CSSProperties} />)}<span>PHYSICAL</span><span>CONTRIBUTION</span><span>INTERPRETIVE</span></div>;
  if (type === "biochar") return <div className="motion biochar-motion" aria-hidden="true"><span className="biochar-cycle" /><i className="biochar-trunk" /><i className="biochar-branch branch-one" /><i className="biochar-branch branch-two" /><i className="biochar-branch branch-three" /><i className="biochar-branch branch-four" /></div>;
  if (type === "proxy") return <div className="motion proxy-motion" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ "--n": i } as React.CSSProperties} />)}</div>;
  if (type === "museum") return <div className="motion museum-motion" aria-hidden="true"><i /><i /><i /><i /><b>01</b><b>02</b><b>03</b><b>04</b></div>;
  return <div className="motion mycelium-motion" aria-hidden="true"><i /><i /><i /><span>GROWTH</span><span>MATURE</span><span>DECAY</span></div>;
}

export default function WorkIndex() {
  return <main className="work-index-page">
    <header className="index-header">
      <a className="home-mark" href="/">LINDA DENG</a>
      <p>Selected Work / 2020–2026</p>
      <nav><a href="/">Home</a><a href="/about">About</a></nav>
    </header>

    <section className="index-intro">
      <span>01 / INDEX</span>
      <h1>Selected<br /><i>research systems.</i></h1>
      <p>Each cover is selected for the index: research images explain a method, hero views establish a spatial proposition, and digital projects retain their native visual language.</p>
    </section>

    <section className="project-index" aria-label="Selected projects">
      {work.map(project => <a href={`/work/${project.slug}`} className={`index-project preview-${project.motion} project-${project.number}`} key={project.slug}>
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
        {additionalWork.map(project => <a href={`/work/${project.slug}`} className={`additional-project project-${project.number}`} key={project.slug}>
          <figure><img src={project.image} alt={`${project.title} selected project cover`} /><figcaption>{project.year} / PROJECT VIEW</figcaption></figure>
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
