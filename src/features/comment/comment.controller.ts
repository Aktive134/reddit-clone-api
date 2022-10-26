import { Request, Response, NextFunction } from 'express'
import ApplicationError from '../../common/error-handler/ApplicationError'
import Comment from './comment.model'
import UserData from '../auth/auth.model'
import Post from '../post/post.model'
import Constant from '../../constant'

const Messages = Constant.messages

class CommentController {
  async createCommentHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, postId } = req.body
      const { email } = res.locals.payload
      const iUser = await UserData.findOne({ email })
      const userId = iUser?._id

      const comment = new Comment({
        text,
        _creator: userId,
        _post: postId,
      })
      const newComment = await comment.save()
      const commentOnPost = await Post.findByIdAndUpdate(postId, {
        $push: { _comments: newComment._id },
      })
      res.status(201).json({
        message: Messages.commentCreated,
        data: {
          text: newComment.text,
          _id: newComment._id,
          _creator: userId,
          _post: commentOnPost?._id,
        },
        status: true,
      })
    } catch (error: any) {
      return next(new ApplicationError(error.message))
    }
  }

  async getCommentsHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await Comment.find({}).populate([
        {
          path: '_creator',
          select: 'username createdAt -_id',
        },
        { path: '_post', select: 'title text _id', 'populate': {path: '_creator', select: 'username createdAt -_id'}}
      ])
      res.status(200).json({
        message: 'Successful',
        data: {
          comment,
        },
        status: true,
      })
    } catch (error: any) {
      return next(new ApplicationError(error.message))
    }
  }
}

export default new CommentController()
