import Joi from "joi";
import { PAGINATION } from "../config/constants.js";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const listInventoryQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(PAGINATION.MAX_LIMIT).optional(),
  cursor: objectId.optional(),
});

export const createOrUpdateInventorySchema = Joi.object({
  productId: objectId.required().messages({
    "string.pattern.base": "Invalid product ID",
  }),
  fillLevel: Joi.number().min(0).max(100).required().messages({
    "number.min": "Fill level must be between 0 and 100",
    "number.max": "Fill level must be between 0 and 100",
  }),
});

export const reportQuerySchema = Joi.object({
  format: Joi.string().valid("json", "excel").optional().default("json"),
  areaId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
});

export const createSessionSchema = Joi.object({
  areaId: objectId.required(),
  areaName: Joi.string().allow("").optional(),
  date: Joi.string().allow("").optional(),
  team: Joi.string().allow("").optional(),
});

export const sessionIdParamSchema = Joi.object({
  id: objectId.required(),
});

export const addSessionItemsSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: objectId.required(),
        fullBottles: Joi.number().min(0).optional(),
        fillLevel: Joi.number().min(0).max(100).optional(),
      })
    )
    .required(),
});
