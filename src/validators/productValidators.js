import Joi from "joi";
import { PAGINATION } from "../config/constants.js";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const listProductsQuerySchema = Joi.object({
  areaId: objectId.optional(),
  categoryId: objectId.optional(),
  limit: Joi.number().integer().min(1).max(PAGINATION.MAX_LIMIT).optional(),
  cursor: objectId.optional(),
});

export const searchProductsQuerySchema = Joi.object({
  q: Joi.string().allow("").optional(),
  areaId: objectId.optional(),
});

export const createProductSchema = Joi.object({
  areaId: objectId.required().messages({
    "string.pattern.base": "Invalid area ID",
  }),
  name: Joi.string().trim().min(1).required().messages({
    "string.min": "Product name cannot be empty",
  }),
  categoryId: objectId.optional(),
  category: Joi.string().allow("").optional(),
  image: Joi.string().allow("").optional(),
  imageURL: Joi.string().allow("").optional(),
  volume: Joi.number().min(0).optional(),
  unitSize: Joi.number().min(0).optional(),
  price: Joi.number().min(0).optional(),
  fillLevel: Joi.number().min(0).max(100).optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).optional(),
  categoryId: objectId.optional(),
  category: Joi.string().allow("").optional(),
  image: Joi.string().allow("").optional(),
  imageURL: Joi.string().allow("").optional(),
  volume: Joi.number().min(0).optional(),
  unitSize: Joi.number().min(0).optional(),
  price: Joi.number().min(0).optional(),
  fillLevel: Joi.number().min(0).max(100).optional(),
}).min(1);

export const fillLevelSchema = Joi.object({
  fillLevel: Joi.number().min(0).max(100).required(),
});

export const priceSchema = Joi.object({
  price: Joi.number().min(0).required(),
});

export const productIdParamSchema = Joi.object({
  id: objectId.required().messages({
    "string.pattern.base": "Invalid product ID",
  }),
});
