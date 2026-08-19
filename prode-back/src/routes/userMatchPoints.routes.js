// src/routes/userMatchPoints.routes.js
import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeAdmin } from "../middlewares/authorize.js";
import UserMatchPointController from "../controller/userMatchPoint.controller.js";

const router = express.Router();
const userMatchPointController = new UserMatchPointController();

router.post("/", authenticate, authorizeAdmin, (req, res, next) => 
  userMatchPointController.assignPoints(req, res, next)
);

export default router;
