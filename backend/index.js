import "dotenv/config";
import express from "express";
import cors from "cors";
import tickerRouter from "./routes/ticker.js";

const app = express();

app.use(cors({ origin: "*" }));

app.use("/api/ticker", tickerRouter);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
