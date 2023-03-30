import express from "express";
import check from "./src/functions/check";

const Router = express.Router();

Router.get("/", check);

export default Router;
