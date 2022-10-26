import { Router } from "express";
import postController from "./post.controller";
import validatePost from "../../middleware/validate-post";

const postRouter = Router();

const { createPostHandler, getPostHandler } = postController;

postRouter.post("/create-post", validatePost, createPostHandler );
postRouter.get("/posts",getPostHandler );

export default postRouter;