import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Download, FileSpreadsheet, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { api, authHeader } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Skeleton from "../components/ui/Skeleton";
import { Table, TD, TH, THead } from "../components/ui/Table";

export default function BudgetPlannerPage() {
  const { token } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [rows, setRows] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [savedBudgets, setSavedBudgets] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editRow, setEditRow] = useState({ quantity: "", price: "" });

  useEffect(() => {
    api.get("/materials").then((res) => {
      setMaterials(res.data);
      if (res.data[0]) setMaterialId(res.data[0]._id);
    });
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data } = await api.get("/budget", authHeader(token));
      setSavedBudgets(data);
    } catch { /* silent */ }
    setLoadingHistory(false);
  };

  const addItem = () => {
    const found = materials.find((m) => m._id === materialId);
    const qty = Number(quantity);
    const prc = Number(price);
    if (!found || qty <= 0 || prc <= 0) return;
    setRows((prev) => [...prev, { name: found.name, brand: found.brand, quantity: qty, price: prc }]);
    setQuantity("");
    setPrice("");
  };

  const removeRow = (index) => setRows((prev) => prev.filter((_, i) => i !== index));

  const startEditRow = (index) => {
    setEditingRowIndex(index);
    setEditRow({ quantity: String(rows[index].quantity), price: String(rows[index].price) });
  };

  const saveEditRow = () => {
    if (editingRowIndex === null) return;
    const qty = Number(editRow.quantity);
    const prc = Number(editRow.price);
    if (qty <= 0 || prc <= 0) return;
    setRows((prev) => prev.map((r, i) => i === editingRowIndex ? { ...r, quantity: qty, price: prc } : r));
    setEditingRowIndex(null);
  };

  const total = useMemo(() => rows.reduce((sum, r) => sum + r.quantity * r.price, 0), [rows]);

  const saveBudget = async () => {
    if (!projectName.trim() || !rows.length) return;
    setSaving(true);
    try {
      if (editingBudgetId) {
        await api.put(`/budget/${editingBudgetId}`, { projectName, items: rows }, authHeader(token));
        setToast("Budget updated");
      } else {
        await api.post("/budget", { projectName, items: rows }, authHeader(token));
        setToast("Budget saved");
      }
      loadHistory();
      setTimeout(() => setToast(""), 2400);
    } catch { setToast("Failed to save"); setTimeout(() => setToast(""), 2400); }
    setSaving(false);
  };

  const loadBudget = (budget) => {
    setEditingBudgetId(budget._id);
    setProjectName(budget.projectName);
    setRows(budget.items.map((i) => ({ name: i.name, brand: i.brand, quantity: i.quantity, price: i.price })));
  };

  const deleteBudget = async (id) => {
    await api.delete(`/budget/${id}`, authHeader(token));
    if (editingBudgetId === id) { setEditingBudgetId(null); setProjectName(""); setRows([]); }
    loadHistory();
  };

  const exportExcel = async (budgetId) => {
    let response;
    if (budgetId) {
      response = await api.get(`/budget/${budgetId}/export`, { ...authHeader(token), responseType: "blob" });
    } else {
      response = await api.post("/budget/export-budget", { materials: rows, projectName }, { ...authHeader(token), responseType: "blob" });
    }
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(projectName || "budget").replace(/[^a-zA-Z0-9]/g, "-")}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const startNew = () => { setEditingBudgetId(null); setProjectName(""); setRows([]); };

  return (
    <div className="space-y-6">
      {toast ? (
        <div className="fixed right-3 top-3 z-[60] flex max-w-[calc(100vw-24px)] items-center gap-2 rounded-xl border border-accent/30 bg-accent-muted px-4 py-2 text-sm font-medium text-ink shadow-lift sm:right-5 sm:top-5">
          <CheckCircle2 className="h-4 w-4" /> {toast}
        </div>
      ) : null}

      <div className="rounded-4xl border border-line bg-gradient-to-br from-surface to-elevated/50 p-6 shadow-lift dark:to-elevated/30">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Cost Studio</p>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-ink">Budget Planner</h2>
        <p className="mt-1 text-sm leading-relaxed text-subtle">
          Build estimates, save them with project names, and revisit or edit anytime.
        </p>
      </div>

      {/* Project name + new button */}
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Project Name"
              placeholder="e.g. Sharma Residence - Kitchen"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          {editingBudgetId && (
            <Button variant="ghost" onClick={startNew}>
              <Plus className="h-4 w-4" /> New Budget
            </Button>
          )}
        </div>
        {editingBudgetId && (
          <p className="mt-2 text-xs text-subtle">
            Editing saved budget. Changes will update the existing record.
          </p>
        )}
      </Card>

      {/* Add item row */}
      <Card>
        <div className="grid gap-4 md:grid-cols-4">
          <Select label="Material" value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
            {materials.map((m) => (
              <option value={m._id} key={m._id}>{m.name} ({m.brand})</option>
            ))}
          </Select>
          <Input label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <Input label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <div className="flex items-end">
            <Button className="w-full" onClick={addItem}><Plus className="h-4 w-4" /> Add Item</Button>
          </div>
        </div>
      </Card>

      {/* Budget table */}
      <Table>
        <table className="w-full">
          <THead>
            <tr>
              <TH>Material</TH>
              <TH>Brand</TH>
              <TH>Quantity</TH>
              <TH>Price</TH>
              <TH>Total</TH>
              <TH>Actions</TH>
            </tr>
          </THead>
          <tbody className="divide-y divide-line">
            {rows.map((row, i) => (
              <tr key={`${row.name}-${i}`} className="transition hover:bg-accent-muted/30">
                <TD>{row.name}</TD>
                <TD>{row.brand}</TD>
                <TD>
                  {editingRowIndex === i ? (
                    <input type="number" value={editRow.quantity} onChange={(e) => setEditRow({ ...editRow, quantity: e.target.value })}
                      className="w-20 rounded-lg border border-line bg-elevated/80 px-2 py-1 text-sm text-ink outline-none focus:border-accent/50" />
                  ) : row.quantity}
                </TD>
                <TD>
                  {editingRowIndex === i ? (
                    <input type="number" value={editRow.price} onChange={(e) => setEditRow({ ...editRow, price: e.target.value })}
                      className="w-20 rounded-lg border border-line bg-elevated/80 px-2 py-1 text-sm text-ink outline-none focus:border-accent/50" />
                  ) : row.price}
                </TD>
                <TD>{editingRowIndex === i ? Number(editRow.quantity) * Number(editRow.price) || 0 : row.quantity * row.price}</TD>
                <TD>
                  <div className="flex items-center gap-1">
                    {editingRowIndex === i ? (
                      <>
                        <button type="button" onClick={saveEditRow} className="rounded-md p-1 text-accent hover:bg-accent-muted"><CheckCircle2 className="h-4 w-4" /></button>
                        <button type="button" onClick={() => setEditingRowIndex(null)} className="rounded-md p-1 text-subtle hover:bg-elevated"><X className="h-4 w-4" /></button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => startEditRow(i)} className="rounded-md p-1 text-subtle hover:bg-accent-muted hover:text-ink"><Pencil className="h-3.5 w-3.5" /></button>
                        <button type="button" onClick={() => removeRow(i)} className="rounded-md p-1 text-subtle hover:bg-red-500/10 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                      </>
                    )}
                  </div>
                </TD>
              </tr>
            ))}
            <tr className="bg-elevated/60 dark:bg-elevated/40">
              <TD><span className="font-semibold">Grand Total</span></TD>
              <TD>-</TD><TD>-</TD><TD>-</TD>
              <TD><span className="font-semibold">₹{total.toLocaleString("en-IN")}</span></TD>
              <TD>-</TD>
            </tr>
          </tbody>
        </table>
      </Table>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={saveBudget} disabled={!rows.length || !projectName.trim() || saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving..." : editingBudgetId ? "Update Budget" : "Save Budget"}
        </Button>
        <Button variant="ghost" onClick={() => exportExcel(null)} disabled={!rows.length}>
          <Download className="h-4 w-4" /> Export Excel
        </Button>
      </div>

      {/* Saved budgets history */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">Budget History</h3>
          <span className="rounded-full bg-accent-muted px-2.5 py-0.5 text-xs font-semibold text-accent">
            {savedBudgets.length} saved
          </span>
        </div>
        {loadingHistory ? (
          <div className="space-y-3"><Skeleton className="h-16" /><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
        ) : savedBudgets.length === 0 ? (
          <p className="text-sm text-subtle">No saved budgets yet. Create one above and save it.</p>
        ) : (
          <div className="space-y-2">
            {savedBudgets.map((budget) => (
              <div
                key={budget._id}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                  editingBudgetId === budget._id
                    ? "border-accent/40 bg-accent-muted/30"
                    : "border-line bg-elevated/30 hover:border-accent/25 hover:bg-accent-muted/20 dark:bg-elevated/20"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-accent shrink-0" />
                    <p className="font-semibold text-ink truncate">{budget.projectName}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-subtle">
                    {budget.items.length} items • ₹{budget.grandTotal.toLocaleString("en-IN")} • {new Date(budget.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <button type="button" onClick={() => loadBudget(budget)}
                    className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink transition hover:border-accent/30 hover:bg-accent-muted">
                    <Pencil className="inline h-3 w-3 mr-1" />Edit
                  </button>
                  <button type="button" onClick={() => exportExcel(budget._id)}
                    className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink transition hover:border-accent/30 hover:bg-accent-muted">
                    <Download className="inline h-3 w-3 mr-1" />Excel
                  </button>
                  <button type="button" onClick={() => deleteBudget(budget._id)}
                    className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-500/30 hover:bg-red-500/10">
                    <Trash2 className="inline h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
