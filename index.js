import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is Running on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error.message);
  });

mongoose.set("useFindAndModify", false);
