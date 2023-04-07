import express from "express";
import dotenv from "dotenv";
import { setFirebase } from "./firebase_config";

dotenv.config();

import http from "http";
import cors from "cors";
import bodyParser from "body-parser";

setFirebase();

import io_socket from "./io_socket";
import io_routes from "./io_routes";
import Router from "./Routes";

// console.log(serviceAccount)

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["*"],
  },
});

io_socket.setIO(io);

app.use(cors({ origin: ["*"] }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(Router);

io_routes();

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
