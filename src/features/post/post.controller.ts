import { Request, Response, NextFunction } from 'express'
import ApplicationError from '../../common/error-handler/ApplicationError'
import UserData from '../auth/auth.model'
import Subreddit from '../subreddit/subreddit.model'
import Post from './post.model'
import Constant from '../../constant'

const Messages = Constant.messages

class PostController {
  async createPostHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, text, link } = req.body
      const { email } = res.locals.payload
      const iUser = await UserData.findOne({ email })
      const iSubreddit = await Subreddit.findOne({})
      const id = iUser?._id

      const post = new Post({
        title,
        text,
        link,
        _creator: id,
        _subreddit: iSubreddit?._id,
      })
      const newPost = await post.save()
      res.status(201).json({
        message: Messages.postCreated,
        data: {
          newPost,
        },
        status: true,
      })
    } catch (error: any) {
      return next(new ApplicationError(error.message))
    }
  }

  async getPostHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await Post.find({})
        .populate([
          {
            path: '_creator',
            select: 'username createdAt -_id',
          },
          {
            path: '_subreddit',
            select: 'name slogan createdAt _creator -_id',
            populate: { path: '_creator', select: 'username createdAt -_id' },
          },
        ])
        .populate({
          path: '_comments',
          select: 'text _id',
          populate: { path: '_creator', select: 'username createdAt -_id' },
        })
      res.status(200).json({
        message: 'Successful',
        data: {
          post,
        },
        status: true,
      })
    } catch (error: any) {
      return next(new ApplicationError(error.message))
    }
  }
}

export default new PostController()
