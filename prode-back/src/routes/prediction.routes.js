// src/routes/prediction.routes.js
import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import PredictionController from "../controller/prediction.controller.js";

const router = express.Router();
const predictionController = new PredictionController();

// Guardar (o actualizar) predicción
router.post("/", authenticate, (req, res, next) => predictionController.save(req, res, next));

// Obtener las predicciones del usuario
router.get("/", authenticate, (req, res, next) => predictionController.getByUser(req, res, next));

export default router;
