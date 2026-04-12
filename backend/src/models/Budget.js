const mongoose = require("mongoose");

const budgetItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, default: "" },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const budgetSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true, trim: true },
    items: [budgetItemSchema],
    grandTotal: { type: Number, default: 0 }
  },
  { timestamps: true }
);

budgetSchema.pre("save", function (next) {
  this.grandTotal = this.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  next();
});

module.exports = mongoose.model("Budget", budgetSchema);
