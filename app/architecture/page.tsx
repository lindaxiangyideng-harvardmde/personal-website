import type { Metadata } from "next";
import { categories } from "../work/catalog";
import { FeaturedCard, GridCard } from "../work/IndexCards";
import { SiteNav } from "../SiteNav";

export const metadata: Metadata = {
  title: "Architecture & Spatial Work — Linda Deng",
  description: "Architecture, material, and ecological research projects by Linda Deng, 2020–2025.",
};

/** How many architecture projects get the large alternating cover before the compact grid. */
const FEATURED_COUNT = 4;

export default function ArchitectureIndex() {
  const featured = categories.architecture.slugs.slice(0, FEATURED_COUNT);
  const further = categories.architecture.slugs.slice(FEATURED_COUNT);
  return <main className="work-index-page">
    <header className="index-header">
      <a className="home-mark" href="/">LINDA DENG</a>
      <p>Architecture &amp; Spatial Work / 2020–2025</p>
      <SiteNav current="architecture" />
    </header>

    <section className="index-intro">
      <span>02 / ARCHITECTURE &amp; SPATIAL WORK</span>
      <h1>Selected<br /><i>spatial systems.</i></h1>
      <p>Architecture and material research where mapping, modeling, and prototyping translate ecological and urban conditions into spatial propositions.</p>
    </section>

    <section className="project-index" aria-label="Architecture and spatial projects">
      {featured.map(slug => <FeaturedCard slug={slug} key={slug} />)}
    </section>

    <section className="additional-work" aria-labelledby="additional-work-title">
      <header className="additional-work-head">
        <span>FURTHER STUDIES</span>
        <div><h2 id="additional-work-title">Further studies.</h2><p>A quieter index of spatial studies and adaptable systems.</p></div>
      </header>
      <div className="additional-work-grid">
        {further.map(slug => <GridCard slug={slug} key={slug} />)}
      </div>
    </section>

    <section className="additional-work category-crosslink" aria-labelledby="product-link-title">
      <header className="additional-work-head">
        <span>01 / {categories.product.label.toUpperCase()}</span>
        <div>
          <h2 id="product-link-title">Product work.</h2>
          <p>Data products and interactive research tools.</p>
          <a href={categories.product.href}>View product design ↗</a>
        </div>
      </header>
    </section>

    <footer><span>LINDA DENG</span><span>ARCHITECTURE &amp; SPATIAL WORK</span><span>NEW YORK · 2026</span></footer>
  </main>;
}
