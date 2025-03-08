const express = require("express");
const Expense = require("../models/Expense");
const authenticateUser = require("../middleware/auth");
const router = express.Router();

// ✅ Add Expense
router.post("/add", authenticateUser, async (req, res) => {
  try {
    const { category, amount, date } = req.body;
    const newExpense = new Expense({
      user: req.user.userId,
      category,
      amount,
      date: date ? new Date(date) : new Date(),
    });
    await newExpense.save();
    res.json({ message: "Expense added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error adding expense" });
  }
});

// ✅ Get All Expenses (Sorted by Date - Latest First)
router.get("/all", authenticateUser, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

// ✅ Edit Expense
router.put("/edit/:id", authenticateUser, async (req, res) => {
  try {
    const { category, amount, date } = req.body;
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { category, amount, date: date ? new Date(date) : new Date() },
      { new: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json({ message: "Expense updated successfully!", updatedExpense });
  } catch (error) {
    res.status(500).json({ error: "Error updating expense" });
  }
});

// ✅ Delete Expense
router.delete("/delete/:id", authenticateUser, async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json({ message: "Expense deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting expense" });
  }
});

// ✅ Get Total Expenses for Budget Tracking
router.get("/total", authenticateUser, async (req, res) => {
  try {
    const totalSpent = await Expense.aggregate([
      { $match: { user: req.user.userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    res.json({ total: totalSpent[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: "Error calculating total expenses" });
  }
});


// ✅ Auto-Generate Recurring Expenses Monthly
router.post("/recurring/add", authenticateUser, async (req, res) => {
  try {
    const { category, amount } = req.body;
    const newExpense = new Expense({
      user: req.user.userId,
      category,
      amount,
      recurring: true, // ✅ Mark as recurring
    });
    await newExpense.save();
    res.json({ message: "Recurring expense added!" });
  } catch (error) {
    res.status(500).json({ error: "Error adding recurring expense" });
  }
});

// ✅ Automatically Add Recurring Expenses (Run Monthly)
const addRecurringExpenses = async () => {
  try {
    const recurringExpenses = await Expense.find({ recurring: true });
    const today = new Date();

    for (const exp of recurringExpenses) {
      const newExpense = new Expense({
        user: exp.user,
        category: exp.category,
        amount: exp.amount,
        date: today,
        recurring: true,
      });
      await newExpense.save();
    }
    console.log("✅ Recurring expenses added for this month!");
  } catch (error) {
    console.error("❌ Error adding recurring expenses:", error);
  }
};

// Schedule recurring expenses every 1st of the month
const cron = require("node-cron");
cron.schedule("0 0 1 * *", addRecurringExpenses); // Runs on the 1st of every month


module.exports = router;

