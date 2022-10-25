import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequestError from "../common/error-handler/BadRequestError";

const validateSignupData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { password, confirmPassword } = req.body;
        
        const Schema = Joi.object({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            username: Joi.string().alphanum().required(),
            email : Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            confirmPassword: Joi.string().min(8).required(),
        });

        await Schema.validateAsync(req.body);

        if (password !== confirmPassword) {
            return next(new BadRequestError("Passwords do not match"));
        }
        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message));
    }
};

export default validateSignupData;