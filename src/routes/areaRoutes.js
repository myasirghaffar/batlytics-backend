import express from "express";
import {
  getAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
} from "../controllers/areaController.js";
import { validate } from "../middlewares/validate.js";
import {
  createAreaSchema,
  updateAreaSchema,
  areaIdParamSchema,
} from "../validators/areaValidators.js";
import { optionalAuth, isAuthenticatedUser } from "../middlewares/auth.js";
import config from "../config/index.js";

const router = express.Router();
const useAuth = config.allowUnauthenticated ? optionalAuth : isAuthenticatedUser;

router.get("/", useAuth, getAreas);
router.get("/:id", useAuth, validate({ params: areaIdParamSchema }), getAreaById);
router.post("/", useAuth, validate(createAreaSchema), createArea);
router.put("/:id", useAuth, validate({ params: areaIdParamSchema, body: updateAreaSchema }), updateArea);
router.delete("/:id", useAuth, validate({ params: areaIdParamSchema }), deleteArea);

export default router;
