"use client";

import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { categories, type CategoryKey } from "./work/categories";

/** The slice of project data the field needs; built on the server in app/page.tsx. */
export type FieldProject = {
  slug: string;
  category: CategoryKey;
  number: string;
  title: string;
  year: string;
  tags: string[];
  question: string;
  color: string;
  stages: string[];
};

type Focus = "all" | CategoryKey;

type Props = {
  projects: FieldProject[];
  /** Only render frames while the field is the visible home scene. */
  active: boolean;
  /** Called (throttled) whenever someone interacts with the field, so the home carousel can hold. */
  onActivity: () => void;
  tabIndex: number;
};

const PAPER = "#f2f1eb";
const INK = "#161b19";
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const damp = (dt: number, k: number) => 1 - Math.exp(-dt * k);

/** Deterministic layout: product work on a near arc, architecture on a far arc, shared themes in the middle. */
function layout(projects: FieldProject[], themes: string[]) {
  const product = projects.filter(p => p.category === "product");
  const spatial = projects.filter(p => p.category !== "product");
  const themePos = new Map(themes.map((t, i) => {
    const a = (i / themes.length) * Math.PI * 2 + 0.3;
    return [t, [Math.sin(a) * 2.1, (i % 2 ? 0.6 : -0.55) + Math.sin(i * 2.3) * 0.25, Math.cos(a) * 2.1] as const];
  }));
  const hubs = projects.map(p => {
    let a: number, r: number, y: number;
    if (p.category === "product") {
      const i = product.indexOf(p);
      a = (i - (product.length - 1) / 2) * 0.62; r = 4.3; y = [0.55, -0.4, 0.8][i % 3];
    } else {
      const j = spatial.indexOf(p);
      a = 1.05 + j * ((Math.PI * 2 - 2.1) / Math.max(1, spatial.length - 1)); r = 5.8; y = Math.sin(j * 1.9) * 1.55;
    }
    return { slug: p.slug, angle: a, hub: [Math.sin(a) * r, y, Math.cos(a) * r] as const, radius: p.category === "product" ? 1.05 : 0.85 };
  });
  return { themePos, hubs };
}

function ResearchField({ projects, active, onActivity, tabIndex }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hubRefs = useRef(new Map<string, HTMLButtonElement>());
  const stageRefs = useRef(new Map<string, (HTMLSpanElement | null)[]>());
  const themeRefs = useRef(new Map<string, HTMLSpanElement>());
  const [selected, setSelected] = useState(projects[0]?.slug ?? "");
  const [focus, setFocus] = useState<Focus>("all");
  const [status, setStatus] = useState<"loading" | "ready" | "unsupported">("loading");

  const themes = useMemo(() => [...new Set(projects.flatMap(p => p.tags))], [projects]);
  const plan = useMemo(() => layout(projects, themes), [projects, themes]);

  // Values the render loop reads every frame without re-running the setup effect.
  const live = useRef({ selected, focus, hovered: null as string | null, active, targetYaw: null as number | null, pingCooling: false, wake: () => {} });

  // Tell the home carousel about interaction at most once a second.
  const ping = () => {
    if (live.current.pingCooling) return;
    live.current.pingCooling = true;
    onActivity();
    window.setTimeout(() => { live.current.pingCooling = false; }, 1000);
  };

  const select = (slug: string) => {
    setSelected(slug);
    live.current.selected = slug;
    live.current.targetYaw = plan.hubs.find(h => h.slug === slug)?.angle ?? null;
    live.current.wake();
    ping();
  };

  const chooseFocus = (next: Focus) => {
    setFocus(next);
    live.current.focus = next;
    if (next === "product") live.current.targetYaw = 0;
    if (next === "architecture") live.current.targetYaw = Math.PI;
    live.current.wake();
    ping();
  };

  useEffect(() => { live.current.active = active; live.current.wake(); }, [active]);

  useEffect(() => {
    const host = hostRef.current, canvas = canvasRef.current;
    if (!host || !canvas) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then(THREE => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      } catch {
        setStatus("unsupported");
        return;
      }
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      const paper = new THREE.Color(PAPER);
      const scene = new THREE.Scene();
      scene.background = paper;
      scene.fog = new THREE.Fog(paper, 10, 22);
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      const up = new THREE.Vector3(0, 1, 0);
      const vec = (p: readonly [number, number, number]) => new THREE.Vector3(p[0], p[1], p[2]);

      const dotCanvas = document.createElement("canvas");
      dotCanvas.width = dotCanvas.height = 64;
      const g = dotCanvas.getContext("2d");
      if (g) { g.fillStyle = "#fff"; g.beginPath(); g.arc(32, 32, 26, 0, Math.PI * 2); g.fill(); }
      const dot = new THREE.CanvasTexture(dotCanvas);

      const disposables: { dispose: () => void }[] = [dot];
      const track = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

      const themeVec = new Map([...plan.themePos].map(([t, p]) => [t, vec(p)]));
      const themeGeo = track(new THREE.SphereGeometry(0.045, 12, 8));
      const themeMat = track(new THREE.MeshBasicMaterial({ color: INK }));
      themeVec.forEach(p => { const m = new THREE.Mesh(themeGeo, themeMat); m.position.copy(p); scene.add(m); });

      const hubGeo = track(new THREE.SphereGeometry(0.12, 24, 16));
      const haloGeo = track(new THREE.SphereGeometry(0.32, 24, 16));
      const hitGeo = track(new THREE.SphereGeometry(0.55, 8, 6));
      const stageGeo = track(new THREE.SphereGeometry(0.05, 12, 8));
      const hitMat = track(new THREE.MeshBasicMaterial({ visible: false }));
      const hits: InstanceType<typeof THREE.Mesh>[] = [];

      const nodes = projects.map(p => {
        const h = plan.hubs.find(x => x.slug === p.slug)!;
        const hub = vec(h.hub);
        const radial = hub.clone().setY(0).normalize();
        const tangent = new THREE.Vector3(radial.z, 0, -radial.x);
        const stages = p.stages.map((_, k) => {
          const ang = Math.PI / 2 - k * (Math.PI * 2 / p.stages.length);
          return hub.clone().addScaledVector(tangent, Math.cos(ang) * h.radius).addScaledVector(up, Math.sin(ang) * h.radius).addScaledVector(radial, (k - 2) * 0.14);
        });
        const color = new THREE.Color(p.color);
        const mats = {
          hub: track(new THREE.MeshBasicMaterial({ color, transparent: true })),
          halo: track(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1, depthWrite: false })),
          stage: track(new THREE.MeshBasicMaterial({ color, transparent: true })),
          chain: track(new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 })),
          spoke: track(new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 })),
          theme: track(new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.12 })),
          flow: track(new THREE.PointsMaterial({ color, size: 0.14, map: dot, transparent: true, alphaTest: 0.4, depthWrite: false })),
        };
        const add = (obj: InstanceType<typeof THREE.Object3D>) => { scene.add(obj); return obj; };
        add(new THREE.Mesh(hubGeo, mats.hub)).position.copy(hub);
        add(new THREE.Mesh(haloGeo, mats.halo)).position.copy(hub);
        const hit = new THREE.Mesh(hitGeo, hitMat); hit.position.copy(hub); hit.userData.slug = p.slug; scene.add(hit); hits.push(hit);
        stages.forEach(s => { add(new THREE.Mesh(stageGeo, mats.stage)).position.copy(s); });
        const lines = (pts: InstanceType<typeof THREE.Vector3>[], mat: InstanceType<typeof THREE.LineBasicMaterial>) => add(new THREE.LineSegments(track(new THREE.BufferGeometry().setFromPoints(pts)), mat));
        lines(stages.slice(0, -1).flatMap((s, k) => [s, stages[k + 1]]), mats.chain);
        lines(stages.flatMap(s => [hub, s]), mats.spoke);
        lines(p.tags.flatMap(t => [hub, themeVec.get(t)!]), mats.theme);
        const flowGeo = track(new THREE.BufferGeometry());
        flowGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(7 * 3), 3));
        add(new THREE.Points(flowGeo, mats.flow));
        return { p, hub, stages, mats, flowGeo, dim: 1, phase: (p.slug.length * 0.137) % 1 };
      });

      // Camera and interaction
      let yaw = 0.32, pitch = 0.34, dragging = false, moved = 0, lastX = 0, lastY = 0, idle = 0;
      // On narrow screens start facing the selected project so its label is on screen.
      if (canvas.clientWidth < 600) yaw = plan.hubs.find(hub => hub.slug === live.current.selected)?.angle ?? yaw;
      let w = 1, h = 1;
      const ray = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const pick = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(hits)[0];
        return hit ? (hit.object.userData.slug as string) : null;
      };
      const onDown = (e: PointerEvent) => { dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); ping(); };
      const onMove = (e: PointerEvent) => {
        if (dragging) {
          const dx = e.clientX - lastX, dy = e.clientY - lastY;
          lastX = e.clientX; lastY = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
          yaw -= dx * 0.006; pitch = clamp(pitch + dy * 0.004, -0.25, 0.75);
          live.current.targetYaw = null; idle = 0; ping();
        } else {
          live.current.hovered = pick(e);
          canvas.style.cursor = live.current.hovered ? "pointer" : "grab";
        }
        start();
      };
      const onUp = (e: PointerEvent) => { if (dragging && moved < 5) { const s = pick(e); if (s) select(s); } dragging = false; };
      const onCancel = () => { dragging = false; };
      const onLeave = () => { if (!dragging) live.current.hovered = null; };
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onCancel);
      canvas.addEventListener("pointerleave", onLeave);

      const resize = () => {
        w = canvas.clientWidth; h = canvas.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.fov = w < 600 ? 50 : 36;
        // Nudge the field down so it sits under the title rather than behind it.
        camera.setViewOffset(w, h, 0, -Math.round(h * (w > 860 ? 0.06 : 0.1)), w, h);
        camera.updateProjectionMatrix();
        start();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      let onScreen = true;
      const io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; start(); });
      io.observe(host);

      const tmp = new THREE.Vector3();
      const place = (el: HTMLElement | null | undefined, v: InstanceType<typeof THREE.Vector3>, dx: number, dy: number) => {
        if (!el) return { behind: true, x: 0, y: 0 };
        tmp.copy(v).project(camera);
        const x = (tmp.x * 0.5 + 0.5) * w, y = (-tmp.y * 0.5 + 0.5) * h;
        el.style.transform = `translate(${(x + dx).toFixed(1)}px, ${(y + dy).toFixed(1)}px)`;
        return { behind: tmp.z > 1, x, y };
      };

      let raf = 0, last = performance.now();
      const frame = (now: number) => {
        raf = 0;
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        const L = live.current;
        idle += dt;
        if (L.targetYaw !== null) {
          const diff = ((L.targetYaw - yaw + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
          yaw += reduced ? diff : diff * damp(dt, 3);
          if (Math.abs(diff) < 0.002) L.targetYaw = null;
        } else if (!dragging && !reduced && idle > 2.5) {
          yaw += dt * 0.05;
        }
        const R = w < 600 ? 13 : 13.8;
        camera.position.set(Math.sin(yaw) * Math.cos(pitch) * R, Math.sin(pitch) * R + 0.2, Math.cos(yaw) * Math.cos(pitch) * R);
        camera.lookAt(0, 0, 0);
        camera.updateMatrixWorld();

        const lit = new Set<string>();
        for (const n of nodes) {
          const isActive = n.p.slug === L.selected || n.p.slug === L.hovered;
          if (isActive) n.p.tags.forEach(t => lit.add(t));
          const inFocus = L.focus === "all" || n.p.category === L.focus;
          const target = isActive ? 1 : inFocus ? 0.72 : 0.12;
          n.dim += (target - n.dim) * (reduced ? 1 : damp(dt || 1, 6));
          const d = n.dim, t = now / 1000;
          n.mats.hub.opacity = d; n.mats.stage.opacity = d; n.mats.flow.opacity = d;
          n.mats.halo.opacity = isActive ? 0.16 + (reduced ? 0 : Math.sin(t * 2.4) * 0.04) : 0.08 * d;
          n.mats.chain.opacity = 0.85 * d;
          n.mats.spoke.opacity = (isActive ? 0.5 : 0.28) * d;
          n.mats.theme.opacity = isActive ? 0.42 : 0.1 * d;

          const pos = n.flowGeo.attributes.position;
          const speed = reduced ? 0 : isActive ? 0.32 : 0.12;
          const segs = n.stages.length - 1;
          for (let i = 0; i < 7; i++) {
            const u = ((t * speed + n.phase + i / 7) % 1) * segs;
            const k = Math.floor(u);
            tmp.copy(n.stages[k]).lerp(n.stages[Math.min(segs, k + 1)], u - k);
            pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
          }
          pos.needsUpdate = true;

          const btn = hubRefs.current.get(n.p.slug);
          const s = place(btn, n.hub, 12, -10);
          if (btn) {
            const dist = camera.position.distanceTo(n.hub);
            const fade = clamp(1.25 - (dist - 8) / 11, 0.3, 1);
            btn.style.opacity = String(s.behind ? 0 : isActive ? 1 : fade * clamp(d * 1.2, 0.15, 1));
            btn.style.zIndex = String(isActive ? 40 : Math.round(30 - dist));
            btn.classList.toggle("is-compact", w < 600 && !isActive);
          }
          const stageEls = stageRefs.current.get(n.p.slug) ?? [];
          n.stages.forEach((sv, k) => {
            const el = stageEls[k];
            const sp = place(el, sv, 6, 4);
            if (el) el.style.opacity = isActive && !sp.behind ? "1" : "0";
          });
        }
        themeVec.forEach((v, name) => {
          const el = themeRefs.current.get(name);
          place(el, v, -4, 7);
          if (el) el.classList.toggle("is-lit", lit.has(name));
        });
        renderer.render(scene, camera);
        if (L.active && onScreen && !document.hidden) raf = requestAnimationFrame(frame);
      };
      function start() {
        if (!raf && live.current.active && onScreen && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); }
      }
      live.current.wake = start;
      document.addEventListener("visibilitychange", start);
      resize();
      setStatus("ready");
      frame(performance.now());

      cleanup = () => {
        if (raf) cancelAnimationFrame(raf);
        ro.disconnect(); io.disconnect();
        document.removeEventListener("visibilitychange", start);
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onCancel);
        canvas.removeEventListener("pointerleave", onLeave);
        disposables.forEach(x => x.dispose());
        renderer.dispose();
        live.current.wake = () => {};
      };
    }).catch(() => { if (!disposed) setStatus("unsupported"); });

    return () => { disposed = true; cleanup(); };
    // The scene is built once per project list; selection and focus flow through `live`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, plan]);

  const current = projects.find(p => p.slug === selected) ?? projects[0];
  const focusOptions: { key: Focus; label: string }[] = [
    { key: "all", label: "All work" },
    { key: "product", label: categories.product.label },
    { key: "architecture", label: "Architecture" },
  ];

  return <div className={`research-field is-${status}`} ref={hostRef}>
    <canvas ref={canvasRef} aria-label="Three-dimensional map of all projects. Drag to turn it; select a project name to read about it." />
    <div className="rf-labels">
      {themes.map(t => <span className="rf-theme" key={t} ref={el => { if (el) themeRefs.current.set(t, el); else themeRefs.current.delete(t); }}>{t}</span>)}
      {projects.map(p => <span key={`${p.slug}-stages`}>
        {p.stages.map((s, k) => <span className="rf-stage" key={s} ref={el => {
          const list = stageRefs.current.get(p.slug) ?? [];
          list[k] = el; stageRefs.current.set(p.slug, list);
        }}>{s}</span>)}
      </span>)}
      {projects.map(p => <button
        type="button"
        className={`rf-hub ${p.slug === selected ? "is-selected" : ""}`}
        key={p.slug}
        tabIndex={tabIndex}
        aria-pressed={p.slug === selected}
        style={{ "--project": p.color } as CSSProperties}
        ref={el => { if (el) hubRefs.current.set(p.slug, el); else hubRefs.current.delete(p.slug); }}
        onClick={() => select(p.slug)}
        onPointerEnter={() => { live.current.hovered = p.slug; live.current.wake(); }}
        onPointerLeave={() => { if (live.current.hovered === p.slug) live.current.hovered = null; }}
        onFocus={ping}
      ><span>{p.number}</span>{p.title}</button>)}
    </div>

    <div className="rf-filters" role="group" aria-label="Show projects">
      {focusOptions.map(o => <button type="button" key={o.key} tabIndex={tabIndex} aria-pressed={focus === o.key} onClick={() => chooseFocus(o.key)}>{o.label}</button>)}
    </div>

    {current ? <div className="rf-panel" aria-live="polite">
      <span className="rf-kicker"><i style={{ background: current.color }} />{current.number} · {categories[current.category].label} · {current.year}</span>
      <h2>{current.title}</h2>
      <p>{current.question}</p>
      <ol>{current.stages.map(s => <li key={s}>{s}</li>)}</ol>
      <a href={`/work/${current.slug}`} tabIndex={tabIndex}>View project ↗</a>
    </div> : null}
  </div>;
}

export default memo(ResearchField);
