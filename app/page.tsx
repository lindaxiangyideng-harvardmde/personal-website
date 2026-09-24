"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

const fields = [
  { name: "Architecture", note: "spatial effect" },
  { name: "Material", note: "physical transformation" },
  { name: "Computation", note: "organizational logic" },
  { name: "Ecology", note: "living relation" },
] as const;

const systemRoutes = [
  { end: [124, 315], gradient: "route-gradient-0" },
  { end: [858, 214], gradient: "route-gradient-1" },
  { end: [842, 584], gradient: "route-gradient-2" },
  { end: [154, 586], gradient: "route-gradient-3" },
] as const;

function systemRouteGeometry(end: readonly [number, number]) {
  const [endX, endY] = end;
  const originX = 500;
  const originY = 380;
  const dx = endX - originX;
  const dy = endY - originY;
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;
  const px = -uy;
  const py = ux;
  const shoulderX = endX - ux * 30;
  const shoulderY = endY - uy * 30;
  const startHalfWidth = 2.5;
  const bandHalfWidth = 9;
  const arrowHalfWidth = 16;
  const point = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;

  return {
    motionPath: `M ${originX} ${originY} L ${endX} ${endY}`,
    bandPath: [
      `M ${point(originX + px * startHalfWidth, originY + py * startHalfWidth)}`,
      `L ${point(shoulderX + px * bandHalfWidth, shoulderY + py * bandHalfWidth)}`,
      `L ${point(shoulderX + px * arrowHalfWidth, shoulderY + py * arrowHalfWidth)}`,
      `L ${point(endX, endY)}`,
      `L ${point(shoulderX - px * arrowHalfWidth, shoulderY - py * arrowHalfWidth)}`,
      `L ${point(shoulderX - px * bandHalfWidth, shoulderY - py * bandHalfWidth)}`,
      `L ${point(originX - px * startHalfWidth, originY - py * startHalfWidth)} Z`,
    ].join(" "),
  };
}

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
  { title: "ALAN", slug: "alan", image: "/portfolio/alan/cover.svg", backdropImage: "/portfolio/alan/cover.svg", backdropPosition: "50% 50%", fields: "Environmental Data / Computation / Ecology", caption: "Spectrum → receptor contribution → perceptual space", motion: "alan" },
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

export default function Home() {
  const [scene, setScene] = useState(0);
  const [active, setActive] = useState(0);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  useEffect(() => {
    let timer = 0;
    const schedule = () => {
      window.clearTimeout(timer);
      if (!document.hidden) timer = window.setTimeout(() => setScene(current => (current + 1) % sceneCount), 7500);
    };
    const handleVisibility = () => schedule();
    schedule();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [scene]);

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
      onPointerDown={traceSystem}
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
            <svg className="system-routes" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                {systemRoutes.map((route, index) => {
                  return <linearGradient id={route.gradient} gradientUnits="userSpaceOnUse" x1="500" y1="380" x2={route.end[0]} y2={route.end[1]} key={route.gradient}>
                    <stop offset="0" stopColor="#7997a2" stopOpacity=".05" />
                    <stop offset=".5" stopColor="#6f95a2" stopOpacity=".24" />
                    <stop offset="1" stopColor="#7da9b7" stopOpacity=".5" />
                  </linearGradient>;
                })}
                <filter id="signal-glow" x="-400%" y="-400%" width="900%" height="900%">
                  <feGaussianBlur stdDeviation="12" result="outerGlow" />
                  <feGaussianBlur stdDeviation="3" result="innerGlow" />
                  <feMerge>
                    <feMergeNode in="outerGlow" /><feMergeNode in="outerGlow" />
                    <feMergeNode in="innerGlow" /><feMergeNode in="innerGlow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {systemRoutes.map((route, index) => {
                const geometry = systemRouteGeometry(route.end);
                return <g className={`system-route ${active === index ? "is-active" : ""}`} key={route.gradient}>
                  <path className="system-route-band-base" d={geometry.bandPath} />
                  <path className="system-route-band-glow" d={geometry.bandPath} fill={`url(#${route.gradient})`} />
                  <path className="system-route-band" d={geometry.bandPath} fill={`url(#${route.gradient})`} />
                  <circle className="system-route-terminal-core" cx={route.end[0]} cy={route.end[1]} r="4.5" />
                  {[0, 1, 2].map(waveIndex => <circle className="system-route-wave" cx={route.end[0]} cy={route.end[1]} r="4" style={{ "--wave": waveIndex } as CSSProperties} key={waveIndex} />)}
                  {active === index ? <g className="system-signal-trail">
                    {Array.from({ length: 15 }, (_, trailIndex) => {
                      const start = .04 + trailIndex * .015;
                      const end = .72 + trailIndex * .012;
                      const radius = trailIndex === 0 ? 9 : Math.max(1.35, 5.5 - trailIndex * .3);
                      const opacity = trailIndex === 0 ? 1 : Math.max(.055, .58 * Math.pow(1 - trailIndex / 15, 1.45));
                      return <circle
                        className={`system-signal ${trailIndex === 0 ? "system-signal-leader" : "system-signal-particle"} ${trailIndex >= 9 ? "is-desktop-tail" : ""}`}
                        r={radius}
                        filter={trailIndex === 0 ? "url(#signal-glow)" : undefined}
                        style={{ "--particle-opacity": opacity } as CSSProperties}
                        key={trailIndex}
                      >
                        <animateMotion dur="3.4s" repeatCount="indefinite" path={geometry.motionPath} keyPoints="0;0;1;1" keyTimes={`0;${start};${end};1`} calcMode="linear" />
                        <animate attributeName="opacity" dur="3.4s" repeatCount="indefinite" values={`0;0;${opacity};${opacity};0;0`} keyTimes={`0;${start};${Math.min(start + .025, end)};${Math.max(start + .025, end - .025)};${end};1`} />
                      </circle>;
                    })}
                  </g> : null}
                </g>;
              })}
            </svg>
            <div className="field-core"><span>CONDITION</span><i /></div>
            {fields.map((field, index) => <div className={`field-path path-${index} ${active === index ? "is-active" : ""}`} key={field.name}>
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
            <ProjectMedia project={project} isActive={scene === index + 1} shouldPreload={scene === index || scene === index + 1} />
            <div className="home-project-title"><span>0{index + 1} / SELECTED WORK</span><h2>{project.title}</h2><p>{project.caption}</p></div>
          </a>
        </article>)}

        {scene > 0 && currentProject ? <div className="scene-status" aria-live="polite"><span>{String(scene + 1).padStart(2, "0")} / {String(sceneCount).padStart(2, "0")}</span><p>{currentProject.title}</p><small>{currentProject.fields}</small></div> : null}
        <a className="enter-work" href="/work">Selected Work <span>↓</span></a>
      </section>

      <div className="scene-controls" aria-label="Homepage scenes">{Array.from({ length: sceneCount }, (_, index) => <button key={index} type="button" className={scene === index ? "is-current" : ""} onClick={() => setScene(index)} aria-label={`Show scene ${index + 1}`}><i /></button>)}</div>
    </main>
  );
}
