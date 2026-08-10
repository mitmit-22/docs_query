import express from "express";
import { requireAuth } from "../../../middleware/auth.middleware.js";
import { query } from "../controllers/query.controller.js";

const router = express.Router();

router.post("/", requireAuth, query);

export default router;