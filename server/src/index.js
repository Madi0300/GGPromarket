import { createServer } from "node:http";
import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.PORT) || 4000;
const host = process.env.HOST || "0.0.0.0";

createServer(app).listen(port, host, () => {
  console.log(`⚡️ GGPromarket API is running on http://${host}:${port}`);
});
