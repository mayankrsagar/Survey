import express from "express";

import * as ctrl from "../controllers/surveyController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();
router.get("/surveyforms", ctrl.getAllSurveys);
router.get("/mysurveyforms/:userId", protect, ctrl.getMySurveys);
router.post("/api/surveys/create", protect, ctrl.createSurvey);
router.post("/api/surveys/respond/:id", ctrl.respondSurvey);
router.get("/api/surveys/results/:id", ctrl.getResults);
router.get("/api/surveys/:id", ctrl.getSingleSurvey);
router.delete(
  "/deletesurveyform/:id",
  protect,
  // roles("admin"),
  ctrl.deleteSurvey
);
router.delete("/responses/:id", protect, ctrl.deleteResponse);

export default router;
