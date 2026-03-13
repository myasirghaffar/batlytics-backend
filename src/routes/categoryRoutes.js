import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { validate } from "../middlewares/validate.js";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from "../validators/categoryValidators.js";
import { isAuthenticatedUser, authorizeRole } from "../middlewares/auth.js";
import { USER_ROLES } from "../config/constants.js";

const router = express.Router();

router.get("/", isAuthenticatedUser, getCategories);

router.get(
  "/:id",
  isAuthenticatedUser,
  validate({ params: categoryIdParamSchema }),
  getCategoryById
);

router.post(
  "/",
  isAuthenticatedUser,
  authorizeRole(USER_ROLES.ADMIN, USER_ROLES.USER),
  validate(createCategorySchema),
  createCategory
);

router.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRole(USER_ROLES.ADMIN, USER_ROLES.USER),
  validate({
    params: categoryIdParamSchema,
    body: updateCategorySchema,
  }),
  updateCategory
);

router.delete(
  "/:id",
  isAuthenticatedUser,
  authorizeRole(USER_ROLES.ADMIN, USER_ROLES.USER),
  validate({ params: categoryIdParamSchema }),
  deleteCategory
);

export default router;
