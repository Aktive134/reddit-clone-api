import { Request, Response, NextFunction } from 'express'
import ApplicationError from '../../common/error-handler/ApplicationError'
import Subreddit from './subreddit.model'
import Constant from '../../constant'
import BadRequestError from '../../common/error-handler/BadRequestError'

const Messages = Constant.messages

class SubredditController {
  async createSubreddit(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body
      Subreddit.exists({ filter: name }, async (err, doc) => {
        if (!err) {
          return next(
            new BadRequestError('Subreddit with this name already exists'),
          )
        } else {
          const { username } = res.locals.payload
          const subreddit = new Subreddit(req.body)
          subreddit.author = username

          const redditData = await subreddit.save()
          res.status(201).json({
            message: Messages.redditCreated,
            data: {
              redditData,
            },
            status: true,
          })
        }
      })
    } catch (error: any) {
      return next(new ApplicationError(error.message))
    }
  }

  async editSubredditHandler (req: Request, res: Response, next: NextFunction) {
      try {
          const { id } = res.locals._id;
          const subreddit = await Subreddit.findById({id});
          if(!subreddit) {
            return next(
                new BadRequestError('Subreddit does not already exists'),
            );
          }
          subreddit.set({
             name : subreddit.name,
             slogan : subreddit.slogan,
             avatar : subreddit.avatar,
             cover : subreddit.cover 
          });
          const redditData = subreddit.save();
          res.status(200).json({
              message: Messages.redditUpdated,
              data: {
                  redditData
              },
              status: true
          })

      } catch (error: any) {
        return next(new ApplicationError(error));
      }
  }
}

export default new SubredditController()
