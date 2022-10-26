import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequestError from "../common/error-handler/BadRequestError";

const validatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const Schema = Joi.object({
            title: Joi.string().required(),
            text: Joi.string().required()
        });

        await Schema.validateAsync(req.body);
        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message));
    }
};

export default validatePost;