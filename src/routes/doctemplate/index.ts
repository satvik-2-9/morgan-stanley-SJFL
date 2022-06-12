import { Router } from "express";
import { ce } from "~/lib/captureError";
import {
  handleGetAllDocTemplates,
  handleGetDocTemplateById,
  handleCreateDocTemplate,
  handleUpdateDocTemplateById,
  handleDeleteDocTemplate,
} from "./controller";

export const router = Router();

//CRUD routes
router.get("/", ce(handleGetAllDocTemplates));
router.get("/:id", ce(handleGetDocTemplateById));
router.post("/", ce(handleCreateDocTemplate));
router.patch("/:id", ce(handleUpdateDocTemplateById));
router.delete("/:id", ce(handleDeleteDocTemplate));

export default router;
