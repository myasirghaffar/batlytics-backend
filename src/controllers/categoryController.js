import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import * as categoryService from "../services/categoryService.js";
import { success } from "../utils/response.js";
import { HTTP_STATUS } from "../config/constants.js";

export const getCategories = catchAsyncErrors(async (req, res) => {
  const userId = req.user?.id;
  const categories = await categoryService.listCategories(userId);
  return success(res, HTTP_STATUS.OK, "Success", categories);
});

export const getCategoryById = catchAsyncErrors(async (req, res) => {
  const userId = req.user?.id;
  const category = await categoryService.getCategoryById(req.params.id, userId);
  return success(res, HTTP_STATUS.OK, "Success", category);
});

export const createCategory = catchAsyncErrors(async (req, res) => {
  const userId = req.user?.id;
  const category = await categoryService.createCategory(userId, req.body);
  return success(
    res,
    HTTP_STATUS.CREATED,
    "Category created successfully",
    category
  );
});

export const updateCategory = catchAsyncErrors(async (req, res) => {
  const userId = req.user?.id;
  const category = await categoryService.updateCategory(
    req.params.id,
    userId,
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
  const userId = req.user?.id;
  await categoryService.deleteCategory(req.params.id, userId);
  return success(res, HTTP_STATUS.OK, "Category deleted successfully");
});
