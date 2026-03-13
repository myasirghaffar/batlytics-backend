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

export async function listProducts(query = {}) {
  const filter = {};
  if (query.areaId) filter.areaId = query.areaId;
  if (query.categoryId) filter.categoryId = query.categoryId;

  const products = await Product.find(filter).sort({ name: 1 }).lean();
  return products.map(formatProduct);
}

export async function searchProducts(query = {}) {
  const q = (query.q || "").trim();
  const filter = {};
  if (query.areaId) filter.areaId = query.areaId;
  if (q) filter.name = { $regex: q, $options: "i" };

  const products = await Product.find(filter).sort({ name: 1 }).lean();
  return products.map(formatProduct);
}

export async function getProductById(id) {
  const product = await Product.findById(id).populate("areaId", "name").lean();
  if (!product)
    throw new ErrorHandler("Product not found", HTTP_STATUS.NOT_FOUND);
  return formatProduct(product);
}

export async function createProduct(payload) {
  const area = await Area.findById(payload.areaId);
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

  const product = await Product.create(data);
  return formatProduct(product);
}

export async function updateProduct(id, payload) {
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

  const product = await Product.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).lean();
  if (!product)
    throw new ErrorHandler("Product not found", HTTP_STATUS.NOT_FOUND);
  return formatProduct(product);
}

export async function updateProductFillLevel(id, fillLevel) {
  const product = await Product.findByIdAndUpdate(
    id,
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

export async function updateProductPrice(id, price) {
  const product = await Product.findByIdAndUpdate(
    id,
    { price },
    { new: true, runValidators: true }
  ).lean();
  if (!product)
    throw new ErrorHandler("Product not found", HTTP_STATUS.NOT_FOUND);
  return formatProduct(product);
}

export async function deleteProduct(id) {
  const product = await Product.findByIdAndDelete(id);
  if (!product)
    throw new ErrorHandler("Product not found", HTTP_STATUS.NOT_FOUND);
  await InventoryEntry.deleteMany({ productId: id });
  return product;
}
