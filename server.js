const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
require("colors");
// const { errorHandler } = require('./middleware/errorMiddleware');

const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Routes

// app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(
      PORT,
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}\n`
          .yellow,
        "-----------------------------------------------------------".yellow
      )
    );
  })
  .catch((err) => {
    console.error(
      `Error connecting to MongoDB: ${err.message}`.red.underline.bold
    );
    process.exit(1);
  });
