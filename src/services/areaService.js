import Area from "../models/areaModel.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { HTTP_STATUS } from "../config/constants.js";
import { toFrontendId } from "../utils/toFrontend.js";

export async function listAreas() {
  const areas = await Area.find().sort({ name: 1 }).lean();
  return areas.map((a) => ({ ...toFrontendId(a), id: a._id.toString() }));
}

export async function getAreaById(id) {
  const area = await Area.findById(id).lean();
  if (!area) throw new ErrorHandler("Area not found", HTTP_STATUS.NOT_FOUND);
  return { ...toFrontendId(area), id: area._id.toString() };
}

export async function createArea(payload) {
  const area = await Area.create(payload);
  return toFrontendId(area);
}

export async function updateArea(id, payload) {
  const area = await Area.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();
  if (!area) throw new ErrorHandler("Area not found", HTTP_STATUS.NOT_FOUND);
  return { ...toFrontendId(area), id: area._id.toString() };
}

export async function deleteArea(id) {
  const area = await Area.findByIdAndDelete(id);
  if (!area) throw new ErrorHandler("Area not found", HTTP_STATUS.NOT_FOUND);
  await Product.deleteMany({ areaId: id });
  return area;
}
