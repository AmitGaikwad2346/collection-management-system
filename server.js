const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const httpErrors = require("http-errors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const authRoutes = require("./routes/auth.route");
const collectionRoutes = require("./routes/collection.route");
const recommendationRoutes = require("./routes/recommendation.route");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

// Import and execute DB connection
dotenv.config();
connectDB();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/collection", collectionRoutes);
app.use("/api/recommendation", recommendationRoutes);

// Swagger Docs Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Handle undefined routes
app.use((req, res, next) => {
  next(
    httpErrors.NotFound(`Route ${req.method} ${req.originalUrl} - Not Found`)
  );
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
