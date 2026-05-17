import express from "express";
import { connectDB } from "./utils/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Hello World!"));

connectDB()
  .then(() =>
    app.listen(port, () =>
      console.log(`server running on http://localhost:${port}`),
    ),
  )
  .catch((error) => console.log(error));
