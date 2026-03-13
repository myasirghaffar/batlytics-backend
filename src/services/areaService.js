import Area from "../models/areaModel.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { HTTP_STATUS } from "../config/constants.js";
import { toFrontendId } from "../utils/toFrontend.js";

export async function listAreas(userId) {
  const areas = await Area.find({ userId }).sort({ name: 1 }).lean();
  return areas.map((a) => ({ ...toFrontendId(a), id: a._id.toString() }));
}

export async function getAreaById(id, userId) {
  const area = await Area.findOne({ _id: id, userId }).lean();
  if (!area) throw new ErrorHandler("Area not found", HTTP_STATUS.NOT_FOUND);
  return { ...toFrontendId(area), id: area._id.toString() };
}

export async function createArea(userId, payload) {
  const area = await Area.create({ ...payload, userId });
  return toFrontendId(area);
}

export async function updateArea(id, userId, payload) {
  const area = await Area.findOneAndUpdate(
    { _id: id, userId },
    payload,
    { new: true, runValidators: true }
  ).lean();
  if (!area) throw new ErrorHandler("Area not found", HTTP_STATUS.NOT_FOUND);
  return { ...toFrontendId(area), id: area._id.toString() };
}

export async function deleteArea(id, userId) {
  const area = await Area.findOneAndDelete({ _id: id, userId });
  if (!area) throw new ErrorHandler("Area not found", HTTP_STATUS.NOT_FOUND);
  await Product.deleteMany({ areaId: id, userId });
  return area;
}
