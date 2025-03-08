require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");
const incometrack = require("./routes/income");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Correct MongoDB Connection (No Deprecated Options)
mongoose
  .connect(process.env.MONGO_URI) // Use just MONGO_URI
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incometrack);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
