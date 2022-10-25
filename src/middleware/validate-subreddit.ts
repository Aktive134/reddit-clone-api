import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequestError from "../common/error-handler/BadRequestError";

const validateSubreddit = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, slogan, avatar, cover } = req.body;
        
        const Schema = Joi.object({
            name: Joi.string().required(),
            slogan: Joi.string().required(),
            avatar: Joi.string(),
            cover: Joi.string()
        });

        await Schema.validateAsync(req.body);
        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message));
    }
};

export default validateSubreddit;