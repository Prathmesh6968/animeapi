import episodeController from "../controllers/episodes.controller.js";
import express, { Router } from "express";

const episoderouter = Router();

episoderouter.get("/:episodeId",episodeController)

export default episoderouter