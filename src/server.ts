import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db";
import "colors";
import { errorHandler } from "./middleware/errorMiddleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "./config/passport";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import recommendRoutes from "./routes/recommends";

const PORT = process.env.PORT || 5400;

const app = express();

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cookies
app.use(cookieParser());

// Basic security
app.use(helmet());

// Cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ status: "healthy" });
});

// Passport / Auth
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recommends", recommendRoutes);

app.get("/", (_, res) => {
  res.status(200).json({ message: "Welcome to the recommendable API" });
});

// Error handler
app.use(errorHandler);

// DB Connection
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}\n`
          .yellow,
        "-----------------------------------------------------------".yellow
      );
    });
  })
  .catch((err) => {
    console.error(
      `Error connecting to MongoDB: ${err.message}`.red.underline.bold
    );
    process.exit(1);
  });
