const asset=(name:string)=>`/portfolio/conflict/${name}`;

function Figure({src,alt,caption,className=""}:{src:string;alt:string;caption:string;className?:string}){
  return <figure className={`conflict-figure ${className}`}><img src={src} alt={alt} loading="lazy"/><figcaption>{caption}</figcaption></figure>;
}

export default function ConflictLightDarkProject(){return <main className="conflict-page">
  <header className="conflict-header"><a className="mark" href="/">LINDA DENG</a><nav><a href="/work">← Index</a><a href="/about">About</a></nav></header>

  <section className="conflict-title">
    <div className="conflict-kicker"><span>06 / 2023</span><span>Architecture / Material</span></div>
    <div className="conflict-title-copy"><h1>Conflict in<br/><i>Light &amp; Dark</i></h1><p>An Underground Museum film institution shaped through contrasts between concrete and glass, mass and incision, darkness and projected light.</p></div>
    <dl className="conflict-facts"><div><dt>Type</dt><dd>Individual architecture studio</dd></div><div><dt>Site</dt><dd>Leimert Park, Los Angeles</dd></div><div><dt>Studio</dt><dd>Columbia GSAPP · Yo-Ichiro Hakomori</dd></div></dl>
  </section>

  <section className="conflict-hero" aria-label="Day and night exterior views"><Figure src={asset("day.webp")} alt="Daytime exterior view of the Underground Museum film institution" caption="Day — a dense concrete body reads as a continuous urban mass."/><Figure src={asset("night.webp")} alt="Nighttime exterior view of the Underground Museum film institution" caption="Night — interior light turns the facade into a soft, inhabited screen."/></section>

  <section className="conflict-intro conflict-rule"><span>DESIGN PREMISE</span><h2>Contrast becomes the building’s spatial language.</h2><p>Photography associated with the Underground Museum uses light and shade to make histories, identities, and tensions visible. The film institution translates that visual language into architecture. Concrete produces dark, weighty rooms; glass creates bright passages and long views. Instead of resolving these materials into a neutral whole, the project lets their differences remain legible.</p></section>

  <section className="conflict-site conflict-rule"><div className="conflict-section-head"><span>01 / SITE + INSTITUTION</span><h2>A compact cultural building opens toward a public landscape.</h2><p>The proposal sits in Leimert Park beside a garden of planted rooms, paths, and water. Its dense vertical form concentrates classrooms, theaters, studios, archives, workshops, and exhibition space while the ground floor extends into the landscape as an informal civic threshold.</p></div><Figure src={asset("site-axon.webp")} alt="Site axonometric view of the film institution and adjacent public landscape" caption="Site axonometric — a compact institution anchors a looser field of gardens, paths, and gathering spaces."/></section>

  <section className="conflict-concept conflict-rule"><div className="conflict-section-head"><span>02 / SOLID + VOID</span><h2>Glass passages cut through a carved concrete volume.</h2><p>The design begins with a solid block. Transparent boxes are inserted through it, then the concrete floor plates are carved into curved shells and linked by exposed circulation. The straight glass tunnels act as precise incisions through an irregular mass, framing views across the building and back toward the city.</p></div><Figure src={asset("concept.webp")} alt="Four-step massing concept from solid concrete block to carved volume with glass insertions" caption="Massing sequence — extrude, insert, carve, and connect."/></section>

  <section className="conflict-sections conflict-rule"><div className="conflict-section-head"><span>03 / A VERTICAL SEQUENCE</span><h2>Each floor negotiates enclosure and exposure differently.</h2><p>The repeated building cuts show how opaque rooms, transparent corridors, external stairs, patios, and roof gardens alternate through the section. Circulation is not hidden in a central core; it repeatedly crosses the facade and becomes part of the institution’s public image.</p></div><Figure src={asset("section-sequence.webp")} alt="Sequential sectional cuts through the film institution" caption="Section sequence — program, circulation, terraces, and planted ground shift across the building’s depth."/></section>

  <section className="conflict-drawings conflict-rule"><div className="conflict-section-head"><span>04 / PLAN + ELEVATION</span><h2>Dark rooms gather around a luminous route.</h2><p>The ground plan positions the brighter circulation strip between darker program zones and the adjacent garden. The elevations register the same relationship externally: curved concrete bands establish continuity while glass projections, stairs, and planted terraces interrupt the mass.</p></div><div className="conflict-drawing-grid"><Figure src={asset("ground-plan.webp")} alt="Ground floor plan and adjacent site plan" caption="Ground floor — classrooms, film spaces, lobby, and support rooms meet the garden edge."/><Figure src={asset("elevations.webp")} alt="Southwest and southeast elevations" caption="Elevations — horizontal concrete bands are crossed by transparent circulation and exterior stairs."/></div></section>

  <section className="conflict-inhabitation conflict-rule"><div className="conflict-section-head"><span>05 / INHABITING THE CONTRAST</span><h2>Movement animates the material boundary.</h2><p>Light-transmitting concrete softens daylight inside the dark rooms. After sunset, artificial light and moving silhouettes register on the exterior surface, extending the institution’s film culture into the street. The architecture becomes both container and projection surface.</p></div><Figure src={asset("building-section.webp")} alt="Exploded vertical section showing programs, circulation, glass rooms, and public landscape" caption="Vertical building section — programs and routes accumulate between heavy enclosure, transparent rooms, exterior circulation, and the public ground."/></section>

  <section className="conflict-reflection conflict-rule"><span>DESIGN POSITION</span><h2>The project does not erase conflict; it gives conflict form.</h2><p>Its central proposition is experiential rather than technological: material, geometry, and changing light allow the building to read differently across movement and time.</p></section>

  <section className="conflict-next"><a href="/work">Back to selected work ↗</a><a href="/work/lens-on-the-move">Next project — Lens on the Move →</a></section>
  <footer><span>LINDA DENG</span><span>CONFLICT IN LIGHT AND DARK</span><span>2023</span></footer>
</main>}
