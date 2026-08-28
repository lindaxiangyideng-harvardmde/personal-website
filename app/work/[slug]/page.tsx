import type {Metadata} from "next";
import {headers} from "next/headers";
import {notFound} from "next/navigation";
import {projects, type ProjectSlug} from "../data";
import BiocharProject from "./BiocharProject";

async function getProject(params:Promise<{slug:string}>){const {slug}=await params;return projects[slug as ProjectSlug]}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const project=await getProject(params); if(!project)return{}; const h=await headers(); const host=h.get("x-forwarded-host")??h.get("host")??"localhost"; const protocol=h.get("x-forwarded-proto")??"https"; const image=`${protocol}://${host}${project.image}`;
  return{title:`${project.title} — Linda Deng`,description:project.lead,openGraph:{title:`${project.title} — Linda Deng`,description:project.lead,images:[image]},twitter:{card:"summary_large_image",title:`${project.title} — Linda Deng`,description:project.lead,images:[image]}};
}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){const project=await getProject(params);if(!project)notFound();if(project.number==="01")return <BiocharProject/>;return <main className="project-page">
  <header><a className="mark" href="/">LINDA DENG</a><nav><a href="/work">← Index</a><a href="/about">About</a></nav></header>
  <section className="project-title"><div><span>{project.number} / {project.year}</span><p>{project.tags}</p></div><h1>{project.title}</h1><p>{project.lead}</p></section>
  <figure className="project-main-image"><img src={project.image} alt={`${project.title} research and design spread`}/><figcaption>Prototype image extracted from portfolio PDF · final image sequence pending</figcaption></figure>
  <section className="research-question"><span>RESEARCH QUESTION</span><h2>{project.question}</h2></section>
  <section className="project-overview"><span>CONTEXT + METHOD</span><p>{project.overview}</p></section>
  <section className="process"><div className="process-head"><span>SYSTEM LOGIC</span><p>Read the transformation from input to spatial effect.</p></div><ol>{project.stages.map(stage=><li key={stage[0]}><span>{stage[0]}</span><h3>{stage[1]}</h3><p>{stage[2]}</p></li>)}</ol></section>
  <figure className="project-second-image"><img src={project.secondImage} alt={`${project.title} system outcomes`}/><figcaption>Portfolio study · temporary prototype asset</figcaption></figure>
  <section className="finding"><span>SPATIAL PROPOSITION</span><p>{project.finding}</p></section>
  <section className="next-project"><a href="/work">Back to selected work ↗</a><p>Full drawings, research text and high-resolution images will be added after the visual direction is confirmed.</p></section>
  <footer><span>LINDA DENG</span><span>{project.title}</span><span>{project.year}</span></footer>
  </main>}
