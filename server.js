const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const adminsRouter = require("./routers/admins_router");
const usersRouter = require("./routers/users_router");
const postsRouter = require("./routers/posts_router");
const feedRouter = require("./routers/feed_router");
const authRouter = require("./routers/auth_router");

dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

(async () => {
  const pool = await connectDB();
  app.locals.pool = pool;
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to ShibaSolver API",
    });
  });

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/admins", adminsRouter);
  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/posts", postsRouter);
  app.use("/api/v1/feeds", feedRouter);


  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
