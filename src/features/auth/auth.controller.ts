import { Request, Response, NextFunction } from 'express'
import ApplicationError from '../../common/error-handler/ApplicationError'
import UserData from './auth.model'
import bcrypt from 'bcrypt'
import Config from '../../config'
import Constant from '../../constant'
import NotAuthorizeError from '../../common/error-handler/NotAuthorizeError'
import generateToken from '../../lib/generate-token'
import BadRequestError from '../../common/error-handler/BadRequestError'

const Messages = Constant.messages

class AuthController {
  async createUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const { password } = req.body
      const userData = new UserData(req.body);
      
      const salt = await bcrypt.genSalt(Config.saltFactor)
      const hashPassword = await bcrypt.hash(password, salt)
      userData.password = hashPassword;
      const user = await userData.save();
      
      res.status(201).json({
        message: Messages.userCreated,
        data: {
            name : `${user.firstname} ${user.lastname}`,
            email: user.email,
            username: user.username
        },
        status: true,
      })
    } catch (error: any) {
      return next(new ApplicationError(error.message))
    }
  }

  async loginUserHandler (req: Request, res: Response, next: NextFunction) {
      try {
        const { email, password } = req.body;
        if (!email || !password) return next(new BadRequestError('Incorrect email or password'));
        const user = await UserData.findOne({email: email}).exec();
        const checkPass = await bcrypt.compare(password,  <string>user?.password);

        if (!user || !checkPass) return next(new NotAuthorizeError('Invalid Login Credentials'));

        const { firstname, lastname, username } = user;
        const userTokenData: Record<string, any> = {
            email,
            firstname,
            lastname,
            username
        };
        const token = generateToken(userTokenData) as string;
        const userData: Record<string, any> = {
            name: `${user.firstname} ${user.lastname}`,
            email,
            username
        };

        res.status(200).json({
            message: Messages.loginSuccess,
            data: {
              token,
              user: userData,
            },
            status: true,
        });
      } catch (error: any) {
        return next(new ApplicationError(error));
    }
  }

  async logoutUserHandler (req: Request, res: Response, next: NextFunction) {
      try {
        res.locals.payload = null
        res.locals.token = null
  
        res.status(200).json({
          statusCode: 200,
          success: true,
          message: Messages.logoutSuccess,
        });
      } catch (error : any) {
        return next(new ApplicationError(error))
      }
  }
}

export default new AuthController()
