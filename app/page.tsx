"use client";

import { useState, type CSSProperties, type PointerEvent } from "react";
import Link from "next/link";

const fields = [
  { name: "Architecture", note: "spatial effect" },
  { name: "Material", note: "physical transformation" },
  { name: "Computation", note: "organizational logic" },
  { name: "Ecology", note: "living relation" },
] as const;

export default function Home() {
  const [active, setActive] = useState(0);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  function traceSystem(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setPointer({ x, y });
    setActive(x < 50 ? (y < 50 ? 0 : 3) : y < 50 ? 1 : 2);
  }

  return (
    <main
      className="home-shell"
      onPointerMove={traceSystem}
      style={{ "--mx": `${pointer.x}%`, "--my": `${pointer.y}%` } as CSSProperties}
    >
      <header className="home-header">
        <Link className="home-mark" href="/" aria-label="Linda Deng home">LINDA DENG</Link>
        <p>Design / Research / Technology</p>
        <nav aria-label="Primary navigation">
          <Link href="/work">Selected Work</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>

      <section className="home-stage" aria-label="An interactive map connecting conditions to four fields of practice">
        <div className="field-orbit">
          <div className="field-haze" />
          <div className="field-disc field-disc-one" />
          <div className="field-disc field-disc-two" />
          <div className="field-core"><span>CONDITION</span><i /></div>
          {fields.map((field, index) => (
            <div className={`field-path path-${index} ${active === index ? "is-active" : ""}`} key={field.name}>
              <i className="path-line" />
              <i className="path-pulse" />
              <button type="button" onPointerEnter={() => setActive(index)} onFocus={() => setActive(index)} aria-label={`Trace the system toward ${field.name}`}>
                <span>0{index + 1}</span>
                <b>{field.name}</b>
              </button>
            </div>
          ))}
        </div>

        <div className="home-title">
          <span>RESEARCH LANDSCAPE / 2026</span>
          <h1>Systems become<br /><i>spatial propositions.</i></h1>
        </div>

        <div className="system-reading" aria-live="polite">
          <span>INPUT → TRANSFORMATION → EFFECT</span>
          <p>{fields[active].name}</p>
          <small>{fields[active].note}</small>
        </div>

        <Link className="enter-work" href="/work">Selected Work <span>↓</span></Link>
      </section>

      <div className="home-coordinate"><span>{pointer.x.toFixed(0)}</span> / <span>{pointer.y.toFixed(0)}</span></div>
    </main>
  );
}
