import { Router } from "express";
import { ce } from "~/lib/captureError";
import {
  handleUserLogin,
  handleAdminLogin,
  getCurrentUser,
  getCurrentAdmin,
} from "./controller";

export const router = Router();

//CRUD routes
router.post("/user", ce(handleUserLogin));
router.post("/admin", ce(handleAdminLogin));
router.get("/user/me", ce(getCurrentUser));
router.get("/admin/me", ce(getCurrentAdmin));
export default router;
