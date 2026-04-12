import { useEffect, useState } from "react";
import { MessageCircle, Trash2 } from "lucide-react";
import { api, authHeader } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function AdminPanel() {
  const { token } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);

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

  useEffect(() => {
    load();
  }, []);

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
    if (status === "converted") return "bg-emerald-100 text-emerald-700";
    if (status === "contacted") return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-sky-100 bg-[#f4faff] p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Control Room</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Admin Panel</h2>
        <p className="mt-1 text-sm text-slate-600">Manage inventory and portfolios with protected actions.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-[#f8fdff]">
          <h3 className="mb-3 font-semibold">Material Inventory</h3>
          <div className="space-y-2">
            {materials.map((m) => (
              <div key={m._id} className="flex items-center justify-between rounded-2xl border border-sky-100 bg-[#f8fdff] px-3 py-2">
                <p className="text-sm">
                  {m.name} <span className="text-slate-500">({m.brand})</span>
                </p>
                <Button variant="ghost" onClick={() => deleteItem("materials", m._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
        <Card className="bg-[#f8fdff]">
          <h3 className="mb-3 font-semibold">Project Records</h3>
          <div className="space-y-2">
            {projects.map((p) => (
              <div key={p._id} className="flex items-center justify-between rounded-2xl border border-sky-100 bg-[#f8fdff] px-3 py-2">
                <p className="text-sm">{p.name}</p>
                <Button variant="ghost" onClick={() => deleteItem("projects", p._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="bg-[#f8fdff]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Meet Designer Requests</h3>
          <span className="rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white">
            {leads.length} requests
          </span>
        </div>
        <div className="space-y-2">
          {leads.map((lead) => (
            <div key={lead._id} className="rounded-2xl border border-sky-100 bg-[#f8fdff] p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-800">{lead.name}</p>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(lead.status)}`}>
                  {lead.status || "new"}
                </span>
              </div>
              <p className="mt-1 text-slate-600">
                {lead.phone} • {lead.city}
              </p>
              <p className="text-xs text-slate-500">
                WhatsApp: {lead.whatsappOptIn ? "Yes" : "No"} • {new Date(lead.createdAt).toLocaleString()}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  value={lead.status || "new"}
                  onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                  className="rounded-full border border-sky-100 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="converted">converted</option>
                </select>
                <button
                  onClick={() => openWhatsApp(lead)}
                  className="inline-flex items-center gap-1 rounded-full border border-sky-100 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Open WhatsApp
                </button>
              </div>
            </div>
          ))}
          {!leads.length ? <p className="text-sm text-slate-500">No designer requests yet.</p> : null}
        </div>
      </Card>
    </div>
  );
}
