import { Router } from "express";
import { ce } from "~/lib/captureError";
import { handleUserLogin, handleAdminLogin } from "./controller";

export const router = Router();

//CRUD routes
router.post("/user", ce(handleUserLogin));
router.post("/admin", ce(handleAdminLogin));
export default router;
