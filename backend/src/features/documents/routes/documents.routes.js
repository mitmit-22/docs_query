import express from "express";
import { requireAuth } from "../../../middleware/auth.middleware.js";
import uploadMiddleware from "../../../middleware/upload.middleware.js";
import { upload, getCurrent, discard } from "../controllers/documents.controller.js";

const router = express.Router();

router.post("/", requireAuth, uploadMiddleware.single("file"), upload);
router.get("/me", requireAuth, getCurrent);
router.delete("/me", requireAuth, discard);

export default router;