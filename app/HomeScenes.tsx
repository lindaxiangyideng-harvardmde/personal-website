"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import ResearchField, { type FieldProject } from "./ResearchField";
import { SiteNav } from "./SiteNav";

type ProjectScene = {
  title: string;
  slug: string;
  image: string;
  video?: string;
  transitionFrames?: { from: string; to: string };
  seasonalFrames?: readonly { src: string; label: string }[];
  backdropImage: string;
  backdropPosition: string;
  fields: string;
  caption: string;
  motion: "alan" | "biochar" | "proxy" | "mycelium" | null;
};

const projectScenes: readonly ProjectScene[] = [
  { title: "ALAN", slug: "alan", image: "/portfolio/alan/alan-carolina-sphinx-wide.webp", video: "/portfolio/alan/alan-carolina-sphinx-wide.mp4", backdropImage: "/portfolio/alan/alan-carolina-sphinx-wide.webp", backdropPosition: "50% 45%", fields: "Environmental Data / Computation / Ecology", caption: "Spectrum → receptor contribution → perceptual space", motion: null },
  { title: "Biochar Metabolism", slug: "biochar-metabolism", image: "/portfolio/biochar/home/building-cycle-poster.jpg", video: "/portfolio/biochar/home/biochar-website-use.mp4", backdropImage: "/portfolio/biochar/home/material-background.jpg", backdropPosition: "54% 50%", fields: "Architecture / Material / Ecology", caption: "Waste → carbon → building repair", motion: null },
  { title: "The Proxy Landscape", slug: "proxy-landscape", image: "/portfolio/proxy/home/spontaneous.jpg", transitionFrames: { from: "/portfolio/proxy/home/spontaneous.jpg", to: "/portfolio/proxy/home/unspontaneous.jpg" }, backdropImage: "/portfolio/proxy/home/nyc-watershed-background.jpg", backdropPosition: "50% 54%", fields: "Architecture / Computation / Ecology", caption: "Water → evidence → coastal repair", motion: null },
  { title: "Museum Reorganization", slug: "museum-reorganization", image: "/portfolio/museum/film-poster.webp", video: "/portfolio/museum/home-introduction-07-16.mp4", backdropImage: "/portfolio/museum/home-user-example-background.jpg", backdropPosition: "50% 48%", fields: "Architecture / Computation", caption: "Plan → routes → spatial choice", motion: null },
  { title: "Mycelium Living Facade", slug: "mycelium-living-facade", image: "/portfolio/mycelium/home/season-winter.jpg", video: "/portfolio/mycelium/home/mycelium-website-use.mp4", backdropImage: "/portfolio/mycelium/home/facade-context-background.jpg", backdropPosition: "50% 48%", fields: "Architecture / Material / Ecology", caption: "Growth → maturity → decay", motion: null },
  { title: "Second World", slug: "second-world", image: "/portfolio/second-world/home/second-world-32s-poster.jpg", video: "/portfolio/second-world/home/second-world-22-42-2_5x.mp4", backdropImage: "/portfolio/second-world/home/quest-portraits-background.jpg", backdropPosition: "50% 50%", fields: "Data Visualization / Computation", caption: "Intention → digital behavior → body response", motion: null },
] as const;

const sceneCount = projectScenes.length + 1;

function HeroMotion({ type }: { type: NonNullable<ProjectScene["motion"]> }) {
  if (type === "alan") return <div className="hero-motion hero-alan" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ "--n": i } as CSSProperties} />)}<span>PHYSICAL</span><span>CONTRIBUTION</span><span>INTERPRETIVE</span></div>;
  if (type === "biochar") return <div className="hero-motion hero-biochar" aria-hidden="true"><i /><i /><i /><i /><i /></div>;
  if (type === "proxy") return <div className="hero-motion hero-proxy" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ "--n": i } as CSSProperties} />)}</div>;
  return <div className="hero-motion hero-mycelium" aria-hidden="true"><i /><i /><i /><span>GROWTH</span><span>MATURE</span><span>DECAY</span></div>;
}

function ProjectMedia({ project, isActive, shouldPreload }: { project: ProjectScene; isActive: boolean; shouldPreload: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      video.pause();
      return;
    }
    if (!isActive) {
      video.pause();
      return;
    }

    let disposed = false;
    video.currentTime = 0;

    const attemptPlayback = () => {
      if (disposed || document.hidden || !isActive) return;
      void video.play().catch(() => {
        // The poster remains visible. A later pointer or keyboard gesture retries playback.
      });
    };
    const handleVisibility = () => document.hidden ? video.pause() : attemptPlayback();

    if (video.readyState === 0) video.load();
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) attemptPlayback();
    video.addEventListener("canplay", attemptPlayback);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pointerdown", attemptPlayback, { passive: true });
    window.addEventListener("keydown", attemptPlayback);

    return () => {
      disposed = true;
      video.removeEventListener("canplay", attemptPlayback);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointerdown", attemptPlayback);
      window.removeEventListener("keydown", attemptPlayback);
    };
  }, [isActive]);

  return (
    <figure className="home-project-media">
      {project.seasonalFrames ? (
        <div className="mycelium-season-sequence" aria-label="Mycelium facade changing from winter through autumn">
          {project.seasonalFrames.map(frame => <img className="mycelium-season-frame" src={frame.src} alt={`${frame.label} state of the living mycelium facade`} loading="eager" decoding="async" key={frame.src} />)}
        </div>
      ) : project.transitionFrames ? (
        <div className="watershed-transition" aria-label="Spontaneous watershed transforming into the unspontaneous urban watershed">
          <img className="watershed-map watershed-map-from" src={project.transitionFrames.from} alt="Spontaneous watershed across Jamaica Bay" />
          <img className="watershed-map watershed-map-to" src={project.transitionFrames.to} alt="Unspontaneous watershed shaped by urban infrastructure" />
          <div className="watershed-stream" aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => <i key={index} style={{ "--n": index } as CSSProperties} />)}
          </div>
          <div className="watershed-flow" aria-hidden="true">
            {[
              [18, 35], [31, 57], [46, 31], [57, 62], [70, 42], [82, 66], [64, 22],
            ].map(([x, y], index) => <i key={`${x}-${y}`} style={{ "--x": `${x}%`, "--y": `${y}%`, "--delay": `${index * .09}s` } as CSSProperties} />)}
          </div>
          <div className="watershed-state" aria-hidden="true"><span>SPONTANEOUS / NATURAL FLOW</span><span>UNSPONTANEOUS / URBAN CAPTURE</span></div>
        </div>
      ) : project.video ? (
        <video ref={videoRef} poster={project.image} autoPlay={isActive} muted loop playsInline preload={shouldPreload ? "auto" : "metadata"} aria-label={`${project.title} film excerpt`}>
          <source src={project.video} type="video/mp4" />
        </video>
      ) : (
        <img src={project.image} alt={`${project.title} project cover`} />
      )}
      {project.motion ? <HeroMotion type={project.motion} /> : null}
    </figure>
  );
}

/** How long each scene stays before the carousel advances; the 3D field gets longer and holds while in use. */
const SCENE_MS = 7500;
const FIELD_MS = 15000;

export default function HomeScenes({ fieldProjects }: { fieldProjects: FieldProject[] }) {
  const [scene, setScene] = useState(0);
  const [fieldActivity, setFieldActivity] = useState(0);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const holdCarousel = useCallback(() => setFieldActivity(count => count + 1), []);

  useEffect(() => {
    let timer = 0;
    const schedule = () => {
      window.clearTimeout(timer);
      if (!document.hidden) timer = window.setTimeout(() => setScene(current => (current + 1) % sceneCount), scene === 0 ? FIELD_MS : SCENE_MS);
    };
    const handleVisibility = () => schedule();
    schedule();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [scene, fieldActivity]);

  function traceSystem(event: PointerEvent<HTMLElement>) {
    if (scene === 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setPointer({ x, y });
  }

  const currentProject = scene > 0 ? projectScenes[scene - 1] : null;

  return (
    <main
      className="home-shell"
      onPointerMove={traceSystem}
      onPointerDown={traceSystem}
      style={{ "--mx": `${pointer.x}%`, "--my": `${pointer.y}%` } as CSSProperties}
    >
      <header className="home-header">
        <a className="home-mark" href="/" aria-label="Linda Deng home">LINDA DENG</a>
        <p>Design / Research / Technology</p>
        <SiteNav />
      </header>

      <section className="home-stage" aria-label="Rotating research landscapes">
        <div className={`system-scene field-scene ${scene === 0 ? "is-current" : ""}`} aria-hidden={scene !== 0}>
          <ResearchField projects={fieldProjects} active={scene === 0} onActivity={holdCarousel} tabIndex={scene === 0 ? 0 : -1} />
          <div className="home-title"><span>RESEARCH LANDSCAPE / 2026</span><h1>Systems become<br /><i>spatial propositions.</i></h1></div>
        </div>

        {projectScenes.map((project, index) => <article className={`home-project-scene ${scene === index + 1 ? "is-current" : ""}`} data-project={project.slug} aria-hidden={scene !== index + 1} key={project.slug}>
          <div className="home-project-backdrop" style={{ backgroundImage: `url("${project.backdropImage}")`, backgroundPosition: project.backdropPosition }} aria-hidden="true" />
          <div className="home-project-glow" aria-hidden="true" />
          <a className="home-project-link" href={`/work/${project.slug}`} tabIndex={scene === index + 1 ? 0 : -1}>
            <ProjectMedia project={project} isActive={scene === index + 1} shouldPreload={scene === index || scene === index + 1} />
            <div className="home-project-title"><span>0{index + 1} / SELECTED WORK</span><h2>{project.title}</h2><p>{project.caption}</p></div>
          </a>
        </article>)}

        {scene > 0 && currentProject ? <div className="scene-status" aria-live="polite"><span>{String(scene + 1).padStart(2, "0")} / {String(sceneCount).padStart(2, "0")}</span><p>{currentProject.title}</p><small>{currentProject.fields}</small></div> : null}
        <a className="enter-work" href="/product-design">Product Design <span>↓</span></a>
      </section>

      <div className="scene-controls" aria-label="Homepage scenes">{Array.from({ length: sceneCount }, (_, index) => <button key={index} type="button" className={scene === index ? "is-current" : ""} onClick={() => setScene(index)} aria-label={`Show scene ${index + 1}`}><i /></button>)}</div>
    </main>
  );
}
