import express from "express";
import {
  getProducts,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductFillLevel,
  updateProductPrice,
  deleteProduct,
} from "../controllers/productController.js";
import { validate } from "../middlewares/validate.js";
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  listProductsQuerySchema,
  searchProductsQuerySchema,
  fillLevelSchema,
  priceSchema,
} from "../validators/productValidators.js";
import { optionalAuth, isAuthenticatedUser, authorizeRole } from "../middlewares/auth.js";
import { USER_ROLES } from "../config/constants.js";
import config from "../config/index.js";

const router = express.Router();
const useAuth = config.allowUnauthenticated ? optionalAuth : isAuthenticatedUser;
const useAuthRole = (...roles) =>
  config.allowUnauthenticated ? optionalAuth : [isAuthenticatedUser, authorizeRole(...roles)];

router.get("/", useAuth, validate({ query: listProductsQuerySchema }), getProducts);
router.get(
  "/search",
  useAuth,
  validate({ query: searchProductsQuerySchema }),
  searchProducts
);
router.get("/:id", useAuth, validate({ params: productIdParamSchema }), getProductById);
router.post("/", useAuthRole(USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.USER), validate(createProductSchema), createProduct);
router.put("/:id", useAuthRole(USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.USER), validate({ params: productIdParamSchema, body: updateProductSchema }), updateProduct);
router.patch(
  "/:id/fillLevel",
  useAuth,
  validate({ params: productIdParamSchema, body: fillLevelSchema }),
  updateProductFillLevel
);
router.patch(
  "/:id/price",
  useAuth,
  validate({ params: productIdParamSchema, body: priceSchema }),
  updateProductPrice
);
router.delete("/:id", useAuthRole(USER_ROLES.ADMIN, USER_ROLES.USER), validate({ params: productIdParamSchema }), deleteProduct);

export default router;
