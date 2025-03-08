const express = require("express");
const Income = require("../models/Income");
const authenticateUser = require("../middleware/auth");
const router = express.Router();

// ✅ Add Income
router.post("/add", authenticateUser, async (req, res) => {
  try {
    const { source, amount, date } = req.body;
    const newIncome = new Income({
      user: req.user.userId,
      source,
      amount,
      date: date ? new Date(date) : new Date(),
    });
    await newIncome.save();
    res.json({ message: "Income added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error adding income" });
  }
});

// ✅ Get All Income
router.get("/all", authenticateUser, async (req, res) => {
  try {
    const income = await Income.find({ user: req.user.userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ error: "Error fetching income" });
  }
});

module.exports = router;
