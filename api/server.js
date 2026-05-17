import express from "express";
import { connectDB } from "./utils/db.js";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js"
import { errorHandler } from "./utils/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
//routers
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
//for testing
app.get("/", (req, res) => res.send("Hello World!"));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

connectDB()
  .then(() =>
    app.listen(port, () =>
      console.log(`server running on http://localhost:${port}`),
    ),
  )
  .catch((error) => console.log(error));
