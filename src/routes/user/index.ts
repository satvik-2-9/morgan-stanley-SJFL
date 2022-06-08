import { Router } from "express";
import { ce } from "~/lib/captureError";
import {
  handleCreateUser,
  handleDeleteUser,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
} from "./controller";

export const router = Router();

//CRUD routes
router.get("/", ce(handleGetAllUsers));
router.get("/:id", ce(handleGetUserById));
router.post("/", ce(handleCreateUser));
router.patch("/:id", ce(handleUpdateUserById));
router.delete("/:id", ce(handleDeleteUser));

export default router;
