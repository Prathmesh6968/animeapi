import express from "express";
import router from "./routes/fresh-drop.routes.js";
import episoderouter from "./routes/episode.routes.js";
import iframeRouter from "./routes/iframe.routes.js";
import searchRouter from "./routes/search.routes.js";

const app = express();

app.get("/",(req,res)=>{
  res.send("Api Is Live 🖕")
})
app.use("/api/hindi/recent",router);
app.use("/api/hindi/episode",episoderouter)
app.use("/api/hindi/stream/",iframeRouter)
app.use("/api/hindi/search",searchRouter)

export default app;
