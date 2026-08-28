"use client";

import { useState } from "react";

const systems = [
  { id:"01", name:"Biochar Metabolism", field:"Material metabolism", color:"#315f57", stages:[
    ["Municipal waste","An urban output becomes a local material input."],
    ["Pyrolysis","Heat transforms biomass into energy and stable carbon."],
    ["Biochar","Carbon is stored in a porous, adaptable material."],
    ["Building products","Biochar enters plaster, concrete, insulation and panels."],
    ["Repair + reuse","A building metabolizes its own operational waste."],
    ["Closed carbon loop","Architecture becomes part of an urban carbon cycle."] ] },
  { id:"02", name:"Proxy Landscape", field:"Hybrid watershed", color:"#3c6688", stages:[
    ["Urban + tidal water","Spontaneous and controlled flows meet at Jamaica Bay."],
    ["GIS mapping","Flow, pollution, erosion and marsh loss become legible."],
    ["Intersection sites","Machines locate where the two watersheds collide."],
    ["Low-tech machines","Human and water power filter, move and accumulate."],
    ["Marsh repair","A chain of interventions modifies the coastal edge."],
    ["Shared awareness","Landscape labor becomes visible and participatory."] ] },
  { id:"03", name:"Museum Reorganization", field:"Computational spatial logic", color:"#8a553c", stages:[
    ["Boundary + areas","A fixed museum envelope receives variable room inputs."],
    ["Genetic division","Layouts evolve while holding area tolerance within 2%."],
    ["Door network","Possible connections are generated and sorted."],
    ["Route finding","Four efficient paths preserve freedom to explore."],
    ["Isovist analysis","Openness and visual complexity are quantified."],
    ["Curatorial choice","Readable outputs support periodic reorganization."] ] },
];

const projects=[
  {id:"01",title:"Biochar Metabolism",slug:"biochar-metabolism",image:"/portfolio/biochar-system.jpg",tags:"Architecture · Material · Ecology",question:"Can urban waste become the material of architectural repair?"},
  {id:"02",title:"The Proxy Landscape",slug:"proxy-landscape",image:"/portfolio/proxy-fields.jpg",tags:"Architecture · Computation · Ecology",question:"Can water reveal—and help repair—the hybrid urban landscape?"},
  {id:"03",title:"Museum Reorganization",slug:"museum-reorganization",image:"/portfolio/museum-process.jpg",tags:"Architecture · Computation",question:"Can optimization preserve, rather than reduce, spatial freedom?"},
];

export default function Home(){
  const [systemIndex,setSystemIndex]=useState(0); const [stageIndex,setStageIndex]=useState(0); const system=systems[systemIndex];
  return <main style={{"--system-color":system.color} as React.CSSProperties}>
    <header><a className="mark" href="#top">LINDA DENG</a><nav><a href="#work">Index</a><a href="#about">About</a></nav></header>
    <section className="atlas" id="top">
      <div className="atlas-intro"><span>DESIGN RESEARCH / SYSTEMS ATLAS</span><h1>Conditions become<br/><i>spatial systems.</i></h1><p>Architecture, material, computation and ecology—read through the transformations that connect them.</p></div>
      <div className="system-meta"><span>SYSTEM {system.id} / 03</span><h2>{system.name}</h2><p>{system.field}</p></div>
      <div className="system-chain" aria-label={`${system.name} causal system`}>
        <div className="causal-line"/><div className="flow-pulse" style={{left:`calc(${stageIndex * 18}% + 2%)`}}/>
        {system.stages.map((stage,index)=><button key={stage[0]} onPointerEnter={()=>setStageIndex(index)} onFocus={()=>setStageIndex(index)} onClick={()=>setStageIndex(index)} className={index<=stageIndex?"reached":""}><span>{String(index+1).padStart(2,"0")}</span><i/><b>{stage[0]}</b></button>)}
      </div>
      <div className="stage-reading"><span>{String(stageIndex+1).padStart(2,"0")} / 06</span><p>{system.stages[stageIndex][1]}</p><small>{stageIndex===0?"INPUT":stageIndex===5?"EFFECT":"TRANSFORMATION"}</small></div>
      <div className="system-tabs">{systems.map((item,index)=><button key={item.id} className={index===systemIndex?"selected":""} onClick={()=>{setSystemIndex(index);setStageIndex(0)}}><span>{item.id}</span>{item.name}</button>)}</div>
      <a className="continue" href="#work">Explore selected work ↓</a>
    </section>
    <section id="work" className="work-section"><div className="section-head"><span>01 / SELECTED WORK</span><p>Research moves from evidence to system, and from system to a spatial proposition.</p></div>
      <div className="work-list">{projects.map(project=><a className="work-card" href={`/work/${project.slug}`} key={project.slug}>
        <div className="work-image"><img src={project.image} alt={`${project.title} portfolio spread`}/><div className="scan-line"/></div>
        <div className="work-copy"><span>{project.id}</span><p>{project.tags}</p><h2>{project.title}</h2><h3>{project.question}</h3><i>View research ↗</i></div>
      </a>)}</div>
    </section>
    <section id="about" className="about-section"><span>02 / POSITION</span><div><h2>Designing relationships,<br/><i>not isolated objects.</i></h2><p>Linda Deng is an architectural designer and researcher working across material systems, computation, and ecological processes. Her work uses mapping, modeling, and prototyping to translate complex conditions into spatial propositions.</p><a href="mailto:hello@lindadeng.design">Contact ↗</a></div></section>
    <footer><span>LINDA DENG</span><span>DESIGN / RESEARCH / TECHNOLOGY</span><span>NEW YORK · 2026</span></footer>
  </main>
}
