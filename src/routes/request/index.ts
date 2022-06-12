import { Router } from "express";
import { ce } from "~/lib/captureError";
import {
  handleCreateRequest,
  handleDeleteRequest,
  handleGetAllRequests,
  handleGetRequestById,
  handleUpdateRequestById,
  fetchDocumentByRequestID,
  handleGetRequestStatusCount,
} from "./controller";

export const router = Router();

router.get("/statuscount", ce(handleGetRequestStatusCount));

//CRUD routes
router.get("/", ce(handleGetAllRequests));
router.get("/:id", ce(handleGetRequestById));
router.post("/", ce(handleCreateRequest));
router.patch("/:id", ce(handleUpdateRequestById));
router.delete("/:id", ce(handleDeleteRequest));

// Special APIs
router.get("/:id/document", ce(fetchDocumentByRequestID));

export default router;
