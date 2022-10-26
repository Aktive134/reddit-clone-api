import { Router } from "express";
import subredditController from "./subreddit.controller";
import validateSubreddit from "../../middleware/validate-subreddit";

const subredditRouter = Router();

const { createSubreddit, getSubreddit, editSubredditHandler } = subredditController;

subredditRouter.post("/create-subreddit", validateSubreddit, createSubreddit );
subredditRouter.put("/edit-subreddit/:id", validateSubreddit, editSubredditHandler );

subredditRouter.get("/subreddit", getSubreddit);

export default subredditRouter;