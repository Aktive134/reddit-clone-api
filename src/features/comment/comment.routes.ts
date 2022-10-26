import { Router } from "express";
import commentController from "./comment.controller";

const commentRouter = Router();

const { createCommentHandler, getCommentsHandler } = commentController

commentRouter.post("/create-comment", createCommentHandler );
commentRouter.get("/comments", getCommentsHandler );


export default commentRouter;