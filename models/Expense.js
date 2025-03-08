const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  recurring: { type: Boolean, default: false }, // ✅ NEW FIELD
});

module.exports = mongoose.model("Expense", ExpenseSchema);
