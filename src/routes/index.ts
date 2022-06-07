import { Request, Response, Router } from "express";
import requestRouter from "./request";
import eventRouter from "./event";
import uploadRouter from "./upload";
import documentRouter from "./document";

const router = Router();

router.use("/request", requestRouter);
router.use("/event", eventRouter);
router.use("/document", documentRouter);
router.use("/upload", uploadRouter);

router.get("/", (req: Request, res: Response) => {
  res.send("Hey there, this is the api route");
});

export default router;
