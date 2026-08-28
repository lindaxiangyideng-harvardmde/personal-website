export const projects = {
  "biochar-metabolism": {
    number:"01", title:"Biochar Metabolism", year:"2025", tags:"Architecture / Material / Ecology", image:"/portfolio/biochar-system.jpg", secondImage:"/portfolio/biochar-architecture.jpg",
    lead:"A closed-loop infrastructure that converts municipal solid waste into carbon-storing building products—and lets an existing building participate in its own repair.",
    question:"Can urban waste become the material of architectural repair?",
    overview:"New York City exports and disposes of enormous quantities of municipal solid waste while construction remains one of the largest sources of greenhouse gas emissions. The project brings these two conditions into one system: biomass waste is collected locally, converted through pyrolysis, and returned as biochar additives for plaster, concrete, insulation, and 3D-printed elements.",
    stages:[["01","Collect","Biomass in municipal waste is separated from the urban stream."],["02","Transform","Pyrolysis produces energy while storing carbon in biochar."],["03","Materialize","Biochar becomes an additive across multiple building products."],["04","Repair","Products renew interiors, façades and shared infrastructure."],["05","Recirculate","Operational waste feeds a larger building and community metabolism."]],
    finding:"The branching trash-chute system is both infrastructure and symbol: like a plant’s vascular system, it feeds the building from within. At the urban scale it grows into a network of collection routes and sky gardens, shifting renovation from a one-time intervention toward an ongoing metabolism."
  },
  "proxy-landscape": {
    number:"02", title:"The Proxy Landscape", year:"2022", tags:"Architecture / Computation / Ecology", image:"/portfolio/proxy-map.jpg", secondImage:"/portfolio/proxy-fields.jpg",
    lead:"A study of water as a proxy for urban conditions, leading to six low-tech machines that interact with the changing salt-marsh landscape of Jamaica Bay.",
    question:"Can water reveal—and help repair—the hybrid urban landscape?",
    overview:"Water is separated into two systems according to the forces that move it: spontaneous flows driven by gravity and wind, and unspontaneous flows captured, pumped, blocked, and discharged by urban infrastructure. Mapping their intersections reveals where pollution, erosion, and sea-level rise accelerate salt-marsh degradation.",
    stages:[["01","Trace","Map spontaneous and infrastructure-driven watersheds."],["02","Intersect","Locate where flows, contamination and vulnerable marsh meet."],["03","Translate","Turn specific landscape pressures into machine mechanisms."],["04","Activate","Use water, wind and human bodies as low-tech power sources."],["05","Accumulate","Let six interventions work together as a restorative chain."]],
    finding:"The machines do not replace the landscape with infrastructure. They make landscape labor visible: filtering runoff, catching sediment, lifting marsh, mixing algae and attenuating waves. Together they stage a gradual journey from urban material to water, marsh, soil and shared habitat."
  },
  "museum-reorganization": {
    number:"03", title:"Museum Reorganization", year:"2023", tags:"Architecture / Computation", image:"/portfolio/museum-process.jpg", secondImage:"/portfolio/museum-analysis.jpg",
    lead:"A continuous computational workflow that reorganizes exhibition rooms, finds routes, and measures visual qualities while preserving the museum’s freedom of exploration.",
    question:"Can optimization preserve, rather than reduce, spatial freedom?",
    overview:"The Kanazawa Art Museum has a fixed circular boundary and an open plan, yet irregular galleries can make navigation difficult. The research treats layout, route, and view as related problems. A genetic algorithm generates room configurations with comparable areas, then route-finding and isovist analysis test their accessibility and spatial character.",
    stages:[["01","Constrain","Define boundary, room areas, courtyards and a first division."],["02","Generate","Subdivide nineteen blocks and optimize area tolerance to 2%."],["03","Connect","Generate door locations and all possible gallery paths."],["04","Navigate","Find four efficient routes without prescribing a single journey."],["05","Evaluate","Quantify visual openness and complexity through isovists."]],
    finding:"The result is not one optimum plan. It is a readable family of alternatives for curators and museum owners: layouts can be periodically reorganized while visitors retain multiple choices of movement, view and discovery."
  },
  "mycelium-living-facade": {
    number:"04", title:"Mycelium Living Facade", year:"2025", tags:"Architecture / Material / Ecology", image:"/portfolio/mycelium-facade.jpg", secondImage:"/portfolio/mycelium-research.jpg",
    lead:"A living facade that uses mycelium’s growth, maturity, and decay as an architectural clock—linking seasonal change, agricultural waste, and public life.",
    question:"Can a facade be designed as a living material cycle rather than a permanent surface?",
    overview:"The proposal begins with mycelium as both material and process. Agricultural by-products provide a substrate; branching fungal networks bind that matter into lightweight components; seasonal growth and decomposition then change the facade’s appearance and performance over time.",
    stages:[["01","Feed","Local agricultural waste becomes a nutrient-rich substrate."],["02","Grow","Mycelial networks bind loose matter into formed components."],["03","Mature","The facade reaches its densest spatial and environmental state."],["04","Weather","Use, climate, and seasonal cycles alter the living surface."],["05","Return","Spent material decomposes and re-enters a local nutrient cycle."]],
    finding:"Instead of hiding material change, the facade makes duration visible. Its value lies in an architecture that can grow, perform, weather, and return—allowing maintenance and decay to become part of the public narrative of the building."
  }
} as const;

export type ProjectSlug = keyof typeof projects;
