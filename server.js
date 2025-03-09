require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");
const incometrack = require("./routes/income");

const app = express();
app.use(express.json());

// ✅ Secure CORS Configuration (Allow only Vercel frontend)
const allowedOrigins = [
  "https://expense-tracker-frontend-zeta-blush.vercel.app",
  "https://expense-tracker-frontend-cfl729qrv.vercel.app"
];

app.use(
  cors({
      origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
          } else {
              callback(new Error("Not allowed by CORS"));
          }
      },
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
  })
);


// ✅ Correct MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incometrack);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
