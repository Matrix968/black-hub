import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  initializePaystackPayment,
  verifyPaystackPayment,
} from "./controllers/paymentControllers.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with secure origin validation
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

// System Diagnostics Route
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({
      status: "online",
      system: "BLACK HUB Core Engine",
      epoch: Date.now(),
    });
});

// Commerce & Transaction Routes
app.post("/api/payments/paystack/initialize", initializePaystackPayment);
app.get("/api/payments/paystack/verify/:reference", verifyPaystackPayment);

// Standardized Global Error Interceptor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({
      success: false,
      message: "A critical backend system intercept occurred.",
    });
});

app.listen(PORT, () => {
  console.log(`Server executing safely on port: ${PORT}`);
});
