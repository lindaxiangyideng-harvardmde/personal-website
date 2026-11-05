import { SiteNav } from "../SiteNav";

export default function AboutPage() {
  return <main className="about-page">
    <header className="index-header">
      <a className="home-mark" href="/">LINDA DENG</a>
      <p>Design / Research / Technology</p>
      <SiteNav current="about" />
    </header>
    <section className="about-hero">
      <span>02 / POSITION</span>
      <h1>Designing relationships,<br /><i>not isolated objects.</i></h1>
      <div className="about-copy">
        <p>Linda Deng is an architectural designer and researcher working across material systems, computation, and ecological processes.</p>
        <p>Her work uses mapping, modeling, prototyping, and spatial storytelling to translate complex conditions into clear design propositions.</p>
        <a href="mailto:linda_deng@mde.harvard.edu">Contact ↗</a>
      </div>
      <div className="about-fields"><span>Architecture</span><span>Material</span><span>Computation</span><span>Ecology</span></div>
    </section>
  </main>;
}
