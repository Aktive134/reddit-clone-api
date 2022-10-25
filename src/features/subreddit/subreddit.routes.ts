import { Router } from "express";
import subredditController from "./subreddit.controller";
import validateSubreddit from "../../middleware/validate-subreddit";

const subredditRouter = Router();

const { createSubreddit } = subredditController;

subredditRouter.post("/create-subreddit", validateSubreddit, createSubreddit );

export default subredditRouter;