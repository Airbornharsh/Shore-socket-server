import express from "express";
import check from "./src/functions/check";

const Router = express.Router();

Router.post("/", check);

export default Router;
