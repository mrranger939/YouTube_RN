import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import routes from "./routes/index.js";

const app = express();

const localFrontend = "http://localhost:5173";
const frontend = `http://${config.IP_ADD}:5173`;

app.use(
  cors({
    origin: [frontend, localFrontend],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

export default app;
