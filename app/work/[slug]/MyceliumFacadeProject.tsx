import {ProjectHeader, ProjectNext, ProjectNumber} from "../ProjectChrome";
const asset=(name:string)=>`/portfolio/mycelium/${name}`;

function Figure({src,alt,caption,className=""}:{src:string;alt:string;caption:string;className?:string}){
  return <figure className={`mycelium-figure ${className}`}><img src={src} alt={alt} loading="lazy"/><figcaption>{caption}</figcaption></figure>;
}

const assembly=[
  ["assembly-01-grid.webp","01 / Bone","A reusable bioplastic grid establishes the structural armature."],
  ["assembly-02-net.webp","02 / Net","Woven bamboo creates a porous surface around the frame."],
  ["assembly-03-substrate.webp","03 / Feed","Agricultural waste and mycelium fill the woven scaffold."],
  ["assembly-04-growth.webp","04 / Grow","The living composite expands across the porous enclosure."],
  ["assembly-05-return.webp","05 / Return","Decayed matter drops into a collection tank and returns as fertilizer."],
] as const;

const seasons=[
  ["season-winter.webp","Winter","The bamboo framework is exposed and the previous cycle is collected."],
  ["season-spring.webp","Spring","Inoculated substrate begins to colonize the woven surface."],
  ["season-summer.webp","Summer","Mycelial growth reaches its fullest and lightest state."],
  ["season-autumn.webp","Autumn","Drying and decay reveal the structure before material returns to the ground."],
] as const;

const city=[
  ["city-2020.webp","2020","Parking structures remain static markers of an automobile-centered city."],
  ["city-2024.webp","2024","The first living façade becomes a visible material experiment."],
  ["city-2030.webp","2030","New prototypes appear as the system adapts to other structures."],
  ["city-2035.webp","2035","The façade language spreads through a network of urban hosts."],
  ["city-2050.webp","2050","Seasonal material change becomes legible at the scale of the skyline."],
  ["city-future.webp","Future","The speculative city is read as a field of renewable, time-based surfaces."],
] as const;

export default function MyceliumFacadeProject(){return <main className="mycelium-page">
  <ProjectHeader slug="mycelium-living-facade" className="mycelium-header"/>

  <section className="mycelium-title">
    <div className="mycelium-kicker"><ProjectNumber slug="mycelium-living-facade"/><span>Architecture / Material / Ecology</span></div>
    <div className="mycelium-title-copy"><h1>Mycelium<br/><i>Living Facade</i></h1><p>A time-based façade system in which agricultural waste, woven structure, fungal growth, seasonal decay, and on-site collection form one visible material cycle.</p></div>
    <dl className="mycelium-facts"><div><dt>Type</dt><dd>Collaborative material research and façade proposal</dd></div><div><dt>Site</dt><dd>Los Angeles parking structure</dd></div><div><dt>Focus</dt><dd>Living materials · seasonal change · regenerative assembly</dd></div></dl>
  </section>

  <Figure src={asset("hero-facade.webp")} alt="Street view of the living mycelium facade applied to a parking structure" caption="01 — A parking structure becomes the host for a façade that grows, changes, and decays through the year." className="mycelium-hero"/>

  <section className="mycelium-intro mycelium-rule"><span>RESEARCH QUESTION</span><h2>Can a façade be designed as a living material cycle rather than a permanent surface?</h2><p>The project treats architectural duration as a design material. Parking structures occupy large areas of Los Angeles yet often meet the street as exposed, repetitive frames. Instead of masking that condition with a fixed cladding system, the proposal introduces a living façade whose appearance changes as mycelium grows through agricultural substrate, matures, dries, and returns to the landscape. The façade is both an environmental experiment and a public signal: a deliberately visible prototype for an architecture that acknowledges growth, maintenance, death, and renewal.</p></section>

  <section className="mycelium-host mycelium-rule"><div className="mycelium-section-head"><span>01 / THE HOST STRUCTURE</span><h2>A static parking frame becomes an armature for biological time.</h2><p>The existing structure is retained as the durable host. A secondary system attaches to its perimeter, creating deep openings, shaded thresholds, and a continuous surface for living material. The proposal does not attempt to make the entire building biological. It separates long-life support from short-life matter, allowing the façade to be renewed without replacing the parking structure behind it.</p></div><Figure src={asset("cycle-axon.webp")} alt="Axonometric diagram of the parking structure and living facade cycle" caption="Building cycle — roof vegetation supplies biomass; façade material grows and decays; collected matter returns to the planted landscape."/></section>

  <section className="mycelium-assembly mycelium-rule"><div className="mycelium-section-head"><span>02 / COMPOSITE ASSEMBLY</span><h2>The façade is an ecology of frame, fiber, food, and fungi.</h2><p>Mycelium is a branching network of fungal hyphae that absorbs nutrients from its environment. In the proposed assembly, agricultural waste supplies the substrate; a woven bamboo net holds that matter in place; and a reusable grid provides the structural “bone.” The research therefore treats mycelium not as an isolated finish but as one participant in a composite system whose porosity regulates growth and whose parts operate at different time scales.</p></div><div className="mycelium-step-grid">{assembly.map(([src,title,caption])=><Figure key={src} src={asset(src)} alt={`${title} stage of the mycelium facade assembly`} caption={`${title} — ${caption}`}/>)}</div></section>

  <section className="mycelium-seasons mycelium-rule"><div className="mycelium-section-head"><span>03 / A SEASONAL CLOCK</span><h2>Change is the façade’s primary visual language.</h2><p>Most architectural applications stabilize mycelium at a single stage. This proposal instead makes metabolism visible. Uneven air, moisture, and nutrient distribution create different rates of colonization across the bamboo surface. The façade moves from an exposed woven frame to dense pale growth, then dries and breaks apart. Maintenance becomes a recurring seasonal event rather than evidence that the architecture has failed.</p></div><div className="mycelium-season-grid">{seasons.map(([src,title,caption])=><Figure key={src} src={asset(src)} alt={`${title} stage of the living mycelium facade`} caption={`${title} — ${caption}`}/>)}</div></section>

  <section className="mycelium-section mycelium-rule"><div className="mycelium-section-head"><span>04 / FEED, GROW, COLLECT</span><h2>A vertical route closes the material loop.</h2><p>Dead vegetation is gathered from the planted roof and introduced as feedstock. Within the façade, bamboo tubes and porous cells distribute material while allowing controlled exposure to air. As the mycelium dries, fragments fall through the assembly into an underground collection tank. The spent material can then support new vegetation, linking roof, façade, street edge, and soil in one recurring sequence.</p></div><Figure src={asset("section-system.webp")} alt="Section perspective through the mycelium facade and parking structure" caption="Section perspective — a deep secondary skin connects rooftop biomass, seasonal façade growth, and below-grade collection."/></section>

  <section className="mycelium-city mycelium-rule"><div className="mycelium-section-head"><span>05 / FROM PROTOTYPE TO CITY IMAGE</span><h2>The project operates as demonstration as much as enclosure.</h2><p>The first façade is conceived as an urban-scale communication device: its obvious material change makes an unfamiliar construction process publicly legible. The city sequence speculates on repetition rather than identical replication. Each host can generate a different geometry through its supporting grid and bamboo weave, while sharing the same logic of local feedstock, seasonal growth, collection, and return.</p></div><div className="mycelium-city-grid">{city.map(([src,title,caption])=><Figure key={src} src={asset(src)} alt={`Speculative urban propagation of living facades in ${title}`} caption={`${title} — ${caption}`}/>)}</div></section>

  <section className="mycelium-reflection mycelium-rule"><span>REFLECTION</span><h2>Designing with a material that refuses to remain finished.</h2><div><p>The project’s contribution is temporal: it separates the permanent host from a renewable surface and treats decay as information. The façade makes biological change visible at the scale of public architecture.</p><p>It remains a speculative prototype. Growth uniformity, fire and moisture performance, attachment, maintenance labor, safe collection, and full life-cycle carbon accounting require physical testing before the system could operate at building scale.</p></div></section>

  <ProjectNext slug="mycelium-living-facade" className="mycelium-next"/>
  <footer><span>LINDA DENG</span><span>MYCELIUM LIVING FACADE</span><span>2025</span></footer>
</main>}
