const asset=(name:string)=>`/portfolio/maas/${name}`;

function Figure({src,alt,caption,className=""}:{src:string;alt:string;caption:string;className?:string}){
  return <figure className={`maas-figure ${className}`}><img src={src} alt={alt} loading={className.includes("maas-hero")?"eager":"lazy"}/><figcaption>{caption}</figcaption></figure>;
}

const decisions=[
  ["Staged imports","Bad workbook data never enters durable records before review."],
  ["Manual mapping fallback","Inconsistent source headers remain visible and correctable."],
  ["Immutable runs","Completed results stay reproducible after later input changes."],
  ["Month-contained weeks","Supplier incentives never leak across calendar months."],
  ["Unavailable margin","Missing or zero revenue is not misrepresented as 0%."],
  ["Dependency guards","The workflow returns users to the earliest incomplete input."],
];

export default function MaasProfitAnalyzerProject(){return <main className="maas-page">
  <header className="maas-header"><a className="mark" href="/">LINDA DENG</a><nav><a href="/work">← Index</a><a href="/about">About</a></nav></header>

  <section className="maas-title">
    <div className="maas-kicker"><span>09 / 2026</span><span>Data Product / Financial Analytics</span></div>
    <div className="maas-title-copy"><h1>MaaS Ecosystem<br/><i>Profit Analyzer</i></h1><p>An auditable analytics product that transforms monthly AI inference billing workbooks into supplier-level profit and margin insights.</p></div>
    <dl className="maas-facts"><div><dt>Role</dt><dd>Product design · data logic · full-stack development</dd></div><div><dt>Stack</dt><dd>Flask · SQLite · Jinja · JavaScript · Chart.js</dd></div><div><dt>Context</dt><dd>CS50 final project · completed local prototype</dd></div></dl>
  </section>

  <Figure src={asset("dashboard-top.png")} alt="MaaS Ecosystem Profit Analyzer dashboard with filters and profitability KPIs" caption="Decision surface — month, week-segment, and supplier filters connect directly to revenue, payment, profit, and margin." className="maas-hero"/>

  <section className="maas-intro maas-rule"><span>PRODUCT QUESTION</span><h2>Which supplier—and which week—actually generated profit or loss?</h2><p>Monthly AI inference billing arrives as multiple workbooks. Revenue, model-specific costs, exchange settings, supplier payments, and weekly incentives do not share one reliable analytical surface. The product turns those fragmented inputs into a traceable sequence so an analyst can inspect both the final answer and the evidence behind it.</p></section>

  <section className="maas-flow maas-rule" aria-label="Product workflow">
    <span className="maas-flow-label">INPUT → DECISION</span>
    <ol><li><span>01</span><strong>Billing workbooks</strong><small>Monthly usage records</small></li><li><span>02</span><strong>Mapping + validation</strong><small>Review before confirmation</small></li><li><span>03</span><strong>Prices + incentives</strong><small>Model and supplier rules</small></li><li><span>04</span><strong>Immutable analysis</strong><small>Deterministic calculation</small></li><li><span>05</span><strong>Dashboard</strong><small>Profitability decisions</small></li></ol>
  </section>

  <section className="maas-workflow maas-rule"><div className="maas-section-head"><span>01 / AUDITABLE WORKFLOW</span><h2>Every transformation remains visible before it becomes a result.</h2><p>Workbooks enter independent staging batches. The analyst can review automatic field mapping, correct ambiguous headers, inspect valid, fallback, warning, and rejected rows, then confirm or cancel the import. Pricing and supplier incentives are configured only after the durable usage data is ready.</p></div><div className="maas-screen-grid"><Figure src={asset("imports.png")} alt="Workbook upload step in the MaaS analyzer" caption="Upload — each workbook begins as an independent staged batch."/><Figure src={asset("pricing.png")} alt="Model pricing configuration with two input-size buckets" caption="Pricing — every standardized model preserves separate input-size buckets."/><Figure src={asset("incentives.png")} alt="Supplier incentive input step" caption="Incentives — supplier-week ratios complete the business inputs."/><Figure src={asset("analysis.png")} alt="Analysis readiness page showing model prices and supplier incentives ready" caption="Readiness — the run can begin only when its dependencies are complete."/></div></section>

  <section className="maas-engine maas-rule"><div className="maas-section-head"><span>02 / CALCULATION ENGINE</span><h2>Calculate at the level where price differences still matter.</h2><p>Usage is grouped first by month, week segment, supplier, model, and input-size bucket. Revenue and partner payment are calculated there before results roll up. This avoids silently applying a blended price to models and token buckets with different economics.</p></div><div className="maas-equation"><div><span>USAGE</span><strong>Input · output · cache tokens</strong></div><b>+</b><div><span>MODEL PRICES</span><strong>&lt;32k · ≥32k buckets</strong></div><b>+</b><div><span>SUPPLIER RULES</span><strong>Exchange · discount · incentive</strong></div><b>=</b><div className="maas-equation-output"><span>PROFITABILITY</span><strong>Revenue − partner payment</strong></div></div><div className="maas-formula"><span>SERVER-SIDE FINANCIAL RULE</span><code>gross_profit = customer_revenue − partner_total_payment</code><p>Gross margin is calculated only when revenue is present and non-zero. The browser visualizes results; it does not recalculate them.</p></div></section>

  <section className="maas-dashboard maas-rule"><div className="maas-section-head"><span>03 / DECISION SURFACE</span><h2>One dashboard connects totals to suppliers, trends, exceptions, and data quality.</h2><p>The latest non-stale completed run can be filtered by month, week segment, or supplier. Totals reconcile with the supplier table, while comparisons reveal where partner payments overtake customer revenue.</p></div><Figure src={asset("dashboard-suppliers.png")} alt="Supplier profitability table showing revenue, payment, profit, and margin" caption="Supplier overview — the same calculation can be traced across ten anonymized suppliers." className="maas-wide-screen"/><div className="maas-dashboard-grid"><Figure src={asset("dashboard-charts.png")} alt="Supplier margin and revenue-versus-payment charts" caption="Comparisons — profit, margin, revenue, and payment reveal different operational risks."/><Figure src={asset("dashboard-quality.png")} alt="Negative-profit suppliers and data-quality summary" caption="Exceptions + evidence — losses and quality counts remain part of the decision surface."/></div></section>

  <section className="maas-architecture maas-rule"><div className="maas-section-head"><span>04 / SYSTEM ARCHITECTURE</span><h2>A portable local stack keeps the workflow understandable and auditable.</h2><p>Flask coordinates the multi-page workflow and server-side rules. SQLite stores staged imports, confirmed usage, configuration, immutable runs, and reconciled results. Jinja and JavaScript present those results, while Chart.js is limited to visualization.</p></div><div className="maas-stack"><article><span>01 / INTERFACE</span><h3>Jinja + JavaScript</h3><p>Workflow pages, filters, tables, and chart rendering.</p></article><i>↓</i><article><span>02 / SERVICES</span><h3>Flask analysis layer</h3><p>Validation, dependency guards, aggregation, and dashboard APIs.</p></article><i>↓</i><article><span>03 / DATA</span><h3>SQLite</h3><p>Staging · confirmed usage · inputs · runs · results · quality.</p></article></div></section>

  <section className="maas-decisions maas-rule"><div className="maas-section-head"><span>05 / RELIABILITY BY DESIGN</span><h2>The product treats uncertainty as interface content, not hidden implementation detail.</h2></div><div className="maas-decision-grid">{decisions.map(([title,copy],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

  <section className="maas-reflection maas-rule"><span>PRODUCT POSITION</span><h2>Trust is part of the product’s output.</h2><p>The prototype is intentionally local-first: it can process financial workbooks without requiring a separate database service, and each completed run remains reproducible. A hosted production version would add authentication, role-based access, durable object storage, automated tests, observability, and controlled result sharing.</p><a href="https://youtu.be/z7cDvAcKSpk" target="_blank" rel="noreferrer">Watch product demo ↗</a></section>

  <section className="maas-next"><a href="/work">Back to selected work ↗</a><a href="/work/second-world">Next project — Second World →</a></section>
  <footer><span>LINDA DENG</span><span>MAAS ECOSYSTEM PROFIT ANALYZER</span><span>2026</span></footer>
</main>}
