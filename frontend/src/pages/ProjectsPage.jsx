import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, FolderPlus, UploadCloud } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { api, authHeader } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Select from "../components/ui/Select";
import Skeleton from "../components/ui/Skeleton";

function MultiDropzone({ label, accept, files, onFiles }) {
  const [dragging, setDragging] = useState(false);
  const names = useMemo(() => Array.from(files || []).map((f) => f.name).join(", "), [files]);
  return (
    <div className="space-y-1.5">
      <p className="text-sm text-slate-600">{label}</p>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFiles(e.dataTransfer.files || []);
        }}
        className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-4 transition ${
          dragging ? "border-primary bg-primary/5" : "border-slate-300 bg-slate-50 hover:border-slate-400"
        }`}
      >
        <UploadCloud className="h-4 w-4 text-slate-600" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700">Drag & drop files or click</p>
          <p className="truncate text-xs text-slate-500">{names || "No files selected"}</p>
        </div>
        <input className="hidden" type="file" accept={accept} multiple onChange={(e) => onFiles(e.target.files || [])} />
      </label>
    </div>
  );
}

export default function ProjectsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("search") || "").toLowerCase().trim();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    materialsUsed: [],
    images: [],
    videos: []
  });

  const load = async () => {
    const [projectsRes, materialsRes] = await Promise.all([api.get("/projects"), api.get("/materials")]);
    setProjects(projectsRes.data);
    setMaterials(materialsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    return projects.filter((project) =>
      `${project.name} ${project.description}`.toLowerCase().includes(searchQuery)
    );
  }, [projects, searchQuery]);

  const submitProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("materialsUsed", JSON.stringify(form.materialsUsed));
    Array.from(form.images || []).forEach((file) => fd.append("images", file));
    Array.from(form.videos || []).forEach((file) => fd.append("videos", file));

    try {
      const { data } = await api.post("/projects", fd, authHeader(token));
      setProjects((prev) => [data, ...prev]);
      setForm({ name: "", description: "", materialsUsed: [], images: [], videos: [] });
      setOpenModal(false);
      setToast("Project added");
      setTimeout(() => setToast(""), 2200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload project media");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast ? (
        <div className="fixed right-3 top-3 z-[60] flex max-w-[calc(100vw-24px)] items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 shadow-soft sm:right-5 sm:top-5">
          <CheckCircle2 className="h-4 w-4" />
          {toast}
        </div>
      ) : null}
      {error ? (
        <div className="fixed left-3 top-3 z-[60] flex max-w-[calc(100vw-24px)] items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 shadow-soft sm:left-5 sm:top-5">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : null}

      <div className="rounded-3xl border border-sky-100 bg-[#f4faff] p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Portfolio Collection</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Projects</h2>
            <p className="mt-1 text-sm text-slate-600">Gallery-led showcase for completed infrastructure and interior work.</p>
          </div>
          {token ? (
            <Button onClick={() => setOpenModal(true)}>
              <FolderPlus className="h-4 w-4" />
              Add Project
            </Button>
          ) : null}
        </div>
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No matching projects" : "No projects yet"}
          message={
            searchQuery
              ? "Try another keyword from project name or description."
              : "Add your first project to publish the gallery."
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project._id} className="group overflow-hidden border-sky-100 bg-[#f8fdff] p-0">
              <div className="aspect-[4/3] bg-slate-100">
                {project.images?.[0] && (
                  <img
                    src={project.images[0]}
                    alt={project.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold">{project.name}</p>
                <p className="mt-1 text-sm text-slate-500">{project.description?.slice(0, 96)}</p>
                <Link to={`/projects/${project._id}`} className="mt-4 inline-flex items-center gap-2 text-sm text-primary">
                  View details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={openModal} title="Add Project" onClose={() => setOpenModal(false)}>
        <form className="flex max-h-[70vh] flex-col" onSubmit={submitProject}>
          <div className="space-y-4 overflow-y-auto pr-1">
            <Input label="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <label className="block space-y-1.5">
              <span className="text-sm text-slate-600">Description</span>
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </label>
            <Select
              label="Materials used"
              multiple
              value={form.materialsUsed}
              onChange={(e) => setForm({ ...form, materialsUsed: Array.from(e.target.selectedOptions).map((o) => o.value) })}
            >
              {materials.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.brand})
                </option>
              ))}
            </Select>
            <MultiDropzone label="Project images" accept="image/*" files={form.images} onFiles={(files) => setForm({ ...form, images: files })} />
            <MultiDropzone label="Project videos" accept="video/*" files={form.videos} onFiles={(files) => setForm({ ...form, videos: files })} />
          </div>
          <div className="mt-4 flex justify-end gap-2 border-t border-slate-200 bg-white pt-3">
            <Button type="button" variant="ghost" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
