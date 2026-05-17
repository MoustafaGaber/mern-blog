import express from "express";
import { connectDB } from "./utils/db.js";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
//routers
app.use("/api/users", userRoute);
//for testing
app.get("/", (req, res) => res.send("Hello World!"));

connectDB()
  .then(() =>
    app.listen(port, () =>
      console.log(`server running on http://localhost:${port}`),
    ),
  )
  .catch((error) => console.log(error));
