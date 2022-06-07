import { Request, Response, Router } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 } from "uuid";
import s3 from "~/lib/s3";
import config from "~/config";
import { ce } from "~/lib/captureError";
const router = Router();

const uploadFile = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: config.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, file.fieldname + v4());
    },
  }),
});

router.post(
  "/upload-file",
  uploadFile.single("file"),
  ce((req: Request, res: Response) => {
    // console.log(req.file)
    res
      .status(200)
      .json({ data: (req.file as Express.MulterS3.File).location });
  })
);

export default router;
