import Express from "express";
import cors from "cors";
import config from "./config";
import apiRouter from "./routes";

export const app = Express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(Express.json());

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
export default app;
