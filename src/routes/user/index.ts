import { Router } from "express";
import { ce } from "~/lib/captureError";
import {
  handleCreateUser,
  handleDeleteUser,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  fetchDocumentsByUID,
} from "./controller";

export const router = Router();

//CRUD routes
router.get("/", ce(handleGetAllUsers));
router.get("/:id", ce(handleGetUserById));
router.post("/", ce(handleCreateUser));
router.patch("/:id", ce(handleUpdateUserById));
router.delete("/:id", ce(handleDeleteUser));

// Special API
router.get("/:uid/documents", ce(fetchDocumentsByUID));

export default router;
