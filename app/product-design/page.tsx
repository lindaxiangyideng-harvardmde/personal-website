import type { Metadata } from "next";
import { categories } from "../work/catalog";
import { FeaturedCard } from "../work/IndexCards";
import { SiteNav } from "../SiteNav";

export const metadata: Metadata = {
  title: "Product Design — Linda Deng",
  description: "Product design case studies in data products, analytics workflows, and interactive research tools.",
};

export default function ProductDesignIndex() {
  return <main className="work-index-page">
    <header className="index-header">
      <a className="home-mark" href="/">LINDA DENG</a>
      <p>Product Design / 2026</p>
      <SiteNav current="product" />
    </header>

    <section className="index-intro">
      <span>01 / PRODUCT DESIGN</span>
      <h1>Product<br /><i>design work.</i></h1>
      <p>Data products and interactive tools that turn complex, uncertain information into decisions people can trace and trust.</p>
    </section>

    <section className="project-index" aria-label="Product design projects">
      {categories.product.slugs.map(slug => <FeaturedCard slug={slug} key={slug} />)}
    </section>

    <section className="additional-work category-crosslink" aria-labelledby="architecture-link-title">
      <header className="additional-work-head">
        <span>02 / {categories.architecture.label.toUpperCase()}</span>
        <div>
          <h2 id="architecture-link-title">Spatial work.</h2>
          <p>Architecture, material, and ecological research projects from 2020–2025.</p>
          <a href={categories.architecture.href}>View {categories.architecture.slugs.length} spatial projects ↗</a>
        </div>
      </header>
    </section>

    <footer><span>LINDA DENG</span><span>PRODUCT DESIGN</span><span>NEW YORK · 2026</span></footer>
  </main>;
}
