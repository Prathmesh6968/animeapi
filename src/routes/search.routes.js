import searchController from "../controllers/search.controller.js";
import express, { Router } from "express";

const searchRouter = Router();

searchRouter.get("/",searchController)

export default searchRouter