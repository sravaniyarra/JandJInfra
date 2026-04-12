import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, GripVertical, ImagePlus, Pencil, Plus, RefreshCcw, UploadCloud, Video } from "lucide-react";
import { api, authHeader } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Select from "../components/ui/Select";
import Skeleton from "../components/ui/Skeleton";

const categories = ["Infrastructure", "Interior"];

function UploadDropzone({ label, accept, file, onChange, icon: Icon }) {
  const [dragging, setDragging] = useState(false);

  const onDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) onChange(droppedFile);
  };

  return (
    <div className="space-y-1.5">
      <p className="text-sm text-slate-600">{label}</p>
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-4 transition ${
          dragging ? "border-primary bg-primary/5" : "border-slate-300 bg-slate-50 hover:border-slate-400"
        }`}
      >
        <div className="rounded-lg bg-white p-2 shadow-soft">
          <Icon className="h-4 w-4 text-slate-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700">Drag and drop or click to upload</p>
          <p className="truncate text-xs text-slate-500">{file?.name || "No file selected"}</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={(event) => onChange(event.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}

export default function MaterialsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("search") || "").toLowerCase().trim();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Infrastructure");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [materials, setMaterials] = useState([]);
  const [lastFailedPayload, setLastFailedPayload] = useState(null);
  const dragIndexRef = useRef(null);
  const dragCategoryRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "Infrastructure",
    image: null,
    video: null
  });
  const [editForm, setEditForm] = useState({
    name: "",
    brand: "",
    category: "Infrastructure",
    image: null,
    video: null
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [editPreviewUrl, setEditPreviewUrl] = useState("");

  const loadMaterials = async () => {
    const { data } = await api.get("/materials");
    setMaterials(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMaterials().catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (editPreviewUrl) URL.revokeObjectURL(editPreviewUrl);
    };
  }, [previewUrl, editPreviewUrl]);

  const grouped = useMemo(
    () =>
      categories.reduce((acc, curr) => {
        acc[curr] = materials.filter((m) => m.category === curr);
        return acc;
      }, {}),
    [materials]
  );
  const activeMaterials = grouped[activeCategory] || [];
  const filteredMaterials = useMemo(() => {
    if (!searchQuery) return activeMaterials;
    return activeMaterials.filter((material) =>
      `${material.name} ${material.brand} ${material.category}`.toLowerCase().includes(searchQuery)
    );
  }, [activeMaterials, searchQuery]);
  const featuredImages = useMemo(
    () => filteredMaterials.map((material) => material.imageUrl).filter(Boolean),
    [filteredMaterials]
  );

  useEffect(() => {
    setCurrentSlide(0);
  }, [activeCategory]);

  useEffect(() => {
    if (featuredImages.length <= 1) return undefined;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [featuredImages]);

  const postMaterial = async (payload) => {
    const fd = new FormData();
    fd.append("name", payload.name);
    fd.append("brand", payload.brand);
    fd.append("category", payload.category);
    fd.append("image", payload.image);
    if (payload.video) fd.append("video", payload.video);
    return api.post("/materials", fd, authHeader(token));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.image) return;
    setSubmitting(true);
    setError("");
    const tempId = `temp-${Date.now()}`;
    const optimisticItem = {
      _id: tempId,
      name: form.name,
      brand: form.brand,
      category: form.category,
      imageUrl: previewUrl,
      videoUrl: form.video ? "pending" : ""
    };
    setMaterials((prev) => [optimisticItem, ...prev]);

    try {
      const payload = { ...form };
      const { data } = await postMaterial(payload);
      setMaterials((prev) => [data, ...prev.filter((item) => item._id !== tempId)]);
      setOpenModal(false);
      setForm({ name: "", brand: "", category: "Infrastructure", image: null, video: null });
      setPreviewUrl("");
      setToast("Material added successfully");
      setTimeout(() => setToast(""), 2400);
      setLastFailedPayload(null);
    } catch (err) {
      setMaterials((prev) => prev.filter((item) => item._id !== tempId));
      setLastFailedPayload({ ...form });
      setError(err.response?.data?.message || "Upload failed. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  const retryLastUpload = async () => {
    if (!lastFailedPayload) return;
    setSubmitting(true);
    setError("");
    try {
      const { data } = await postMaterial(lastFailedPayload);
      setMaterials((prev) => [data, ...prev]);
      setToast("Retry successful");
      setTimeout(() => setToast(""), 2200);
      setLastFailedPayload(null);
    } catch (err) {
      setError(err.response?.data?.message || "Retry failed");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDrawer = (material) => {
    setEditingMaterial(material);
    setEditForm({
      name: material.name,
      brand: material.brand,
      category: material.category,
      image: null,
      video: null
    });
    setEditPreviewUrl(material.imageUrl || "");
    setEditOpen(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingMaterial) return;
    const previous = materials;
    const optimistic = materials.map((m) =>
      m._id === editingMaterial._id
        ? { ...m, name: editForm.name, brand: editForm.brand, category: editForm.category, imageUrl: editPreviewUrl || m.imageUrl }
        : m
    );
    setMaterials(optimistic);

    const fd = new FormData();
    fd.append("name", editForm.name);
    fd.append("brand", editForm.brand);
    fd.append("category", editForm.category);
    if (editForm.image) fd.append("image", editForm.image);
    if (editForm.video) fd.append("video", editForm.video);

    try {
      const { data } = await api.put(`/materials/${editingMaterial._id}`, fd, authHeader(token));
      setMaterials((prev) => prev.map((m) => (m._id === data._id ? data : m)));
      setToast("Material updated");
      setTimeout(() => setToast(""), 2000);
      setEditOpen(false);
    } catch (err) {
      setMaterials(previous);
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const onCardDragStart = (index, category) => {
    dragIndexRef.current = index;
    dragCategoryRef.current = category;
  };

  const onCardDrop = (dropIndex, category) => {
    const from = dragIndexRef.current;
    const fromCategory = dragCategoryRef.current;
    if (from === null || fromCategory !== category || from === dropIndex) return;

    const categoryItems = grouped[category] || [];
    const next = [...categoryItems];
    const [moved] = next.splice(from, 1);
    next.splice(dropIndex, 0, moved);
    const categoryIds = new Set(categoryItems.map((m) => m._id));
    const remaining = materials.filter((m) => !categoryIds.has(m._id));
    setMaterials([...remaining, ...next]);
    dragIndexRef.current = null;
    dragCategoryRef.current = null;
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
          {lastFailedPayload ? (
            <button className="inline-flex items-center gap-1 font-medium underline" onClick={retryLastUpload}>
              <RefreshCcw className="h-3.5 w-3.5" />
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-primary/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-28 left-20 h-56 w-56 rounded-full bg-cyan-100/50 blur-2xl" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Materials</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Curated finishes and structural materials with a premium catalog view for client presentations.
            </p>
          </div>
          {token ? (
            <Button onClick={() => setOpenModal(true)}>
              <Plus className="h-4 w-4" />
              Add Material
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              activeCategory === category
                ? "border-transparent bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-soft"
                : "border-sky-100 bg-[#f1f8ff] text-slate-600 hover:border-sky-200 hover:bg-[#eaf5ff] hover:text-slate-900"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {featuredImages.length ? (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="aspect-[21/8] min-h-[180px] w-full bg-slate-100 sm:min-h-[220px]">
            <img
              src={featuredImages[currentSlide]}
              alt="featured material"
              className="h-full w-full object-cover transition duration-500"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent" />
          <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur sm:text-sm">
            Featured {activeCategory} Collection
          </div>
          {featuredImages.length > 1 ? (
            <div className="absolute bottom-4 right-4 flex gap-1.5">
              {featuredImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    currentSlide === idx ? "bg-white" : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : materials.length === 0 ? (
        <EmptyState
          title="No materials yet"
          message={token ? "Start by adding your first material item." : "No materials published yet."}
        />
      ) : filteredMaterials.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No matching materials" : `No ${activeCategory.toLowerCase()} materials`}
          message={
            searchQuery
              ? "Try another keyword from material name, brand, or category."
              : token
                ? "Add one from the button above."
                : "No items available in this category yet."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredMaterials.map((material, index) => (
            <Card
              key={material._id}
              className="group overflow-hidden border-slate-200 p-0 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              draggable
              onDragStart={() => onCardDragStart(index, activeCategory)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onCardDrop(index, activeCategory)}
            >
              <div className="relative aspect-[16/10] bg-slate-100">
                {material.imageUrl ? (
                  <img
                    src={material.imageUrl}
                    alt={material.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : null}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/55 to-transparent p-3">
                  <span className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-slate-700">
                    {material.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{material.name}</p>
                  <div className="flex items-center gap-1">
                    <GripVertical className="h-4 w-4 text-slate-400" />
                    {token ? (
                      <button className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700" onClick={() => openEditDrawer(material)}>
                        <Pencil className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
                <p className="mt-0.5 text-sm text-slate-500">{material.brand}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Drag to reorder</span>
                  {material.videoUrl ? (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Video className="h-3.5 w-3.5" />
                      Video
                    </span>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={openModal} title="Add Material" onClose={() => setOpenModal(false)}>
        <form className="flex max-h-[70vh] flex-col" onSubmit={submit}>
          <div className="space-y-4 overflow-y-auto pr-1">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
            <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>

            <UploadDropzone
              label="Image (required)"
              accept="image/*"
              icon={ImagePlus}
              file={form.image}
              onChange={(file) => {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setForm({ ...form, image: file });
                setPreviewUrl(file ? URL.createObjectURL(file) : "");
              }}
            />

            {previewUrl ? (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <img src={previewUrl} alt="preview" className="h-36 w-full object-cover" />
              </div>
            ) : null}

            <UploadDropzone
              label="Video (optional)"
              accept="video/*"
              icon={UploadCloud}
              file={form.video}
              onChange={(file) => setForm({ ...form, video: file })}
            />
          </div>

          <div className="mt-4 flex justify-end gap-2 border-t border-slate-200 bg-white pt-3">
            <Button type="button" variant="ghost" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !form.image}>
              {submitting ? "Saving..." : "Save Material"}
            </Button>
          </div>
        </form>
      </Modal>

      <div
        className={`fixed right-0 top-0 z-50 h-full w-full border-l border-slate-200 bg-white p-4 shadow-soft transition-transform duration-300 sm:max-w-md sm:p-6 ${
          editOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Material</h3>
          <button className="text-sm text-slate-500 hover:text-slate-700" onClick={() => setEditOpen(false)}>
            Close
          </button>
        </div>
        <form className="flex h-[calc(100%-44px)] flex-col" onSubmit={submitEdit}>
          <div className="space-y-4 overflow-y-auto pr-1">
            <Input label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
            <Input label="Brand" value={editForm.brand} onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })} required />
            <Select label="Category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
            <UploadDropzone
              label="Update image"
              accept="image/*"
              icon={ImagePlus}
              file={editForm.image}
              onChange={(file) => {
                if (editPreviewUrl && editPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(editPreviewUrl);
                setEditForm({ ...editForm, image: file });
                if (file) setEditPreviewUrl(URL.createObjectURL(file));
              }}
            />
            {editPreviewUrl ? (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <img src={editPreviewUrl} alt="edit preview" className="h-36 w-full object-cover" />
              </div>
            ) : null}
            <UploadDropzone
              label="Update video"
              accept="video/*"
              icon={UploadCloud}
              file={editForm.video}
              onChange={(file) => setEditForm({ ...editForm, video: file })}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2 border-t border-slate-200 bg-white pt-3">
            <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </div>
    </div>
  );
}