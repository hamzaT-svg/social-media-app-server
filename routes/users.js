import express from "express";
import { signIn, signUp } from "../controllers/users.js";

const Router = express.Router();

Router.post("/signup", signUp);
Router.post("/signin", signIn);

export default Router;
