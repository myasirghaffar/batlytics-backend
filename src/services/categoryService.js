import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { HTTP_STATUS } from "../config/constants.js";

export async function listCategories() {
  return Category.find().sort({ name: 1 }).lean();
}

export async function getCategoryById(id) {
  const category = await Category.findById(id);
  if (!category)
    throw new ErrorHandler("Category not found", HTTP_STATUS.NOT_FOUND);
  return category;
}

export async function createCategory(payload) {
  const existing = await Category.findOne({
    name: { $regex: new RegExp(`^${payload.name.trim()}$`, "i") },
  });
  if (existing)
    throw new ErrorHandler(
      "A category with this name already exists",
      HTTP_STATUS.CONFLICT
    );
  return Category.create(payload);
}

export async function updateCategory(id, payload) {
  const existing = await Category.findOne({
    _id: { $ne: id },
    name: { $regex: new RegExp(`^${payload.name.trim()}$`, "i") },
  });
  if (existing)
    throw new ErrorHandler(
      "A category with this name already exists",
      HTTP_STATUS.CONFLICT
    );
  const category = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!category)
    throw new ErrorHandler("Category not found", HTTP_STATUS.NOT_FOUND);
  return category;
}

export async function deleteCategory(id) {
  const category = await Category.findById(id);
  if (!category)
    throw new ErrorHandler("Category not found", HTTP_STATUS.NOT_FOUND);
  const inUse = await Product.countDocuments({ categoryId: id });
  if (inUse > 0)
    throw new ErrorHandler(
      `Cannot delete category: ${inUse} product(s) use it. Reassign or remove them first.`,
      HTTP_STATUS.BAD_REQUEST
    );
  await Category.findByIdAndDelete(id);
  return category;
}
