const ExcelJS = require("exceljs");
const asyncHandler = require("../utils/asyncHandler");
const Budget = require("../models/Budget");

const getAll = asyncHandler(async (_req, res) => {
  const budgets = await Budget.find().sort({ updatedAt: -1 });
  res.json(budgets);
});

const getById = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);
  if (!budget) {
    res.status(404);
    throw new Error("Budget not found");
  }
  res.json(budget);
});

const create = asyncHandler(async (req, res) => {
  const { projectName, items } = req.body;
  if (!projectName || !Array.isArray(items) || !items.length) {
    res.status(400);
    throw new Error("projectName and items array are required");
  }
  const budget = await Budget.create({ projectName, items });
  res.status(201).json(budget);
});

const update = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);
  if (!budget) {
    res.status(404);
    throw new Error("Budget not found");
  }
  if (req.body.projectName) budget.projectName = req.body.projectName;
  if (Array.isArray(req.body.items)) budget.items = req.body.items;
  const updated = await budget.save();
  res.json(updated);
});

const remove = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);
  if (!budget) {
    res.status(404);
    throw new Error("Budget not found");
  }
  await budget.deleteOne();
  res.json({ message: "Budget deleted" });
});

const exportBudget = asyncHandler(async (req, res) => {
  let items = [];
  let projectName = "Budget Planner";

  // Support both direct items and loading from saved budget
  if (req.params.id) {
    const budget = await Budget.findById(req.params.id);
    if (!budget) { res.status(404); throw new Error("Budget not found"); }
    items = budget.items;
    projectName = budget.projectName;
  } else {
    items = Array.isArray(req.body.materials) ? req.body.materials : [];
    projectName = req.body.projectName || "Budget Planner";
  }

  if (!items.length) {
    res.status(400);
    throw new Error("No items to export");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(projectName);

  worksheet.columns = [
    { header: "Material", key: "material", width: 24 },
    { header: "Brand", key: "brand", width: 20 },
    { header: "Quantity", key: "quantity", width: 12 },
    { header: "Price", key: "price", width: 12 },
    { header: "Total", key: "total", width: 14 }
  ];

  let grandTotal = 0;
  items.forEach((item) => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const total = quantity * price;
    grandTotal += total;
    worksheet.addRow({ material: item.name || "", brand: item.brand || "", quantity, price, total });
  });

  worksheet.addRow({});
  worksheet.addRow({ material: "Grand Total", total: grandTotal });
  worksheet.getRow(1).font = { bold: true };

  const filename = `${projectName.replace(/[^a-zA-Z0-9]/g, "-")}.xlsx`;
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  await workbook.xlsx.write(res);
  res.end();
});

module.exports = { getAll, getById, create, update, remove, exportBudget };
