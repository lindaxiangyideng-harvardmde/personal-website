"use client";

import { useEffect, useState, type CSSProperties, type PointerEvent } from "react";

const fields = [
  { name: "Architecture", note: "spatial effect" },
  { name: "Material", note: "physical transformation" },
  { name: "Computation", note: "organizational logic" },
  { name: "Ecology", note: "living relation" },
] as const;

const projectScenes = [
  { title: "Biochar Metabolism", slug: "biochar-metabolism", image: "/portfolio/biochar-architecture.jpg", fields: "Architecture / Material / Ecology", caption: "Waste → carbon → building repair", motion: "biochar" },
  { title: "The Proxy Landscape", slug: "proxy-landscape", image: "/portfolio/proxy-map.jpg", fields: "Architecture / Computation / Ecology", caption: "Water → evidence → coastal repair", motion: "proxy" },
  { title: "Museum Reorganization", slug: "museum-reorganization", image: "/portfolio/museum-process.jpg", fields: "Architecture / Computation", caption: "Plan → routes → spatial choice", motion: "museum" },
  { title: "Mycelium Living Facade", slug: "mycelium-living-facade", image: "/portfolio/mycelium-facade.jpg", fields: "Architecture / Material / Ecology", caption: "Growth → maturity → decay", motion: "mycelium" },
] as const;

function HeroMotion({ type }: { type: (typeof projectScenes)[number]["motion"] }) {
  if (type === "biochar") return <div className="hero-motion hero-biochar" aria-hidden="true"><i /><i /><i /><i /><i /></div>;
  if (type === "proxy") return <div className="hero-motion hero-proxy" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ "--n": i } as CSSProperties} />)}</div>;
  if (type === "museum") return <div className="hero-motion hero-museum" aria-hidden="true"><i /><i /><i /><i /><b>01</b><b>02</b><b>03</b><b>04</b></div>;
  return <div className="hero-motion hero-mycelium" aria-hidden="true"><i /><i /><i /><span>GROWTH</span><span>MATURE</span><span>DECAY</span></div>;
}

export default function Home() {
  const [scene, setScene] = useState(0);
  const [active, setActive] = useState(0);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const timer = window.setInterval(() => setScene(current => (current + 1) % 5), 7500);
    return () => window.clearInterval(timer);
  }, []);

  function traceSystem(event: PointerEvent<HTMLElement>) {
    if (scene !== 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setPointer({ x, y });
    setActive(x < 50 ? (y < 50 ? 0 : 3) : y < 50 ? 1 : 2);
  }

  const currentProject = scene > 0 ? projectScenes[scene - 1] : null;

  return (
    <main
      className="home-shell"
      onPointerMove={traceSystem}
      style={{ "--mx": `${pointer.x}%`, "--my": `${pointer.y}%` } as CSSProperties}
    >
      <header className="home-header">
        <a className="home-mark" href="/" aria-label="Linda Deng home">LINDA DENG</a>
        <p>Design / Research / Technology</p>
        <nav aria-label="Primary navigation"><a href="/work">Selected Work</a><a href="/about">About</a></nav>
      </header>

      <section className="home-stage" aria-label="Rotating research landscapes">
        <div className={`system-scene ${scene === 0 ? "is-current" : ""}`} aria-hidden={scene !== 0}>
          <div className="field-orbit">
            <div className="field-haze" /><div className="field-disc field-disc-one" /><div className="field-disc field-disc-two" />
            <div className="field-core"><span>CONDITION</span><i /></div>
            {fields.map((field, index) => <div className={`field-path path-${index} ${active === index ? "is-active" : ""}`} key={field.name}>
              <i className="path-line" /><i className="path-pulse" />
              <button type="button" tabIndex={scene === 0 ? 0 : -1} onPointerEnter={() => setActive(index)} onFocus={() => setActive(index)} aria-label={`Trace the system toward ${field.name}`}><span>0{index + 1}</span><b>{field.name}</b></button>
            </div>)}
          </div>
          <div className="home-title"><span>RESEARCH LANDSCAPE / 2026</span><h1>Systems become<br /><i>spatial propositions.</i></h1></div>
          <div className="system-reading" aria-live="polite"><span>INPUT → TRANSFORMATION → EFFECT</span><p>{fields[active].name}</p><small>{fields[active].note}</small></div>
        </div>

        {projectScenes.map((project, index) => <article className={`home-project-scene ${scene === index + 1 ? "is-current" : ""}`} aria-hidden={scene !== index + 1} key={project.slug}>
          <a className="home-project-link" href={`/work/${project.slug}`} tabIndex={scene === index + 1 ? 0 : -1}>
            <figure className="home-project-media"><img src={project.image} alt={`${project.title} portfolio placeholder`} /><HeroMotion type={project.motion} /></figure>
            <div className="home-project-title"><span>0{index + 1} / SELECTED WORK</span><h2>{project.title}</h2><p>{project.caption}</p></div>
          </a>
        </article>)}

        {scene > 0 && currentProject ? <div className="scene-status" aria-live="polite"><span>{String(scene + 1).padStart(2, "0")} / 05</span><p>{currentProject.title}</p><small>{currentProject.fields}</small></div> : null}
        <a className="enter-work" href="/work">Selected Work <span>↓</span></a>
      </section>

      <div className="scene-controls" aria-label="Homepage scenes">{Array.from({ length: 5 }, (_, index) => <button key={index} type="button" className={scene === index ? "is-current" : ""} onClick={() => setScene(index)} aria-label={`Show scene ${index + 1}`}><i /></button>)}</div>
    </main>
  );
}
