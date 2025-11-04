const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const { xss } = require("express-xss-sanitizer");
const helmet = require("helmet");
const hpp = require("hpp");

const adminAuthRouter = require('./routers/adminAuthRouter');
const adminsRouter = require("./routers/adminsRouter");
const usersRouter = require("./routers/usersRouter");
const postsRouter = require("./routers/postsRouter");
const feedRouter = require("./routers/feedRouter");
const authRouter = require("./routers/authRouter");
const commentsRouter = require("./routers/commentsRouter");
const ratingRouter = require("./routers/ratingRouter");
const notificationRouter = require("./routers/notificationRouter");

dotenv.config({ path: "./config/config.env" });

const app = express();
//Set security headers
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

const adminLoginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts, try later.' }
});
app.use('/api/v1/admin/login', adminLoginLimiter);
//Prevent XSS attacks
app.use(xss());
//Prevent http param pollutions
app.use(hpp());

(async () => {
  const pool = await connectDB();
  app.locals.pool = pool;
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to ShibaSolver API",
    });
  });

  app.use('/api/v1/adminAuth', adminAuthRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/admins", adminsRouter);
  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/posts", postsRouter);
  app.use("/api/v1/feeds", feedRouter);
  app.use("/api/v1/comments", commentsRouter);
  app.use("/api/v1/ratings", ratingRouter);
  app.use("/api/v1/notifications", notificationRouter);
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
