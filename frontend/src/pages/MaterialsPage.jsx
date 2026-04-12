import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FolderOpen,
  GripVertical,
  ImagePlus,
  Pencil,
  Plus,
  RefreshCcw,
  UploadCloud,
  Video,
  X
} from "lucide-react";
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
      <p className="text-sm font-medium text-subtle">{label}</p>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-4 transition ${
          dragging ? "border-accent bg-accent-muted" : "border-line bg-elevated/50 hover:border-accent/35"
        }`}
      >
        <div className="rounded-lg border border-line bg-surface p-2 shadow-soft">
          <Icon className="h-4 w-4 text-accent" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">Drag and drop or click to upload</p>
          <p className="truncate text-xs text-subtle">{file?.name || "No file selected"}</p>
        </div>
        <input type="file" className="hidden" accept={accept} onChange={(e) => onChange(e.target.files?.[0] || null)} />
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
  const [activeFolder, setActiveFolder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [materials, setMaterials] = useState([]);
  const [lastFailedPayload, setLastFailedPayload] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editPreviewUrl, setEditPreviewUrl] = useState("");
  const dragIndexRef = useRef(null);

  const [form, setForm] = useState({
    name: "", brand: "", category: "Infrastructure", subcategory: "", image: null, video: null
  });
  const [editForm, setEditForm] = useState({
    name: "", brand: "", category: "Infrastructure", subcategory: "", image: null, video: null
  });

  const loadMaterials = async () => {
    const { data } = await api.get("/materials");
    setMaterials(data);
    setLoading(false);
  };

  useEffect(() => { loadMaterials().catch(() => setLoading(false)); }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (editPreviewUrl) URL.revokeObjectURL(editPreviewUrl);
    };
  }, [previewUrl, editPreviewUrl]);

  // Group materials by category, then by subcategory (folders)
  const categoryMaterials = useMemo(
    () => materials.filter((m) => m.category === activeCategory),
    [materials, activeCategory]
  );

  const folders = useMemo(() => {
    const map = {};
    categoryMaterials.forEach((m) => {
      const folder = m.subcategory || "Uncategorized";
      if (!map[folder]) map[folder] = [];
      map[folder].push(m);
    });
    return Object.entries(map)
      .map(([name, items]) => ({ name, items, cover: items[0]?.imageUrl }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categoryMaterials]);

  const filteredFolders = useMemo(() => {
    if (!searchQuery) return folders;
    return folders
      .map((f) => ({
        ...f,
        items: f.items.filter((m) =>
          `${m.name} ${m.brand} ${m.subcategory}`.toLowerCase().includes(searchQuery)
        )
      }))
      .filter((f) => f.items.length > 0);
  }, [folders, searchQuery]);

  const activeFolderItems = useMemo(() => {
    if (!activeFolder) return [];
    const folder = folders.find((f) => f.name === activeFolder);
    if (!folder) return [];
    if (!searchQuery) return folder.items;
    return folder.items.filter((m) =>
      `${m.name} ${m.brand}`.toLowerCase().includes(searchQuery)
    );
  }, [activeFolder, folders, searchQuery]);

  // Existing subcategories for autocomplete
  const existingSubcategories = useMemo(() => {
    const set = new Set(materials.map((m) => m.subcategory).filter(Boolean));
    return [...set].sort();
  }, [materials]);

  const [folderPage, setFolderPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Reset page when folder changes
  useEffect(() => { setFolderPage(1); }, [activeFolder]);

  const paginatedFolderItems = useMemo(() => {
    const start = (folderPage - 1) * ITEMS_PER_PAGE;
    return activeFolderItems.slice(start, start + ITEMS_PER_PAGE);
  }, [activeFolderItems, folderPage]);

  const folderTotalPages = Math.ceil(activeFolderItems.length / ITEMS_PER_PAGE);

  const postMaterial = async (payload) => {
    const fd = new FormData();
    fd.append("name", payload.name);
    fd.append("brand", payload.brand);
    fd.append("category", payload.category);
    fd.append("subcategory", payload.subcategory);
    fd.append("image", payload.image);
    if (payload.video) fd.append("video", payload.video);
    return api.post("/materials", fd, authHeader(token));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.image) return;
    setSubmitting(true);
    setError("");
    try {
      const { data } = await postMaterial(form);
      setMaterials((prev) => [data, ...prev]);
      setOpenModal(false);
      setForm({ name: "", brand: "", category: "Infrastructure", subcategory: "", image: null, video: null });
      setPreviewUrl("");
      setToast("Material added successfully");
      setTimeout(() => setToast(""), 2400);
      setLastFailedPayload(null);
    } catch (err) {
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
      name: material.name, brand: material.brand, category: material.category,
      subcategory: material.subcategory || "", image: null, video: null
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
        ? { ...m, name: editForm.name, brand: editForm.brand, category: editForm.category, subcategory: editForm.subcategory, imageUrl: editPreviewUrl || m.imageUrl }
        : m
    );
    setMaterials(optimistic);
    const fd = new FormData();
    fd.append("name", editForm.name);
    fd.append("brand", editForm.brand);
    fd.append("category", editForm.category);
    fd.append("subcategory", editForm.subcategory);
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

  return (
    <div className="space-y-6">
      {toast ? (
        <div className="fixed right-3 top-3 z-[60] flex max-w-[calc(100vw-24px)] items-center gap-2 rounded-xl border border-accent/30 bg-accent-muted px-4 py-2 text-sm font-medium text-ink shadow-lift sm:right-5 sm:top-5">
          <CheckCircle2 className="h-4 w-4" /> {toast}
        </div>
      ) : null}
      {error ? (
        <div className="fixed left-3 top-3 z-[60] flex max-w-[calc(100vw-24px)] items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-700 shadow-lift dark:text-red-300 sm:left-5 sm:top-5">
          <AlertCircle className="h-4 w-4" /> {error}
          {lastFailedPayload ? (
            <button className="inline-flex items-center gap-1 font-medium underline" onClick={retryLastUpload}>
              <RefreshCcw className="h-3.5 w-3.5" /> Retry
            </button>
          ) : null}
        </div>
      ) : null}

      {/* Lightbox */}
      {lightboxImg && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setLightboxImg(null)}>
          <button className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/40" onClick={() => setLightboxImg(null)}>
            <X className="h-5 w-5" />
          </button>
          <img src={lightboxImg} alt="Preview" className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>,
        document.body
      )}

      {/* Header */}
      <div className="relative overflow-hidden rounded-4xl border border-line bg-surface/95 p-5 shadow-lift sm:p-6 dark:shadow-glow">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-accent/15 blur-2xl" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Materials</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-subtle">
              Browse materials organized by folders. Click a folder to explore images inside.
            </p>
          </div>
          {token ? (
            <Button onClick={() => { setForm({ ...form, subcategory: activeFolder || "" }); setOpenModal(true); }}>
              <Plus className="h-4 w-4" /> Add Material
            </Button>
          ) : null}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setActiveFolder(null); }}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeCategory === cat
                ? "border-transparent bg-accent text-accent-fg shadow-soft"
                : "border-line bg-elevated/80 text-subtle hover:border-accent/30 hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" /><Skeleton className="h-48" /><Skeleton className="h-48" />
        </div>
      ) : !activeFolder ? (
        /* ===== FOLDER VIEW ===== */
        filteredFolders.length === 0 ? (
          <EmptyState
            title={searchQuery ? "No matching folders" : "No materials yet"}
            message={token ? "Add your first material to create a folder." : "No materials available yet."}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFolders.map((folder) => (
              <button
                key={folder.name}
                type="button"
                onClick={() => setActiveFolder(folder.name)}
                className="group overflow-hidden rounded-3xl border border-line bg-surface/90 text-left shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-[4/3] bg-elevated">
                  {folder.cover ? (
                    <img src={folder.cover} alt={folder.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FolderOpen className="h-12 w-12 text-subtle/40" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-bold text-ink backdrop-blur">
                      {folder.items.length} {folder.items.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-accent" />
                    <p className="font-display text-base font-bold text-ink">{folder.name}</p>
                  </div>
                  <p className="mt-1 text-xs text-subtle">
                    {folder.items.slice(0, 3).map((m) => m.name).join(", ")}
                    {folder.items.length > 3 ? ` +${folder.items.length - 3} more` : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )
      ) : (
        /* ===== INSIDE FOLDER VIEW ===== */
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveFolder(null)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-elevated/80 px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent/30"
            >
              <ArrowLeft className="h-4 w-4" /> All Folders
            </button>
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-accent" />
              <h3 className="font-display text-xl font-bold text-ink">{activeFolder}</h3>
              <span className="rounded-full bg-accent-muted px-2.5 py-0.5 text-xs font-semibold text-accent">
                {activeFolderItems.length} items
              </span>
            </div>
          </div>

          {activeFolderItems.length === 0 ? (
            <EmptyState title="Empty folder" message="No materials in this folder yet." />
          ) : (
            <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {paginatedFolderItems.map((material, index) => (
                <Card
                  key={material._id}
                  className="group overflow-hidden border-line p-0 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <button
                    type="button"
                    className="relative aspect-[16/10] w-full bg-elevated"
                    onClick={() => setLightboxImg(material.imageUrl)}
                  >
                    {material.imageUrl ? (
                      <img src={material.imageUrl} alt={material.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/55 to-transparent p-3">
                      <span className="rounded-md border border-white/30 bg-surface/90 px-2 py-1 text-xs font-semibold text-ink">
                        {material.category}
                      </span>
                    </div>
                  </button>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-ink">{material.name}</p>
                      <div className="flex items-center gap-1">
                        {token ? (
                          <button type="button" className="rounded-md p-1 text-subtle hover:bg-accent-muted hover:text-ink" onClick={() => openEditDrawer(material)}>
                            <Pencil className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-0.5 text-sm text-subtle">{material.brand}</p>
                    {material.videoUrl ? (
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-subtle">
                        <Video className="h-3.5 w-3.5" /> Video available
                      </span>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
            {folderTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button type="button" disabled={folderPage <= 1} onClick={() => setFolderPage((p) => p - 1)}
                  className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-ink transition hover:bg-elevated disabled:opacity-40">
                  Previous
                </button>
                <span className="text-sm text-subtle">
                  Page {folderPage} of {folderTotalPages}
                </span>
                <button type="button" disabled={folderPage >= folderTotalPages} onClick={() => setFolderPage((p) => p + 1)}
                  className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-ink transition hover:bg-elevated disabled:opacity-40">
                  Next
                </button>
              </div>
            )}
            </>
          )}
        </div>
      )}

      {/* Add Material Modal */}
      <Modal open={openModal} title="Add Material" onClose={() => setOpenModal(false)}>
        <form className="flex max-h-[70vh] flex-col" onSubmit={submit}>
          <div className="space-y-4 overflow-y-auto pr-1">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
            <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-subtle">Folder (subcategory)</p>
              <input
                type="text"
                list="subcategory-list"
                placeholder="e.g. Tiles, Granite, Hardware..."
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="w-full rounded-xl border border-line bg-elevated/80 px-3 py-2.5 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20 dark:bg-elevated/50"
              />
              <datalist id="subcategory-list">
                {existingSubcategories.map((s) => <option key={s} value={s} />)}
              </datalist>
              <p className="text-xs text-subtle">Type a new folder name or pick an existing one</p>
            </div>
            <UploadDropzone label="Image (required)" accept="image/*" icon={ImagePlus} file={form.image}
              onChange={(file) => {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setForm({ ...form, image: file });
                setPreviewUrl(file ? URL.createObjectURL(file) : "");
              }}
            />
            {previewUrl ? (
              <div className="overflow-hidden rounded-xl border border-line">
                <img src={previewUrl} alt="preview" className="h-36 w-full object-cover" />
              </div>
            ) : null}
            <UploadDropzone label="Video (optional)" accept="video/*" icon={UploadCloud} file={form.video}
              onChange={(file) => setForm({ ...form, video: file })}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2 border-t border-line bg-surface pt-3">
            <Button type="button" variant="ghost" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting || !form.image}>{submitting ? "Saving..." : "Save Material"}</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Drawer */}
      <div className={`fixed right-0 top-0 z-50 h-full w-full border-l border-line bg-surface p-4 shadow-lift transition-transform duration-300 sm:max-w-md sm:p-6 ${editOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">Edit Material</h3>
          <button type="button" className="text-sm font-medium text-subtle hover:text-ink" onClick={() => setEditOpen(false)}>Close</button>
        </div>
        <form className="flex h-[calc(100%-44px)] flex-col" onSubmit={submitEdit}>
          <div className="space-y-4 overflow-y-auto pr-1">
            <Input label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
            <Input label="Brand" value={editForm.brand} onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })} required />
            <Select label="Category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-subtle">Folder (subcategory)</p>
              <input
                type="text"
                list="edit-subcategory-list"
                placeholder="e.g. Tiles, Granite..."
                value={editForm.subcategory}
                onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}
                className="w-full rounded-xl border border-line bg-elevated/80 px-3 py-2.5 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20 dark:bg-elevated/50"
              />
              <datalist id="edit-subcategory-list">
                {existingSubcategories.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
            <UploadDropzone label="Update image" accept="image/*" icon={ImagePlus} file={editForm.image}
              onChange={(file) => {
                if (editPreviewUrl && editPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(editPreviewUrl);
                setEditForm({ ...editForm, image: file });
                if (file) setEditPreviewUrl(URL.createObjectURL(file));
              }}
            />
            {editPreviewUrl ? (
              <div className="overflow-hidden rounded-xl border border-line">
                <img src={editPreviewUrl} alt="edit preview" className="h-36 w-full object-cover" />
              </div>
            ) : null}
            <UploadDropzone label="Update video" accept="video/*" icon={UploadCloud} file={editForm.video}
              onChange={(file) => setEditForm({ ...editForm, video: file })}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2 border-t border-line bg-surface pt-3">
            <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
