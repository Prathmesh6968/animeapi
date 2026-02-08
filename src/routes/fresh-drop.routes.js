import express, { Router } from "express";
import freshdrop from "../controllers/fresh-drop.controller.js";

const router = Router();

router.get("/",freshdrop)

export default router