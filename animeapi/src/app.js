import express from "express";
import router from "./routes/fresh-drop.routes.js";
import episoderouter from "./routes/episode.routes.js";
import iframeRouter from "./routes/iframe.routes.js";

const app = express();

app.use("/api/hindi/recent",router);
app.use("/api/hindi/episode",episoderouter)
app.use("/api/hindi/stream/",iframeRouter)

export default app;