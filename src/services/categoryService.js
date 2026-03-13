import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { HTTP_STATUS } from "../config/constants.js";

export async function listCategories(userId) {
  return Category.find({ userId }).sort({ name: 1 }).lean();
}

export async function getCategoryById(id, userId) {
  const category = await Category.findOne({ _id: id, userId });
  if (!category)
    throw new ErrorHandler("Category not found", HTTP_STATUS.NOT_FOUND);
  return category;
}

export async function createCategory(userId, payload) {
  const existing = await Category.findOne({
    userId,
    name: { $regex: new RegExp(`^${payload.name.trim()}$`, "i") },
  });
  if (existing)
    throw new ErrorHandler(
      "A category with this name already exists",
      HTTP_STATUS.CONFLICT
    );
  return Category.create({ ...payload, userId });
}

export async function updateCategory(id, userId, payload) {
  const existing = await Category.findOne({
    userId,
    _id: { $ne: id },
    name: { $regex: new RegExp(`^${payload.name.trim()}$`, "i") },
  });
  if (existing)
    throw new ErrorHandler(
      "A category with this name already exists",
      HTTP_STATUS.CONFLICT
    );
  const category = await Category.findOneAndUpdate(
    { _id: id, userId },
    payload,
    { new: true, runValidators: true }
  );
  if (!category)
    throw new ErrorHandler("Category not found", HTTP_STATUS.NOT_FOUND);
  return category;
}

export async function deleteCategory(id, userId) {
  const category = await Category.findOne({ _id: id, userId });
  if (!category)
    throw new ErrorHandler("Category not found", HTTP_STATUS.NOT_FOUND);
  const inUse = await Product.countDocuments({ categoryId: id, userId });
  if (inUse > 0)
    throw new ErrorHandler(
      `Cannot delete category: ${inUse} product(s) use it. Reassign or remove them first.`,
      HTTP_STATUS.BAD_REQUEST
    );
  await Category.findOneAndDelete({ _id: id, userId });
  return category;
}
