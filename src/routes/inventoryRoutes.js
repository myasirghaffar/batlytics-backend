import express from "express";
import {
  getInventory,
  createOrUpdateInventory,
  getInventoryReport,
} from "../controllers/inventoryController.js";
import {
  getSessions,
  getSessionById,
  createSession,
  addSessionItems,
} from "../controllers/inventorySessionController.js";
import { validate } from "../middlewares/validate.js";
import {
  createOrUpdateInventorySchema,
  reportQuerySchema,
  listInventoryQuerySchema,
  createSessionSchema,
  sessionIdParamSchema,
  addSessionItemsSchema,
} from "../validators/inventoryValidators.js";
import { optionalAuth, isAuthenticatedUser } from "../middlewares/auth.js";
import config from "../config/index.js";

const router = express.Router();
const useAuth = config.allowUnauthenticated ? optionalAuth : isAuthenticatedUser;

router.get("/", useAuth, validate({ query: listInventoryQuerySchema }), getInventory);
router.post("/", useAuth, validate(createOrUpdateInventorySchema), createOrUpdateInventory);
router.get("/report", useAuth, validate({ query: reportQuerySchema }), getInventoryReport);

router.get("/sessions", useAuth, getSessions);
router.get("/sessions/:id", useAuth, validate({ params: sessionIdParamSchema }), getSessionById);
router.post("/sessions", useAuth, validate(createSessionSchema), createSession);
router.post(
  "/sessions/:id/items",
  useAuth,
  validate({ params: sessionIdParamSchema, body: addSessionItemsSchema }),
  addSessionItems
);

export default router;
