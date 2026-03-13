import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.min": "Category name cannot be empty",
  }),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.min": "Category name cannot be empty",
  }),
});

export const categoryIdParamSchema = Joi.object({
  id: objectId.required().messages({
    "string.pattern.base": "Invalid category ID",
  }),
});
