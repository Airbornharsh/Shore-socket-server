import express from "express";
import check from "./src/functions/check";
const {
  SendPushNotification,
} = require("./src/controllers/push-notifications-controller");

const Router = express.Router();

Router.get("/", check);
Router.post("/push-notification", SendPushNotification);

export default Router;
