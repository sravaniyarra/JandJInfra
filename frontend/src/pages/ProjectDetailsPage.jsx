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
      <div className="rounded-3xl border border-sky-100 bg-[#f4faff] p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Project Narrative</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">{project.name}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{project.description}</p>
      </div>

      <Card className="bg-[#f8fdff]">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Materials Used</h3>
        <div className="flex flex-wrap gap-2">
          {project.materialsUsed?.map((m) => (
            <span key={m._id} className="rounded-full border border-sky-100 bg-[#eef6ff] px-3 py-1.5 text-sm">
              {m.name} - {m.brand}
            </span>
          ))}
        </div>
      </Card>

      <Card className="bg-[#f8fdff]">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Image Gallery</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {project.images?.map((img) => (
            <img key={img} src={img} alt="project asset" className="aspect-video w-full rounded-2xl object-cover" />
          ))}
        </div>
      </Card>

      <Card className="bg-[#f8fdff]">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Videos</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {project.videos?.map((video) => (
            <video key={video} controls className="w-full rounded-2xl border border-sky-100">
              <source src={video} />
            </video>
          ))}
        </div>
      </Card>
    </div>
  );
}
