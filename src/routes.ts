import { Router, Request, Response } from "express"; 
import authRouter from "./features/auth/auth.routes";
import subredditRouter from "./features/subreddit/subreddit.routes";
import validateToken from "./middleware/validate-token";

const router = Router() 

router.get("/", (
    req: Request, 
    res : Response
) => {
    res.status(200).json({
        message: "Service Running Ok", 
        status: true, 
        statusCode: 200, 
        data : []
    })
});

router.use(authRouter);
router.use(validateToken);
router.use(subredditRouter);

export default router