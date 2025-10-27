const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");


const adminsRouter = require("./routers/adminsRouter");
const usersRouter = require("./routers/usersRouter");
const postsRouter = require("./routers/postsRouter");
const feedRouter = require("./routers/feedRouter");
const authRouter = require("./routers/authRouter");
const commentsRouter = require("./routers/commentsRouter");
const ratingRouter = require("./routers/ratingRouter");

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

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "ShibaSolver API",
      version: "1.0.0",
      description: "API documentation for ShibaSolver"
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 5000}` }
    ],
  },
  apis: ["./routers/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));  

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
  app.use("/api/v1/comments", commentsRouter);
  app.use("/api/v1/ratings", ratingRouter);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
