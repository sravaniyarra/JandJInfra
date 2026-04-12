import { useEffect, useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { api, authHeader } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { Table, TD, TH, THead } from "../components/ui/Table";

export default function BudgetPlannerPage() {
  const { token } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/materials").then((res) => {
      setMaterials(res.data);
      if (res.data[0]) setMaterialId(res.data[0]._id);
    });
  }, []);

  const addItem = () => {
    const found = materials.find((m) => m._id === materialId);
    const qty = Number(quantity);
    const prc = Number(price);
    if (!found || qty <= 0 || prc <= 0) return;
    setRows((prev) => [...prev, { name: found.name, brand: found.brand, quantity: qty, price: prc }]);
    setQuantity("");
    setPrice("");
  };

  const total = useMemo(
    () => rows.reduce((sum, row) => sum + Number(row.quantity) * Number(row.price), 0),
    [rows]
  );

  const exportExcel = async () => {
    const response = await api.post(
      "/budget/export-budget",
      { materials: rows },
      { ...authHeader(token), responseType: "blob" }
    );
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "budget-planner.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-sky-100 bg-[#f4faff] p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Cost Studio</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Budget Planner</h2>
        <p className="mt-1 text-sm text-slate-600">Build polished estimates with a clean planning workflow.</p>
      </div>

      <Card className="bg-[#f8fdff]">
        <div className="grid gap-4 md:grid-cols-4">
          <Select label="Material" value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
            {materials.map((m) => (
              <option value={m._id} key={m._id}>
                {m.name} ({m.brand})
              </option>
            ))}
          </Select>
          <Input label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <Input label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <div className="flex items-end">
            <Button className="w-full" onClick={addItem}>
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>
      </Card>

      <Table>
        <table className="w-full">
          <THead>
            <tr>
              <TH>Material</TH>
              <TH>Brand</TH>
              <TH>Quantity</TH>
              <TH>Price</TH>
              <TH>Total</TH>
            </tr>
          </THead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, i) => (
              <tr key={`${row.name}-${i}`} className="hover:bg-slate-50">
                <TD>{row.name}</TD>
                <TD>{row.brand}</TD>
                <TD>{row.quantity}</TD>
                <TD>{row.price}</TD>
                <TD>{row.quantity * row.price}</TD>
              </tr>
            ))}
            <tr className="bg-slate-50">
              <TD>
                <span className="font-semibold">Grand Total</span>
              </TD>
              <TD>-</TD>
              <TD>-</TD>
              <TD>-</TD>
              <TD>
                <span className="font-semibold">{total}</span>
              </TD>
            </tr>
          </tbody>
        </table>
      </Table>

      <Button onClick={exportExcel} disabled={!rows.length || !token}>
        <Download className="h-4 w-4" />
        Export to Excel
      </Button>
    </div>
  );
}
