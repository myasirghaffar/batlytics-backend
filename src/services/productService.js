import Product from "../models/productModel.js";
import Area from "../models/areaModel.js";
import InventoryEntry from "../models/inventoryEntryModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { HTTP_STATUS } from "../config/constants.js";

function formatProduct(p) {
  if (!p) return null;
  const doc = p.toObject ? p.toObject() : { ...p };
  const id = doc._id?.toString();
  delete doc._id;
  return {
    id,
    areaId: doc.areaId?.toString?.(),
    name: doc.name,
    volume: doc.volume ?? doc.unitSize ?? 0,
    image: doc.image || doc.imageURL || "",
    category: doc.category || "",
    price: doc.price ?? 0,
    fillLevel: doc.fillLevel ?? 100,
    createdAt: doc.createdAt,
  };
}

export async function listProducts(userId, query = {}) {
  const filter = { userId };
  if (query.areaId) filter.areaId = query.areaId;
  if (query.categoryId) filter.categoryId = query.categoryId;

  const products = await Product.find(filter).sort({ name: 1 }).lean();
  return products.map(formatProduct);
}

export async function searchProducts(userId, query = {}) {
  const q = (query.q || "").trim();
  const filter = { userId };
  if (query.areaId) filter.areaId = query.areaId;
  if (q) filter.name = { $regex: q, $options: "i" };

  const products = await Product.find(filter).sort({ name: 1 }).lean();
  return products.map(formatProduct);
}

export async function getProductById(id, userId) {
  const product = await Product.findOne({ _id: id, userId })
    .populate("areaId", "name")
    .lean();
  if (!product)
    throw new ErrorHandler("Product not found", HTTP_STATUS.NOT_FOUND);
  return formatProduct(product);
}

export async function createProduct(userId, payload) {
  const area = await Area.findOne({ _id: payload.areaId, userId });
  if (!area)
    throw new ErrorHandler("Area not found", HTTP_STATUS.NOT_FOUND);

  const data = {
    areaId: payload.areaId,
    name: payload.name,
    category: payload.category || "",
    image: payload.image || payload.imageURL || "",
    imageURL: payload.image || payload.imageURL || "",
    volume: payload.volume ?? payload.unitSize ?? 0,
    unitSize: payload.volume ?? payload.unitSize ?? 0,
    price: payload.price ?? 0,
    fillLevel: payload.fillLevel ?? 100,
  };
  if (payload.categoryId) data.categoryId = payload.categoryId;

  const product = await Product.create({ ...data, userId });
  return formatProduct(product);
}

export async function updateProduct(id, userId, payload) {
  const update = {};
  if (payload.name !== undefined) update.name = payload.name;
  if (payload.category !== undefined) update.category = payload.category;
  if (payload.categoryId !== undefined) update.categoryId = payload.categoryId;
  if (payload.image !== undefined) {
    update.image = payload.image;
    update.imageURL = payload.image;
  }
  if (payload.imageURL !== undefined) {
    update.image = payload.imageURL;
    update.imageURL = payload.imageURL;
  }
  if (payload.volume !== undefined) {
    update.volume = payload.volume;
    update.unitSize = payload.volume;
  }
  if (payload.unitSize !== undefined) {
    update.volume = payload.unitSize;
    update.unitSize = payload.unitSize;
  }
  if (payload.price !== undefined) update.price = payload.price;
  if (payload.fillLevel !== undefined) update.fillLevel = payload.fillLevel;
  if (payload.areaId !== undefined) update.areaId = payload.areaId;

  const product = await Product.findOneAndUpdate(
    { _id: id, userId },
    update,
    { new: true, runValidators: true }
  ).lean();
  if (!product)
    throw new ErrorHandler("Product not found", HTTP_STATUS.NOT_FOUND);
  return formatProduct(product);
}

export async function updateProductFillLevel(id, userId, fillLevel) {
  const product = await Product.findOneAndUpdate(
    { _id: id, userId },
    { fillLevel: Math.round(fillLevel) },
    { new: true, runValidators: true }
  ).lean();
  if (!product)
    throw new ErrorHandler("Product not found", HTTP_STATUS.NOT_FOUND);
  await InventoryEntry.findOneAndUpdate(
    { productId: id },
    { fillLevel: Math.round(fillLevel), lastUpdated: new Date() },
    { upsert: true }
  );
  return formatProduct(product);
}

export async function updateProductPrice(id, userId, price) {
  const product = await Product.findOneAndUpdate(
    { _id: id, userId },
    { price },
    { new: true, runValidators: true }
  ).lean();
  if (!product)
    throw new ErrorHandler("Product not found", HTTP_STATUS.NOT_FOUND);
  return formatProduct(product);
}

export async function deleteProduct(id, userId) {
  const product = await Product.findOneAndDelete({ _id: id, userId });
  if (!product)
    throw new ErrorHandler("Product not found", HTTP_STATUS.NOT_FOUND);
  await InventoryEntry.deleteMany({ productId: id });
  return product;
}
