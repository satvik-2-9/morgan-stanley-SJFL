import { Request, Response, Router } from "express";
import requestRouter from "./request";
import userRouter from "./user";
import adminRouter from "./admin";

const router = Router();

router.use("/request", requestRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.get("/", (req: Request, res: Response) => {
  res.send("Hey there, this is the api route");
});

export default router;
