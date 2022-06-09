import { Request, Response, Router } from "express";
import requestRouter from "./request";
import userRouter from "./user";
import adminRouter from "./admin";
import eventRouter from "./event";
import uploadRouter from "./upload";
import documentRouter from "./document";
import loginRouter from "./login";
const router = Router();

router.use("/request", requestRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/event", eventRouter);
router.use("/document", documentRouter);
router.use("/upload", uploadRouter);
router.use("/login", loginRouter);
router.get("/", (req: Request, res: Response) => {
  res.send("Hey there, this is the api route");
});

export default router;
