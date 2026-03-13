import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const createAreaSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.min": "Area name cannot be empty",
  }),
});

export const updateAreaSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.min": "Area name cannot be empty",
  }),
});

export const areaIdParamSchema = Joi.object({
  id: objectId.required().messages({
    "string.pattern.base": "Invalid area ID",
  }),
});
