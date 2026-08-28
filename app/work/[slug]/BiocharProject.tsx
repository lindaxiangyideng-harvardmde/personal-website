const asset = (name: string) => `/portfolio/biochar/${name}`;

function Figure({src, alt, caption, className = ""}: {src:string; alt:string; caption:string; className?:string}) {
  return <figure className={`biochar-figure ${className}`}>
    <img src={src} alt={alt} loading="lazy" />
    <figcaption>{caption}</figcaption>
  </figure>;
}

export default function BiocharProject() {
  return <main className="biochar-page">
    <header className="biochar-header"><a className="mark" href="/">LINDA DENG</a><nav><a href="/work">← Index</a><a href="/about">About</a></nav></header>

    <section className="biochar-title">
      <div className="biochar-kicker"><span>01 / 2022</span><span>Architecture / Material / Ecology</span></div>
      <div className="biochar-title-copy">
        <h1>Biochar<br/><i>Metabolism</i></h1>
        <p>A closed-loop infrastructure that converts municipal biomass waste into carbon-storing building products, allowing an existing building to participate in its own repair.</p>
      </div>
      <dl className="biochar-facts"><div><dt>Type</dt><dd>Collaborative studio project</dd></div><div><dt>Institution</dt><dd>Columbia GSAPP</dd></div><div><dt>Focus</dt><dd>Adaptive reuse · material cycles · urban infrastructure</dd></div></dl>
    </section>

    <Figure src={asset("community-system.jpg")} alt="Community-scale biochar collection and production network" caption="01 — A distributed metabolism connects buildings, collection routes, production, and shared landscapes." className="biochar-hero" />

    <section className="biochar-intro biochar-rule">
      <span>RESEARCH QUESTION</span>
      <h2>Can urban waste become the material of architectural repair?</h2>
      <p>Modern cities separate two related problems. Organic material leaves the city as waste, while construction continually demands new products and produces new emissions. Biochar Metabolism brings these conditions into one architectural system. Biomass is collected locally, transformed through pyrolysis, and returned as a carbon-storing additive for plaster, concrete, insulation, and printed components. Rather than proposing demolition and replacement, the project asks how an existing building could collect, process, distribute, and reuse material over time.</p>
    </section>

    <section className="biochar-context biochar-rule">
      <div className="biochar-section-head"><span>CONTEXT / WASTE FLOWS</span><h2>The material problem begins beyond the building.</h2><p>The project’s research maps municipal waste as a spatial and logistical system: what enters the waste stream, where it is processed, and how far material travels after leaving New York City. These graphics preserve the data used during the studio investigation; they establish the project’s original research context rather than representing live statistics.</p></div>
      <Figure src={asset("world-waste-map.jpg")} alt="Global map of municipal solid waste and transportation emissions" caption="Global waste context — comparative municipal solid-waste generation and the transportation distance embedded in disposal." className="biochar-context-wide" />
      <div className="biochar-context-grid">
        <Figure src={asset("waste-statistics.jpg")} alt="Charts showing the composition and destination of municipal solid waste" caption="Waste profile — material categories and treatment destinations used in the project research." />
        <Figure src={asset("nyc-waste-map.jpg")} alt="Map of New York City waste transportation routes" caption="New York waste geography — exported material, transfer infrastructure, and long-distance routes." />
      </div>
    </section>

    <section className="biochar-chapter biochar-rule">
      <div className="biochar-chapter-copy"><span>01 / THE CARBON LOOP</span><h2>Waste is not an endpoint.</h2><p>In a conventional cycle, plants absorb carbon and release it again through decomposition or combustion. Pyrolysis interrupts that return. By heating biomass with limited oxygen, the process produces energy carriers alongside a stable, carbon-rich solid: biochar. The project translates this temporal carbon loop into a spatial proposition, connecting municipal waste streams to building maintenance.</p></div>
      <Figure src={asset("carbon-cycle.jpg")} alt="Life-cycle comparison of the existing building and proposed biochar system" caption="Project life-cycle framework — municipal waste, localized pyrolysis, operational carbon, and biochar products are read as one architectural system." />
    </section>

    <section className="biochar-full biochar-rule">
      <div className="biochar-section-head"><span>02 / FROM WASTE TO BIOCHAR</span><h2>A sequence of collection, transformation, and return.</h2><p>Yard waste, food waste, paper, and wood are separated, dried, and ground before entering the pyrolysis process. Gas and bio-oil can support the energy demand of production; the remaining biochar becomes the feedstock for a new family of construction materials. The diagram establishes the project’s core chain: collect → sort → transform → manufacture → repair → recirculate.</p></div>
      <Figure src={asset("pyrolysis-process.jpg")} alt="Biochar production and material process diagram" caption="Material process — urban biomass enters a localized pyrolysis and production loop." />
    </section>

    <section className="biochar-material biochar-rule">
      <div className="biochar-section-head"><span>03 / MATERIAL EVIDENCE</span><h2>One feedstock, multiple architectural roles.</h2><p>Biochar is tested not as a singular finish but as an additive across different assemblies. Its porosity and carbon content allow it to enter plaster, concrete, insulation, and composite products. Early samples and prototypes compare texture, density, fabrication, and possible placement within a wall. The research moves deliberately from loose matter to components, then from components to a repeatable construction system.</p></div>
      <div className="biochar-material-grid">
        <Figure src={asset("material-samples.jpg")} alt="Biochar material samples" caption="Material samples — variations in grain, binder, density, and finish." />
        <Figure src={asset("product-system.jpg")} alt="Mapping of waste inputs, biochar qualities, and building applications" caption="Material allocation — waste inputs are translated into commercial, residential, and communal building products." />
      </div>
    </section>

    <section className="biochar-full biochar-rule">
      <div className="biochar-section-head"><span>04 / BUILDING METABOLISM</span><h2>Renovation becomes a continuous process.</h2><p>The proposal works with a generic open-floor structural frame so that new infrastructure can be inserted without disturbing the primary system. A branching network of chutes occupies the space between slabs: waste moves downward to the basement factory, while finished products return upward to repair interiors, façades, and shared spaces. The architecture behaves less like a finished object and more like a body that is fed, maintained, and renewed.</p></div>
      <Figure src={asset("renovation.gif")} alt="Animated sequence of the building renovation process" caption="Renovation sequence — the existing frame receives a new material-processing circulation system." className="biochar-motion-figure" />
      <div className="biochar-system-grid">
        <Figure src={asset("building-system.jpg")} alt="Biochar building system diagram" caption="Building system — collection and production are integrated vertically." />
        <Figure src={asset("repair-system.jpg")} alt="Before and after biochar repair diagram" caption="Repair system — products return to the building at several scales." />
      </div>
    </section>

    <section className="biochar-inhabit biochar-rule">
      <div className="biochar-section-head"><span>05 / INHABITING THE SYSTEM</span><h2>Infrastructure becomes visible, spatial, and social.</h2><p>The basement accommodates sorting, storage, and production; upper levels combine commercial, work, and residential programs. Instead of hiding the material route in a service core, the project lets its branches organize thresholds, enclosures, and moments of encounter. Occupants can read how waste is collected and how products re-enter daily space. The system is therefore both functional infrastructure and a public account of material transformation.</p></div>
      <div className="biochar-inhabit-grid">
        <Figure src={asset("factory.jpg")} alt="Interior of the basement biochar factory" caption="Production floor — sorting and fabrication occupy the building’s base." />
        <Figure src={asset("inhabitation.gif")} alt="Animated sequence in which a branching chute transforms an empty floor into occupied space" caption="Inhabitation sequence — infrastructure arrives first, then furniture, work, and collective occupation grow around it." className="biochar-motion-figure" />
      </div>
    </section>

    <section className="biochar-full biochar-rule">
      <div className="biochar-section-head"><span>06 / FROM BUILDING TO COMMUNITY</span><h2>A distributed metabolism.</h2><p>At the neighborhood scale, the vertical building system extends into horizontal collection routes and elevated gardens. Inspired by the reuse of infrastructural corridors, these branches link waste sources, productive landscapes, and sites of repair. The proposal does not claim a finished citywide solution; it offers a framework in which multiple buildings can become connected nodes, sharing material, energy, knowledge, and public space.</p></div>
      <Figure src={asset("hero.jpg")} alt="Axonometric view of the renovated Biochar Metabolism building" caption="Building node — the existing frame is retained while collection, fabrication, repair, and occupation accumulate inside it." />
      <Figure src={asset("public-space.jpg")} alt="Public space within the community biochar system" caption="Public landscape — productive infrastructure also creates space for collective life." className="biochar-conclusion-image" />
    </section>

    <section className="biochar-drawings biochar-rule">
      <div className="biochar-section-head"><span>07 / ARCHITECTURAL DRAWINGS</span><h2>Program organized around the material route.</h2><p>The floor plans show how the system changes as it moves upward: production and sorting occupy the basement; collection and public circulation appear at ground level; communal, work, and residential floors organize themselves around the branching chutes.</p></div>
      <div className="biochar-drawings-grid">
        <Figure src={asset("plan-basement.jpg")} alt="Basement biochar factory floor plan" caption="B1 — Basement factory / sorting, storage, pyrolysis, and fabrication." />
        <Figure src={asset("plan-ground.jpg")} alt="Ground floor plan" caption="00 — Ground floor / collection, commercial program, and public access." />
        <Figure src={asset("plan-public.jpg")} alt="Public-space floor plan" caption="01 — Public floor / shared landscape and communal circulation." />
        <Figure src={asset("plan-work.jpg")} alt="Workspace floor plan" caption="02 — Work floor / flexible offices organized around material branches." />
        <Figure src={asset("plan-residential.jpg")} alt="Residential floor plan" caption="03 — Residential floor / living units and shared internal landscape." />
      </div>
    </section>

    <section className="biochar-reflection biochar-rule">
      <span>REFLECTION</span><h2>From a one-time intervention to an ongoing metabolism.</h2>
      <div><p>The project’s central contribution is a change in architectural time. Repair is no longer an isolated event performed with materials imported from elsewhere; it becomes an observable cycle tied to local waste and continuous occupation.</p><p>This remains a speculative framework. Material performance, emissions, manufacturing tolerances, and the logistics of mass production require further testing. That uncertainty is part of the research: the design identifies where architectural ambition must meet material validation.</p></div>
    </section>

    <section className="biochar-next"><a href="/work">Back to selected work ↗</a><a href="/work/proxy-landscape">Next project — The Proxy Landscape →</a></section>
    <footer><span>LINDA DENG</span><span>BIOCHAR METABOLISM</span><span>2022</span></footer>
  </main>;
}
