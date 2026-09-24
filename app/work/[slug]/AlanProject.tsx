const modes = [
  ["01", "Physical", "Wavelength and time stay fixed while measured irradiance controls height, brightness, and point scale."],
  ["02", "Contribution", "Each receptor becomes an independent S(t,λ) × Rk(λ) layer; the gray field preserves the physical measurement."],
  ["03", "Interpretive", "A deterministic narrative cloud makes perceptual difference spatially legible without claiming that particle position was measured."],
] as const;

const boundaries = [
  ["Single site", "The scene represents one Philadelphia measurement location, not a map of urban light distribution."],
  ["Separate channels", "Receptor responses remain independent and are not collapsed into a single score of animal vision."],
  ["Visible interpretation", "Every non-measured spatial move is labeled so evidence and imagination remain distinguishable."],
] as const;

export default function AlanProject(){return <main className="alan-page">
  <header className="alan-header"><a className="mark" href="/">LINDA DENG</a><nav><a href="/work">← Index</a><a href="/about">About</a></nav></header>

  <section className="alan-title">
    <div className="alan-kicker"><span>01 / 2026</span><span>Environmental Data / Computation / Ecology</span></div>
    <div className="alan-title-copy"><h1>ALAN</h1><p>Artificial Light At Night</p><strong>An interactive spectral space moving between physical measurement, receptor contribution, and explicitly interpretive perception.</strong></div>
    <dl className="alan-facts"><div><dt>Site</dt><dd>Philadelphia · single-point night measurement</dd></div><div><dt>Media</dt><dd>Spectral data · Three.js · interactive 3D space</dd></div><div><dt>Status</dt><dd>Ongoing research · full film forthcoming</dd></div></dl>
  </section>

  <section className="alan-live">
    <div className="alan-live-head"><span>LIVE 3D SPECTRUM</span><p>Switch among Physical, Contribution, and Interpretive. Carolina sphinx is preselected for the moving contribution view.</p></div>
    <iframe src="/portfolio/alan/interactive/" title="ALAN Philadelphia 3D spectral space" loading="eager" allow="fullscreen"/>
  </section>

  <section className="alan-question alan-rule"><span>RESEARCH QUESTION</span><h2>How can artificial light at night be read across measurement and species response without overstating what the data can prove?</h2><p>ALAN begins with absolute downwelling spectral irradiance recorded through the night. The project keeps wavelength, irradiance, and time inside a shared scientific frame, then introduces receptor response as a second reading rather than a replacement for the measurement. An interpretive mode extends those relationships into narrative space while keeping its evidentiary limits visible.</p></section>

  <section className="alan-modes alan-dark">
    <div className="alan-section-head"><span>01 / THREE READINGS</span><h2>One dataset changes meaning without changing its source.</h2><p>The modes form a deliberate sequence: first inspect the recorded field, then read receptor-weighted contribution, then enter an interpretive spatial proposition.</p></div>
    <div className="alan-mode-grid">{modes.map(([number,title,copy])=><article key={title}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
  </section>

  <section className="alan-sphinx alan-rule">
    <div className="alan-section-head"><span>02 / CAROLINA SPHINX</span><h2>A moving camera turns receptor contribution into an embodied viewpoint.</h2><p>Carolina sphinx (<i>Manduca sexta</i>) uses a smooth flight loop through the spectral field. Its UV, blue, and green receptor channels remain separate, while the camera moves continuously around their contribution layers. The motion can be paused and automatically stops when reduced motion is requested.</p></div>
    <div className="alan-sphinx-diagram" aria-label="Carolina sphinx receptor peaks and camera behavior"><div><span>UV</span><strong>357 nm</strong></div><i>→</i><div><span>BLUE</span><strong>450 nm</strong></div><i>→</i><div><span>GREEN</span><strong>520 nm</strong></div><i>↻</i><div className="alan-flight"><span>CAMERA</span><strong>Smooth flight loop</strong></div></div>
  </section>

  <section className="alan-boundaries alan-rule">
    <div className="alan-section-head"><span>03 / EVIDENCE BOUNDARY</span><h2>The visualization states where measurement ends.</h2><p>Scientific and interpretive views share a visual language, but they do not make the same claim. The interface keeps that distinction readable at every stage.</p></div>
    <div className="alan-boundary-grid">{boundaries.map(([title,copy],index)=><article key={title}><span>{String(index+1).padStart(2,"0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
  </section>

  <section className="alan-next"><a href="/work">Back to selected work ↗</a><a href="/work/biochar-metabolism">Next project — Biochar Metabolism →</a></section>
  <footer><span>LINDA DENG</span><span>ALAN / ARTIFICIAL LIGHT AT NIGHT</span><span>2026</span></footer>
</main>}
