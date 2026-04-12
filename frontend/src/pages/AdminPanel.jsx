import { useEffect, useState } from "react";
import { ImagePlus, MessageCircle, Star, Trash2 } from "lucide-react";
import { api, authHeader } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";

const solutionSlugs = [
  { value: "modular-kitchen", label: "Modular Kitchen" },
  { value: "storage-wardrobe", label: "Storage & Wardrobe" },
  { value: "living-space", label: "Living Space" },
  { value: "tv-units", label: "TV Units" },
  { value: "lights", label: "Lights" },
  { value: "wall-paint", label: "Wall Paint" },
  { value: "bathroom", label: "Bathroom" },
  { value: "kids-bedroom", label: "Kids Bedroom" }
];

export default function AdminPanel() {
  const { token } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [gallerySlug, setGallerySlug] = useState("modular-kitchen");
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryCaption, setGalleryCaption] = useState("");
  const [galleryIsHero, setGalleryIsHero] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const load = async () => {
    const [mRes, pRes, lRes] = await Promise.all([
      api.get("/materials"),
      api.get("/projects"),
      api.get("/leads", authHeader(token))
    ]);
    setMaterials(mRes.data);
    setProjects(pRes.data);
    setLeads(lRes.data);
  };

  const loadGallery = async () => {
    const { data } = await api.get(`/solution-gallery/${gallerySlug}`);
    setGalleryImages(data);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    loadGallery();
  }, [gallerySlug]);

  const deleteItem = async (type, id) => {
    await api.delete(`/${type}/${id}`, authHeader(token));
    load();
  };

  const updateLeadStatus = async (id, status) => {
    await api.put(`/leads/${id}/status`, { status }, authHeader(token));
    load();
  };

  const openWhatsApp = (lead) => {
    const number = String(lead.phone || "").replace(/[^\d]/g, "");
    const text = encodeURIComponent(
      `Hello ${lead.name}, this is J & J Infra regarding your designer request for ${lead.city}.`
    );
    window.open(`https://wa.me/${number}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const statusBadgeClass = (status) => {
    if (status === "converted") return "bg-accent-muted text-accent dark:text-accent";
    if (status === "contacted") return "bg-orange-500/15 text-orange-800 dark:text-orange-200";
    return "bg-elevated text-subtle";
  };

  const uploadGalleryImage = async (e) => {
    e.preventDefault();
    if (!galleryFile) return;
    setGalleryUploading(true);
    const fd = new FormData();
    fd.append("image", galleryFile);
    fd.append("slug", gallerySlug);
    fd.append("caption", galleryCaption);
    fd.append("isHero", String(galleryIsHero));
    try {
      await api.post("/solution-gallery", fd, authHeader(token));
      setGalleryFile(null);
      setGalleryCaption("");
      setGalleryIsHero(false);
      loadGallery();
    } catch {
      // silent
    } finally {
      setGalleryUploading(false);
    }
  };

  const deleteGalleryImage = async (id) => {
    await api.delete(`/solution-gallery/${id}`, authHeader(token));
    loadGallery();
  };

  const toggleHero = async (img) => {
    await api.put(`/solution-gallery/${img._id}`, { isHero: img.isHero ? "false" : "true" }, authHeader(token));
    loadGallery();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-line bg-gradient-to-br from-surface to-elevated/50 p-6 shadow-lift dark:to-elevated/30">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Control Room</p>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-ink">Admin Panel</h2>
        <p className="mt-1 text-sm leading-relaxed text-subtle">Manage inventory and portfolios with protected actions.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-display font-bold text-ink">Material Inventory</h3>
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {materials.map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between rounded-2xl border border-line bg-elevated/40 px-3 py-2 dark:bg-elevated/25"
              >
                <p className="text-sm text-ink">
                  {m.name} <span className="text-subtle">({m.brand})</span>
                </p>
                <Button variant="ghost" onClick={() => deleteItem("materials", m._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-3 font-display font-bold text-ink">Project Records</h3>
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {projects.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between rounded-2xl border border-line bg-elevated/40 px-3 py-2 dark:bg-elevated/25"
              >
                <p className="text-sm text-ink">{p.name}</p>
                <Button variant="ghost" onClick={() => deleteItem("projects", p._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display font-bold text-ink">Meet Designer Requests</h3>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-fg shadow-soft">
            {leads.length} requests
          </span>
        </div>
        <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
          {leads.map((lead) => (
            <div key={lead._id} className="rounded-2xl border border-line bg-elevated/40 p-3 text-sm dark:bg-elevated/25">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-ink">{lead.name}</p>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(lead.status)}`}>
                  {lead.status || "new"}
                </span>
              </div>
              <p className="mt-1 text-subtle">
                {lead.phone} • {lead.city}
              </p>
              <p className="text-xs text-subtle">
                WhatsApp: {lead.whatsappOptIn ? "Yes" : "No"} • {new Date(lead.createdAt).toLocaleString()}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  value={lead.status || "new"}
                  onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink"
                >
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="converted">converted</option>
                </select>
                <button
                  type="button"
                  onClick={() => openWhatsApp(lead)}
                  className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-accent-muted"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Open WhatsApp
                </button>
              </div>
            </div>
          ))}
          {!leads.length ? <p className="text-sm text-subtle">No designer requests yet.</p> : null}
        </div>
      </Card>
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display font-bold text-ink">Solution Gallery Manager</h3>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-fg shadow-soft">
            {galleryImages.length} images
          </span>
        </div>
        <p className="mb-4 text-sm text-subtle">
          Upload your own images for each interior solution category. These replace the default placeholder images on the solution pages.
        </p>

        <div className="mb-4">
          <Select label="Solution Category" value={gallerySlug} onChange={(e) => setGallerySlug(e.target.value)}>
            {solutionSlugs.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
        </div>

        <form onSubmit={uploadGalleryImage} className="mb-5 rounded-2xl border border-dashed border-line bg-elevated/30 p-4 dark:bg-elevated/20">
          <p className="mb-3 text-sm font-semibold text-ink">Add image to {solutionSlugs.find((s) => s.value === gallerySlug)?.label}</p>
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line bg-surface p-3 transition hover:border-accent/35">
              <ImagePlus className="h-5 w-5 text-accent" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">Click to select image</p>
                <p className="truncate text-xs text-subtle">{galleryFile?.name || "No file selected"}</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setGalleryFile(e.target.files?.[0] || null)} />
            </label>
            <input
              type="text"
              placeholder="Caption (optional)"
              value={galleryCaption}
              onChange={(e) => setGalleryCaption(e.target.value)}
              className="w-full rounded-xl border border-line bg-elevated/80 px-3 py-2.5 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20 dark:bg-elevated/50"
            />
            <label className="flex items-center gap-2 text-sm text-subtle">
              <input type="checkbox" checked={galleryIsHero} onChange={(e) => setGalleryIsHero(e.target.checked)} />
              Set as hero image (main banner)
            </label>
            <Button type="submit" disabled={!galleryFile || galleryUploading} className="w-full">
              {galleryUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>
        </form>

        {galleryImages.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((img) => (
              <div key={img._id} className="group relative overflow-hidden rounded-2xl border border-line bg-elevated/40 dark:bg-elevated/25">
                <div className="aspect-[4/3] bg-elevated">
                  <img src={img.imageUrl} alt={img.caption} className="h-full w-full object-cover" />
                </div>
                {img.isHero && (
                  <div className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-fg shadow-soft">
                    Hero
                  </div>
                )}
                <div className="p-3">
                  {img.caption && <p className="text-xs text-subtle mb-2">{img.caption}</p>}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleHero(img)}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
                        img.isHero
                          ? "border-accent/30 bg-accent-muted text-accent"
                          : "border-line bg-surface text-subtle hover:text-ink"
                      }`}
                    >
                      <Star className={`h-3 w-3 ${img.isHero ? "fill-accent" : ""}`} />
                      {img.isHero ? "Hero" : "Set hero"}
                    </button>
                    <Button variant="ghost" onClick={() => deleteGalleryImage(img._id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-subtle">No images uploaded for this category yet. Default placeholders will be shown.</p>
        )}
      </Card>
    </div>
  );
}
