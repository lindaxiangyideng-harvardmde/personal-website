import {ProjectHeader, ProjectNext, ProjectNumber} from "../ProjectChrome";
const asset=(name:string)=>`/portfolio/second-world/${name}`;

const channels=[
  ["QUEST","4 intervals","Chapter markers carried to timed digital rows."],
  ["INTENTION","14 intervals","Planned, detour, and an explicit initial unknown state."],
  ["DIGITAL ACTION","117 intervals","Seven avatar behaviors sustained until the next action change."],
  ["PHYSICAL POSTURE","99 intervals","Six body states parsed independently from gesture timestamps."],
  ["HAND GESTURE","16 events","Instantaneous physical events with no invented duration."],
  ["TRIGGER","3 events","Collect and explore remain point events on the actual route."],
];

const grammar=[
  ["Planned intention","Warm-ivory dashed line","The uninterrupted expected route."],
  ["Actual behavior","Solid cool-blue line","Leaves and reconnects during six recorded detours."],
  ["Digital action","Cool categorical dots","Duration sets dot count; timestamp fixes route position."],
  ["Physical posture","Lavender ripple field","Posture changes scale, eccentricity, opacity, and pulse rate."],
  ["Hand gesture","Pink temporary rings","A short ripple leaves one permanent notch in the route."],
  ["Trigger + quest","Green nodes + brackets","Point events and duration-proportional journey sections."],
];

const integrity=[
  ["22","validation checks passed"],
  ["250811","fixed deterministic seed"],
  ["49 sec","physical-only aftertrace preserved"],
  ["0","locations or left/right directions invented"],
];

function KeyFrame({time,file,copy}:{time:string;file:string;copy:string}){return <figure className="sw-keyframe"><img src={asset(`p5_animation/previews/${file}`)} alt={`Second World animation at ${time}`} loading="lazy"/><figcaption><span>{time}</span><p>{copy}</p></figcaption></figure>}

export default function SecondWorldProject(){return <main className="second-world-page">
  <ProjectHeader slug="second-world" className="sw-header"/>
  <section className="sw-title"><div className="sw-kicker"><ProjectNumber slug="second-world"/><span>Data Visualization / Behavioral Research</span></div><div className="sw-title-copy"><h1>Second<br/><i>World</i></h1><p>A synchronized behavioral portrait comparing what I intended to do, what my digital avatar actually did, and how my body unconsciously responded.</p></div><dl className="sw-facts"><div><dt>Duration</dt><dd>2,996 recorded seconds → 60-second animation</dd></div><div><dt>Media</dt><dd>Data audit · p5.js · interactive animation</dd></div><div><dt>Structure</dt><dd>Six synchronized temporal channels</dd></div></dl></section>
  <section className="sw-dark sw-live"><div className="sw-live-head"><span>LIVE BEHAVIORAL PORTRAIT</span><p>Play, pause, scrub, or inspect 15 / 38 / 60 seconds.</p></div><iframe src={asset("p5_animation/")} title="Second World sixty-second behavioral data animation" loading="eager"/></section>

  <section className="sw-question sw-rule"><span>BEHAVIORAL QUESTION</span><h2>One experience was recorded through three different selves.</h2><p>The visualization does not score the player or explain behavior psychologically. It compares three temporal accounts of one gaming session: the route I intended to follow, the actions performed by my digital avatar, and the changing posture of my physical body. Their agreements and mismatches accumulate into one behavioral trace.</p><div className="sw-three-selves"><article><span>01</span><h3>Intention</h3><p>What I planned to do.</p></article><i>→</i><article><span>02</span><h3>Digital self</h3><p>What the avatar actually did.</p></article><i>→</i><article><span>03</span><h3>Physical self</h3><p>How the body responded.</p></article></div></section>

  <section className="sw-channels sw-rule"><div className="sw-section-head"><span>01 / SIX SYNCHRONIZED CHANNELS</span><h2>The source was not one table, but six clocks describing the same session.</h2><p>The digital and physical workbooks were recorded independently. Physical 00:04 and digital 00:18 are aligned as the same real-world moment, then every state and event is reconstructed inside its own temporal channel.</p></div><div className="sw-stat-line"><article><strong>2,996</strong><span>master seconds</span></article><article><strong>60</strong><span>animation seconds</span></article><article><strong>117</strong><span>digital intervals</span></article><article><strong>99</strong><span>posture intervals</span></article><article><strong>16</strong><span>gesture events</span></article><article><strong>6</strong><span>recorded detours</span></article></div><div className="sw-channel-grid">{channels.map(([title,count,copy],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{title}</h3><strong>{count}</strong><p>{copy}</p></div></article>)}</div></section>

  <section className="sw-audit sw-rule"><div className="sw-section-head"><span>02 / FROM LOG TO AUDITABLE DATA</span><h2>Duration had to be derived without inventing relationships between rows.</h2><p>The original sheets mix sustained states with instantaneous events, and every duration cell is blank. A gesture timestamp cannot be paired with a posture merely because they share a spreadsheet row. Each channel is therefore parsed, sorted, aligned, and validated independently before visualization.</p></div><ol className="sw-pipeline"><li><span>01</span><h3>Raw workbooks</h3><p>Mixed temporal grains and inconsistent timestamp formats.</p></li><li><span>02</span><h3>Data audit</h3><p>Independent channels, endpoint assumptions, and interpretation limits.</p></li><li><span>03</span><h3>Derived intervals</h3><p>Aligned seconds, duration, source rows, and validation status.</p></li><li><span>04</span><h3>Validated JSON</h3><p>Six reconciled p5-friendly collections with unchanged sources.</p></li><li><span>05</span><h3>Animation</h3><p>A proportional 2,996-to-60-second transformation.</p></li></ol><aside className="sw-assumptions"><span>VISIBLE ASSUMPTIONS</span><p>The first 21 seconds of intention remain unknown. The digital endpoint and physical endpoint stay flagged. No missing digital behavior is filled into the final 49-second physical tail.</p></aside></section>

  <section className="sw-dark sw-grammar"><div className="sw-section-head sw-section-head-dark"><span>03 / VISUAL GRAMMAR</span><h2>Every visual mark answers to one recorded variable.</h2><p>The system behaves like an instrument rather than a literal game map. Time controls horizontal position; category, duration, posture, and event type control the visual properties around that shared route.</p></div><div className="sw-grammar-grid">{grammar.map(([title,mark,copy],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><div className={`sw-symbol sw-symbol-${i+1}`} aria-hidden="true"><i/><i/><i/></div><h3>{title}</h3><strong>{mark}</strong><p>{copy}</p></article>)}</div></section>

  <section className="sw-dark sw-accumulation"><div className="sw-section-head sw-section-head-dark"><span>04 / ONE SESSION, ACCUMULATING</span><h2>The route grows; its earlier marks remain as history.</h2><p>Previously emitted dots keep deterministic positions while later events accumulate. At 59.02 seconds the digital route stops; the body continues through the final physical aftertrace.</p></div><div className="sw-keyframe-grid"><KeyFrame time="15 SEC" file="second-world-animation-15s.png" copy="Quest 1’s dominant detour establishes the difference between plan and behavior."/><KeyFrame time="38 SEC" file="second-world-animation-38s.png" copy="Multiple quest sections and action rhythms accumulate without resetting the frame."/><KeyFrame time="60 SEC" file="second-world-animation-60s.png" copy="The completed trace remains alive through an autonomous physical ripple."/></div><KeyFrame time="42.5 SEC / LEANING FORWARD" file="second-world-animation-forward-energy-42.5s.png" copy="The strongest recorded body state expands and brightens the physical-energy field without reclassifying the digital action."/></section>

  <section className="sw-dark sw-quests"><div className="sw-section-head sw-section-head-dark"><span>05 / QUEST PORTRAITS</span><h2>Chronology becomes comparable without becoming interchangeable.</h2><p>The complete session answers when physical and digital states overlap. Three completed quest portraits compare duration, detour share, action rhythm, and bodily response. Hovering a portrait opens a fixed 120-second detail window with its own moving playhead.</p></div><div className="sw-quest-notes"><article><span>Q1</span><strong>20:55</strong><p>30.0% detour</p></article><article><span>Q2</span><strong>09:40</strong><p>0% detour · original Q2 + Q3</p></article><article><span>Q3</span><strong>18:32</strong><p>12.1% detour · original Q4</p></article></div><iframe className="sw-quest-frame" src={asset("p5_quest_comparison/")} title="Second World completed quest portraits and interactive two-minute detail" loading="lazy"/></section>

  <section className="sw-integrity sw-rule"><div className="sw-section-head"><span>06 / DATA INTEGRITY</span><h2>Uncertainty stays visible inside the finished portrait.</h2><p>The project preserves the limits of the recording instead of converting them into confident-looking graphics. Every derived record retains its source row, raw timestamp, and assumption flags.</p></div><div className="sw-integrity-grid">{integrity.map(([value,label])=><article key={label}><strong>{value}</strong><span>{label}</span></article>)}</div></section>
  <section className="sw-reflection sw-rule"><span>VISUALIZATION POSITION</span><h2>An instrument for reading one recorded experience—not a dashboard and not a literal game map.</h2><p>The final animation makes three temporal selves visible without collapsing them into one measure of intensity. Intention supplies a reference, digital action builds behavioral matter, and the physical body changes pressure and depth. Their mismatches are not errors to correct; they are the subject of the work.</p></section>
  <ProjectNext slug="second-world" className="sw-next"/>
  <footer><span>LINDA DENG</span><span>SECOND WORLD</span><span>2026</span></footer>
</main>}
