import type {Metadata} from "next";
import {headers} from "next/headers";
import {notFound} from "next/navigation";
import {projects, type ProjectSlug} from "../data";
import BiocharProject from "./BiocharProject";
import ProxyLandscapeProject from "./ProxyLandscapeProject";
import MuseumReorganizationProject from "./MuseumReorganizationProject";
import MyceliumFacadeProject from "./MyceliumFacadeProject";
import ConflictLightDarkProject from "./ConflictLightDarkProject";
import LensOnMoveProject from "./LensOnMoveProject";
import FutureTruckStopProject from "./FutureTruckStopProject";
import HopeInGapProject from "./HopeInGapProject";
import MaasProfitAnalyzerProject from "./MaasProfitAnalyzerProject";
import SecondWorldProject from "./SecondWorldProject";
import AlanProject from "./AlanProject";
import {ProjectHeader, ProjectNumber} from "../ProjectChrome";
import {projectPosition} from "../catalog";

async function getProject(params:Promise<{slug:string}>){const {slug}=await params;return projects[slug as ProjectSlug]}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const project=await getProject(params); if(!project)return{}; const h=await headers(); const host=h.get("x-forwarded-host")??h.get("host")??"localhost"; const protocol=h.get("x-forwarded-proto")??"https"; const image=`${protocol}://${host}${project.image}`;
  return{title:`${project.title} — Linda Deng`,description:project.lead,openGraph:{title:`${project.title} — Linda Deng`,description:project.lead,images:[image]},twitter:{card:"summary_large_image",title:`${project.title} — Linda Deng`,description:project.lead,images:[image]}};
}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){const {slug:rawSlug}=await params;const slug=rawSlug as ProjectSlug;const project=projects[slug];if(!project)notFound();if(slug==="alan")return <AlanProject/>;if(slug==="biochar-metabolism")return <BiocharProject/>;if(slug==="proxy-landscape")return <ProxyLandscapeProject/>;if(slug==="museum-reorganization")return <MuseumReorganizationProject/>;if(slug==="mycelium-living-facade")return <MyceliumFacadeProject/>;if(slug==="conflict-light-dark")return <ConflictLightDarkProject/>;if(slug==="lens-on-the-move")return <LensOnMoveProject/>;if(slug==="future-truck-stop")return <FutureTruckStopProject/>;if(slug==="hope-in-gap")return <HopeInGapProject/>;if(slug==="maas-profit-analyzer")return <MaasProfitAnalyzerProject/>;if(slug==="second-world")return <SecondWorldProject/>;return <main className="project-page">
  <ProjectHeader slug={slug} className="project-header"/>
  <section className="project-title"><div><ProjectNumber slug={slug}/><p>{project.tags}</p></div><h1>{project.title}</h1><p>{project.lead}</p></section>
  <figure className="project-main-image"><img src={project.image} alt={`${project.title} research and design spread`}/><figcaption>Prototype image extracted from portfolio PDF · final image sequence pending</figcaption></figure>
  <section className="research-question"><span>RESEARCH QUESTION</span><h2>{project.question}</h2></section>
  <section className="project-overview"><span>CONTEXT + METHOD</span><p>{project.overview}</p></section>
  <section className="process"><div className="process-head"><span>SYSTEM LOGIC</span><p>Read the transformation from input to spatial effect.</p></div><ol>{project.stages.map(stage=><li key={stage[0]}><span>{stage[0]}</span><h3>{stage[1]}</h3><p>{stage[2]}</p></li>)}</ol></section>
  <figure className="project-second-image"><img src={project.secondImage} alt={`${project.title} system outcomes`}/><figcaption>Portfolio study · temporary prototype asset</figcaption></figure>
  <section className="finding"><span>SPATIAL PROPOSITION</span><p>{project.finding}</p></section>
  <section className="next-project"><a href={projectPosition(slug).categoryHref}>Back to {projectPosition(slug).categoryLabel} ↗</a><p>Full drawings, research text and high-resolution images will be added after the visual direction is confirmed.</p></section>
  <footer><span>LINDA DENG</span><span>{project.title}</span><span>{project.year}</span></footer>
  </main>}
