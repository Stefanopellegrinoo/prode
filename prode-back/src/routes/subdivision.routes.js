import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeAdmin } from "../middlewares/authorize.js";
import SubdivisionController from "../controller/subdivision.controller.js";

const router = express.Router();
const subdivisionController = new SubdivisionController();

// GET /api/subdivisions
router.get("/", authenticate, (req, res, next) =>
  subdivisionController.getAll(req, res, next)
);

// GET /api/subdivisions/:id
router.get("/:id", authenticate, (req, res, next) =>
  subdivisionController.getById(req, res, next)
);

// POST /api/subdivisions
router.post("/", authenticate, authorizeAdmin, (req, res, next) =>
  subdivisionController.create(req, res, next)
);

// PUT /api/subdivisions/:id
router.put("/:id", authenticate, authorizeAdmin, (req, res, next) =>
  subdivisionController.update(req, res, next)
);

// DELETE /api/subdivisions/:id
router.delete("/:id", authenticate, authorizeAdmin, (req, res, next) =>
  subdivisionController.delete(req, res, next)
);

export default router;
