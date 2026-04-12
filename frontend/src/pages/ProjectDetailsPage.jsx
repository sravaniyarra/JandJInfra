import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    api.get(`/projects/${id}`).then((res) => setProject(res.data));
  }, [id]);

  if (!project) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-line bg-gradient-to-br from-surface to-elevated/50 p-6 shadow-lift dark:to-elevated/30">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Project Narrative</p>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-ink">{project.name}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-subtle">{project.description}</p>
      </div>

      <Card>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-subtle">Materials Used</h3>
        <div className="flex flex-wrap gap-2">
          {project.materialsUsed?.map((m) => (
            <span
              key={m._id}
              className="rounded-full border border-line bg-accent-muted px-3 py-1.5 text-sm font-medium text-ink"
            >
              {m.name} - {m.brand}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-subtle">Image Gallery</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {project.images?.map((img) => (
            <img key={img} src={img} alt="project asset" className="aspect-video w-full rounded-2xl object-cover" />
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-subtle">Videos</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {project.videos?.map((video) => (
            <video key={video} controls className="w-full rounded-2xl border border-line bg-ink">
              <source src={video} />
            </video>
          ))}
        </div>
      </Card>
    </div>
  );
}
