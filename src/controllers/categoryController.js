import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import * as categoryService from "../services/categoryService.js";
import { success } from "../utils/response.js";
import { HTTP_STATUS } from "../config/constants.js";

export const getCategories = catchAsyncErrors(async (req, res) => {
  const categories = await categoryService.listCategories();
  return success(res, HTTP_STATUS.OK, "Success", categories);
});

export const getCategoryById = catchAsyncErrors(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  return success(res, HTTP_STATUS.OK, "Success", category);
});

export const createCategory = catchAsyncErrors(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return success(
    res,
    HTTP_STATUS.CREATED,
    "Category created successfully",
    category
  );
});

export const updateCategory = catchAsyncErrors(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body
  );
  return success(
    res,
    HTTP_STATUS.OK,
    "Category updated successfully",
    category
  );
});

export const deleteCategory = catchAsyncErrors(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return success(res, HTTP_STATUS.OK, "Category deleted successfully");
});
