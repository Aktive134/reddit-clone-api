import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequestError from "../common/error-handler/BadRequestError";

const validateLoginData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const Schema = Joi.object({
            email : Joi.string().required(),
            password: Joi.string().min(8).required(),
        });

        await Schema.validateAsync(req.body);
        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message));
    }
};

export default validateLoginData;