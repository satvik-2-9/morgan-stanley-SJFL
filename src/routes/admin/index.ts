import { Router } from "express";
import { ce } from "~/lib/captureError";
import {
  handleCreateAdmin,
  handleDeleteAdmin,
  handleGetAllAdmins,
  handleGetAdminById,
  handleUpdateAdminById,
} from "./controller";

export const router = Router();

//CRUD routes
router.get("/", ce(handleGetAllAdmins));
router.get("/:id", ce(handleGetAdminById));
router.post("/", ce(handleCreateAdmin));
router.patch("/:id", ce(handleUpdateAdminById));
router.delete("/:id", ce(handleDeleteAdmin));

export default router;
