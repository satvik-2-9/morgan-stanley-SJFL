import { Router } from "express";
import { ce } from "~/lib/captureError";
import {
  handleGetAllDocuments,
  handleGetDocumentById,
  handleCreateDocument,
  handleUpdateDocumentById,
  handleDeleteDocument
} from "./controller";

export const router = Router();

//CRUD routes
router.get("/", ce(handleGetAllDocuments));
router.get("/:id",ce(handleGetDocumentById));
router.post("/", ce(handleCreateDocument));
router.patch("/:id", ce(handleUpdateDocumentById));
router.delete("/:id", ce(handleDeleteDocument));


export default router;
