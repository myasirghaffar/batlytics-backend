import InventoryEntry from "../models/inventoryEntryModel.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { HTTP_STATUS } from "../config/constants.js";
import {
  parseLimit,
  parseCursor,
  buildCursorResult,
} from "../utils/pagination.js";

function mapEntryToItem(entry) {
  return {
    product: entry.productId,
    inventory: {
      fillLevel: entry.fillLevel,
      lastUpdated: entry.lastUpdated,
    },
  };
}

export async function listInventoryWithProducts(userId, query = {}) {
  const limit = parseLimit(query.limit);
  const cursorId = parseCursor(query.cursor);
  const filter = { userId };

  if (cursorId) {
    const cursorEntry = await InventoryEntry.findOne({ _id: cursorId, userId }).lean();
    if (cursorEntry) {
      filter.$or = [
        { lastUpdated: { $lt: cursorEntry.lastUpdated } },
        {
          lastUpdated: cursorEntry.lastUpdated,
          _id: { $lt: cursorId },
        },
      ];
    }
  }

  const entries = await InventoryEntry.find(filter)
    .populate({
      path: "productId",
      populate: { path: "categoryId", select: "name" },
    })
    .sort({ lastUpdated: -1, _id: -1 })
    .limit(limit + 1)
    .lean();

  const result = buildCursorResult(entries, limit);
  result.items = result.items.map(mapEntryToItem);
  return result;
}

export async function createOrUpdateFillLevel(userId, productId, fillLevel) {
  const product = await Product.findOne({ _id: productId, userId });
  if (!product)
    throw new ErrorHandler("Product not found", HTTP_STATUS.NOT_FOUND);

  const entry = await InventoryEntry.findOneAndUpdate(
    { productId, userId },
    { productId, userId, fillLevel, lastUpdated: new Date() },
    { new: true, upsert: true, runValidators: true }
  ).populate({
    path: "productId",
    populate: { path: "categoryId", select: "name" },
  });

  return {
    product: entry.productId,
    inventory: {
      fillLevel: entry.fillLevel,
      lastUpdated: entry.lastUpdated,
    },
  };
}

export async function getReport(userId, query = {}) {
  const Product = (await import("../models/productModel.js")).default;
  const filter = { userId };
  if (query.areaId) filter.areaId = query.areaId;

  const products = await Product.find(filter).sort({ name: 1 }).lean();

  const totalBottles = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
  const lowStock = products.filter((p) => (p.fillLevel ?? 100) < 25).length;

  const formattedProducts = products.map((p) => ({
    id: p._id.toString(),
    areaId: p.areaId?.toString?.(),
    name: p.name,
    volume: p.volume ?? p.unitSize ?? 0,
    image: p.image || p.imageURL || "",
    category: p.category || "",
    price: p.price ?? 0,
    fillLevel: p.fillLevel ?? 100,
  }));

  return {
    totalBottles,
    totalValue,
    lowStock,
    products: formattedProducts,
  };
}

export async function getReportLegacy() {
  const entries = await InventoryEntry.find()
    .populate({
      path: "productId",
      populate: { path: "categoryId", select: "name" },
    })
    .lean();

  const byCategory = {};
  const byProduct = [];
  let totalBottles = 0;
  let totalFillPercent = 0;

  for (const entry of entries) {
    const product = entry.productId;
    if (!product) continue;

    const categoryName = product.categoryId?.name ?? "Uncategorized";
    if (!byCategory[categoryName]) {
      byCategory[categoryName] = {
        category: categoryName,
        count: 0,
        totalFillPercent: 0,
        products: [],
      };
    }

    byCategory[categoryName].count += 1;
    byCategory[categoryName].totalFillPercent += entry.fillLevel;
    byCategory[categoryName].products.push({
      name: product.name,
      fillLevel: entry.fillLevel,
      unitSize: product.unitSize,
      lastUpdated: entry.lastUpdated,
    });

    byProduct.push({
      product: {
        _id: product._id,
        name: product.name,
        category: product.categoryId
          ? { _id: product.categoryId._id, name: product.categoryId.name }
          : null,
        imageURL: product.imageURL,
        unitSize: product.unitSize,
      },
      fillLevel: entry.fillLevel,
      lastUpdated: entry.lastUpdated,
    });

    totalBottles += 1;
    totalFillPercent += entry.fillLevel;
  }

  const categorySummary = Object.values(byCategory).map((c) => ({
    ...c,
    averageFillPercent:
      c.count > 0 ? Math.round((c.totalFillPercent / c.count) * 100) / 100 : 0,
  }));

  for (const c of categorySummary) {
    delete c.totalFillPercent;
  }

  return {
    generatedAt: new Date(),
    summary: {
      totalBottles,
      averageFillPercent:
        totalBottles > 0
          ? Math.round((totalFillPercent / totalBottles) * 100) / 100
          : 0,
    },
    byCategory: categorySummary,
    byProduct,
  };
}
