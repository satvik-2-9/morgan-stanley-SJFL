import { Router } from "express";
import { ce } from "~/lib/captureError";
import { handleGetAllEvents,
         handleCreateEvent, 
         handleGetEventById,
        handleUpdateEventById,
        handleDeleteEvent
       } from "./controller";


export const router = Router();

// CRUD Routes
router.get("/", ce(handleGetAllEvents));
router.get("/:id", ce(handleGetEventById));
router.post("/", ce(handleCreateEvent));
router.patch("/:id", ce(handleUpdateEventById));
router.delete("/:id", ce(handleDeleteEvent));




export default router;