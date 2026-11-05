import HomeScenes from "./HomeScenes";
import type { FieldProject } from "./ResearchField";
import { projectPosition } from "./work/catalog";
import { categories, type CategoryKey } from "./work/categories";
import { projects } from "./work/data";

/** Server entry: hands the 3D field only the project fields it draws, in category order. */
export default function Home() {
  const fieldProjects: FieldProject[] = (Object.keys(categories) as CategoryKey[]).flatMap(category =>
    categories[category].slugs.map(slug => {
      const project = projects[slug];
      return {
        slug,
        category,
        number: projectPosition(slug).number,
        title: project.title,
        year: project.year,
        tags: project.tags.split(" / "),
        question: project.question,
        color: project.color,
        stages: project.stages.map(stage => stage[1]),
      };
    }),
  );
  return <HomeScenes fieldProjects={fieldProjects} />;
}
