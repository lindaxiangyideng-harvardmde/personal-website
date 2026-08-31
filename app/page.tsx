"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

const fields = [
  { name: "Architecture", note: "spatial effect" },
  { name: "Material", note: "physical transformation" },
  { name: "Computation", note: "organizational logic" },
  { name: "Ecology", note: "living relation" },
] as const;

type ProjectScene = {
  title: string;
  slug: string;
  image: string;
  video?: string;
  transitionFrames?: { from: string; to: string };
  backdropImage: string;
  backdropPosition: string;
  fields: string;
  caption: string;
  motion: "biochar" | "proxy" | "mycelium" | null;
};

const projectScenes: readonly ProjectScene[] = [
  { title: "Biochar Metabolism", slug: "biochar-metabolism", image: "/portfolio/biochar-architecture.jpg", backdropImage: "/portfolio/biochar/community-system.jpg", backdropPosition: "46% 48%", fields: "Architecture / Material / Ecology", caption: "Waste → carbon → building repair", motion: "biochar" },
  { title: "The Proxy Landscape", slug: "proxy-landscape", image: "/portfolio/proxy/home/spontaneous.jpg", transitionFrames: { from: "/portfolio/proxy/home/spontaneous.jpg", to: "/portfolio/proxy/home/unspontaneous.jpg" }, backdropImage: "/portfolio/proxy/home/nyc-watershed-background.jpg", backdropPosition: "50% 54%", fields: "Architecture / Computation / Ecology", caption: "Water → evidence → coastal repair", motion: null },
  { title: "Museum Reorganization", slug: "museum-reorganization", image: "/portfolio/museum/film-poster.webp", video: "/portfolio/museum/home-introduction-07-16.mp4", backdropImage: "/portfolio/museum/home-user-example-background.jpg", backdropPosition: "50% 48%", fields: "Architecture / Computation", caption: "Plan → routes → spatial choice", motion: null },
  { title: "Mycelium Living Facade", slug: "mycelium-living-facade", image: "/portfolio/mycelium-facade.jpg", backdropImage: "/portfolio/mycelium/hero-facade.webp", backdropPosition: "62% 45%", fields: "Architecture / Material / Ecology", caption: "Growth → maturity → decay", motion: "mycelium" },
] as const;

function HeroMotion({ type }: { type: NonNullable<ProjectScene["motion"]> }) {
  if (type === "biochar") return <div className="hero-motion hero-biochar" aria-hidden="true"><i /><i /><i /><i /><i /></div>;
  if (type === "proxy") return <div className="hero-motion hero-proxy" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ "--n": i } as CSSProperties} />)}</div>;
  return <div className="hero-motion hero-mycelium" aria-hidden="true"><i /><i /><i /><span>GROWTH</span><span>MATURE</span><span>DECAY</span></div>;
}

function ProjectMedia({ project, isActive }: { project: ProjectScene; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    if (isActive) {
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <figure className="home-project-media">
      {project.transitionFrames ? (
        <div className="watershed-transition" aria-label="Spontaneous watershed transforming into the unspontaneous urban watershed">
          <img className="watershed-map watershed-map-from" src={project.transitionFrames.from} alt="Spontaneous watershed across Jamaica Bay" />
          <img className="watershed-map watershed-map-to" src={project.transitionFrames.to} alt="Unspontaneous watershed shaped by urban infrastructure" />
          <div className="watershed-flow" aria-hidden="true">
            {[
              [18, 35], [31, 57], [46, 31], [57, 62], [70, 42], [82, 66], [64, 22],
            ].map(([x, y], index) => <i key={`${x}-${y}`} style={{ "--x": `${x}%`, "--y": `${y}%`, "--delay": `${index * .09}s` } as CSSProperties} />)}
          </div>
          <div className="watershed-state" aria-hidden="true"><span>SPONTANEOUS / NATURAL FLOW</span><span>UNSPONTANEOUS / URBAN CAPTURE</span></div>
        </div>
      ) : project.video ? (
        <video ref={videoRef} src={project.video} poster={project.image} muted loop playsInline preload="metadata" aria-label={`${project.title} film excerpt`} />
      ) : (
        <img src={project.image} alt={`${project.title} project cover`} />
      )}
      {project.motion ? <HeroMotion type={project.motion} /> : null}
    </figure>
  );
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

        {projectScenes.map((project, index) => <article className={`home-project-scene ${scene === index + 1 ? "is-current" : ""}`} data-project={project.slug} aria-hidden={scene !== index + 1} key={project.slug}>
          <div className="home-project-backdrop" style={{ backgroundImage: `url("${project.backdropImage}")`, backgroundPosition: project.backdropPosition }} aria-hidden="true" />
          <div className="home-project-glow" aria-hidden="true" />
          <a className="home-project-link" href={`/work/${project.slug}`} tabIndex={scene === index + 1 ? 0 : -1}>
            <ProjectMedia project={project} isActive={scene === index + 1} />
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
