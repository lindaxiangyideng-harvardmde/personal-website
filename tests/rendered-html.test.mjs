import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the one-screen research landscape entrance", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Linda Deng — Design \/ Research \/ Technology/i);
  assert.match(html, /class="home-shell"/);
  assert.match(html, /Systems become/);
  assert.match(html, /spatial propositions/);
  assert.match(html, /href="\/work"/);
  assert.doesNotMatch(html, /id="work"/);
});

test("serves the work index, about page, and all nine project routes", async () => {
  const routes = [
    ["/work", /Selected[\s\S]*research systems/],
    ["/about", /Designing relationships/],
    ["/work/biochar-metabolism", /Biochar Metabolism/],
    ["/work/proxy-landscape", /The Proxy Landscape/],
    ["/work/museum-reorganization", /Museum Reorganization/],
    ["/work/mycelium-living-facade", /Mycelium Living Facade/],
    ["/work/conflict-light-dark", /Conflict in Light and Dark/],
    ["/work/lens-on-the-move", /Lens on the Move/],
    ["/work/future-truck-stop", /Intertwined Energy and Human Activities/],
    ["/work/hope-in-gap", /Hope in Gap/],
    ["/work/maas-profit-analyzer", /MaaS Ecosystem Profit Analyzer/],
  ];
  for (const [path, expected] of routes) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), expected);
  }
});

test("renders Biochar as a complete research narrative", async () => {
  const response = await render("/work/biochar-metabolism");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="biochar-page"/);
  assert.match(html, /From waste to biochar/i);
  assert.match(html, /Building metabolism/i);
  assert.match(html, /From building to community/i);
  assert.match(html, /Context \/ waste flows/i);
  assert.match(html, /Architectural drawings/i);
  assert.match(html, /\/portfolio\/biochar\/renovation\.gif/);
  assert.match(html, /\/portfolio\/biochar\/community-system\.jpg/);
  assert.match(html, /\/portfolio\/biochar\/plan-basement\.jpg/);
  assert.doesNotMatch(html, /Prototype wall/i);
});

test("renders Proxy Landscape as a complete watershed research narrative", async () => {
  const response = await render("/work/proxy-landscape");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="proxy-page"/);
  assert.match(html, /Two watersheds/i);
  assert.match(html, /Hybrid watershed machines/i);
  assert.match(html, /Connected restorative landscape/i);
  assert.match(html, /\/portfolio\/proxy\/machine-purifier\.jpg/);
  assert.match(html, /\/portfolio\/proxy\/hero-map-spontaneous-clear\.webp/);
  assert.match(html, /\/portfolio\/proxy\/hero-map-unspontaneous-clear\.webp/);
  assert.match(html, /\/portfolio\/proxy\/watershed-spontaneous-sinks-clear\.webp/);
  assert.match(html, /\/portfolio\/proxy\/outcome-west-pond-clear\.webp/);
  assert.match(html, /\/portfolio\/proxy\/closing-attenuator\.webp/);
});

test("renders Museum Reorganization as a complete computational narrative", async () => {
  const response = await render("/work/museum-reorganization");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="museum-page"/);
  assert.match(html, /Generating the plan/i);
  assert.match(html, /Routes without prescription/i);
  assert.match(html, /Measuring experience/i);
  assert.match(html, /Comparing alternatives/i);
  assert.match(html, /\/portfolio\/museum\/film\.mp4/);
  assert.match(html, /\/portfolio\/museum\/layout-optimization\.webp/);
  assert.match(html, /\/portfolio\/museum\/routes-by-entrance\.webp/);
  assert.match(html, /\/portfolio\/museum\/comparison-table\.webp/);
  assert.ok(html.indexOf("/portfolio/museum/film.mp4") < html.indexOf("RESEARCH QUESTION"));
});

test("renders Mycelium Living Facade as a complete time-based material narrative", async () => {
  const response = await render("/work/mycelium-living-facade");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="mycelium-page"/);
  assert.match(html, /Composite assembly/i);
  assert.match(html, /A seasonal clock/i);
  assert.match(html, /From prototype to city image/i);
  assert.match(html, /\/portfolio\/mycelium\/hero-facade\.webp/);
  assert.match(html, /\/portfolio\/mycelium\/assembly-05-return\.webp/);
  assert.match(html, /\/portfolio\/mycelium\/season-autumn\.webp/);
  assert.match(html, /\/portfolio\/mycelium\/city-future\.webp/);
});

test("renders Conflict in Light and Dark as a complete design narrative", async () => {
  const response = await render("/work/conflict-light-dark");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="conflict-page"/);
  assert.match(html, /Solid \+ void/i);
  assert.match(html, /A vertical sequence/i);
  assert.match(html, /Plan \+ elevation/i);
  assert.match(html, /\/portfolio\/conflict\/day\.webp/);
  assert.match(html, /\/portfolio\/conflict\/night\.webp/);
  assert.match(html, /\/portfolio\/conflict\/concept\.webp/);
  assert.match(html, /\/portfolio\/conflict\/building-section\.webp/);
});

test("renders Lens on the Move as a complete adaptable-dwelling narrative", async () => {
  const response = await render("/work/lens-on-the-move");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="lens-page"/);
  assert.match(html, /Four modes/i);
  assert.match(html, /Adaptive envelope/i);
  assert.match(html, /Spatial assembly/i);
  assert.match(html, /Interior lens/i);
  assert.match(html, /Changing ground/i);
  for (const image of [
    "forest-hero", "four-modes", "canopy-system", "technical-system",
    "exploded-assembly", "plan-section", "interior-01", "interior-02",
    "interior-03", "interior-04", "urban-mode", "campus-dusk", "campus-night",
  ]) assert.match(html, new RegExp(`/portfolio/lens/${image}\\.webp`));
  assert.ok(html.indexOf("02 / SPATIAL ASSEMBLY") < html.indexOf("03 / ADAPTIVE ENVELOPE"));
  assert.ok(html.indexOf("technical-system.webp") < html.indexOf("03 / ADAPTIVE ENVELOPE"));
  assert.doesNotMatch(html, /exploded dia2/i);
});

test("renders Intertwined Energy and Human Activities as a complete design narrative", async () => {
  const response = await render("/work/future-truck-stop");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="truck-page"/);
  assert.match(html, /From stop to field/i);
  assert.match(html, /Energy framework/i);
  assert.match(html, /Four modules/i);
  assert.match(html, /Inhabited infrastructure/i);
  assert.match(html, /Phased ground/i);
  for (const asset of [
    "hero.webp", "site-growth.mp4", "expansion.gif", "system-exploded.webp",
    "panel-assembly.mp4", "module-01.gif", "module-02.mp4", "module-03.mp4",
    "module-04.mp4", "phase-01.webp", "phase-02.webp", "phase-03.webp",
  ]) assert.match(html, new RegExp(`/portfolio/truck-stop/${asset.replace(".", "\\.")}`));
  assert.ok(html.indexOf("site-growth.mp4") < html.indexOf("DESIGN PREMISE"));
  assert.doesNotMatch(html, /module-0[1-4]-exploded\.webp/);
});

test("renders Hope in Gap as a complete supportive-housing narrative", async () => {
  const response = await render("/work/hope-in-gap");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="gap-page"/);
  assert.match(html, /A distributed site/i);
  assert.match(html, /Prefabricated kit/i);
  assert.match(html, /Layered porosity/i);
  assert.match(html, /The narrow slab/i);
  for (const image of [
    "hero", "figure-ground", "urban-oblique", "site-collage", "unit-family",
    "unit-arrangements", "porosity-system", "unit-types", "serial-sections",
  ]) assert.match(html, new RegExp(`/portfolio/hope/${image}\\.webp`));
});

test("renders MaaS Ecosystem Profit Analyzer as a complete data-product narrative", async () => {
  const response = await render("/work/maas-profit-analyzer");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="maas-page"/);
  assert.match(html, /Auditable workflow/i);
  assert.match(html, /Calculation engine/i);
  assert.match(html, /Decision surface/i);
  assert.match(html, /System architecture/i);
  assert.match(html, /Reliability by design/i);
  for (const image of ["dashboard-top", "imports", "pricing", "incentives", "analysis", "dashboard-suppliers", "dashboard-charts", "dashboard-quality"]) {
    assert.match(html, new RegExp(`/portfolio/maas/${image}\\.png`));
  }
});
