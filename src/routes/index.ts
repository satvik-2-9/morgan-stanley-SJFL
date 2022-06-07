import { Request, Response, Router } from "express";
import requestRouter from "./request";
import uploadRouter from "./upload";
const router = Router();

router.use("/request", requestRouter);
router.use("/upload", uploadRouter);

router.get("/", (req: Request, res: Response) => {
  res.send("Hey there, this is the api route");
});

export default router;
