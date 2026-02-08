import express, { Router } from "express";
import iframe from "../controllers/streaminfo.controller.js";

const iframeRouter = Router();

iframeRouter.get("/:episodeId",iframe);

export default iframeRouter