import express from "express";
import "dotenv/config";
import  connectDB  from "./config/database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import ticketRouter from "./routes/ticket.routes.js"
import commentRouter from "./routes/comment.routes.js"

const app = express(); 

connectDB()

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("server is running");
});

//router handler

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/ticket", ticketRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
