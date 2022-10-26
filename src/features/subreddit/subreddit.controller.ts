import { Request, Response, NextFunction } from 'express'
import ApplicationError from '../../common/error-handler/ApplicationError'
import Subreddit from './subreddit.model'
import UserData from '../auth/auth.model'
import Constant from '../../constant'
import BadRequestError from '../../common/error-handler/BadRequestError'

const Messages = Constant.messages

class SubredditController {
  async createSubreddit(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, slogan } = req.body
      const { email } = res.locals.payload
      const iUser = await UserData.findOne({ email })
      const id = iUser?._id

      const redditExist = await Subreddit.findOne({ name })
      if (redditExist) {
        return next(
          new BadRequestError('Subreddit with this name already exists'),
        )
      } else {
        const subreddit = new Subreddit({
          name,
          slogan,
          _creator: id,
        })

        const redditData = await subreddit.save()
        res.status(201).json({
          message: Messages.redditCreated,
          data: {
            redditData,
          },
          status: true,
        })
      }
    } catch (error: any) {
      return next(new ApplicationError(error.message))
    }
  }

  async getSubreddit(req: Request, res: Response, next: NextFunction) {
    try {
      const subReddit = await Subreddit.find({}).populate({
        path: '_creator',
        select: 'username createdAt -_id',
      })
      res.status(200).json({
        message: 'Successful',
        data: {
          subReddit,
        },
        status: true,
      })
    } catch (error: any) {
      return next(new ApplicationError(error.message))
    }
  }

  async editSubredditHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, slogan } = req.body
        const { id } = req.query
        const subreddit = await Subreddit.findOne({ id });
        
      if (!subreddit) {
        return next(new BadRequestError('Subreddit does not exist'))
      }
      subreddit.set({
        name,
        slogan
      })
      const redditData = await subreddit.save()
      res.status(200).json({
        message: Messages.redditUpdated,
        data: {
          redditData,
        },
        status: true,
      })
    } catch (error: any) {
      return next(new ApplicationError(error))
    }
  }
}

export default new SubredditController()
