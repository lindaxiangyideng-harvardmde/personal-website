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

test("serves the work index, about page, and all eight project routes", async () => {
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
