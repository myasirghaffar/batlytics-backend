import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import * as areaService from "../services/areaService.js";
import { success } from "../utils/response.js";
import { HTTP_STATUS } from "../config/constants.js";

export const getAreas = catchAsyncErrors(async (req, res) => {
  const areas = await areaService.listAreas();
  return success(res, HTTP_STATUS.OK, "Success", areas);
});

export const getAreaById = catchAsyncErrors(async (req, res) => {
  const area = await areaService.getAreaById(req.params.id);
  return success(res, HTTP_STATUS.OK, "Success", area);
});

export const createArea = catchAsyncErrors(async (req, res) => {
  const area = await areaService.createArea(req.body);
  return success(res, HTTP_STATUS.CREATED, "Area created successfully", area);
});

export const updateArea = catchAsyncErrors(async (req, res) => {
  const area = await areaService.updateArea(req.params.id, req.body);
  return success(res, HTTP_STATUS.OK, "Area updated successfully", area);
});

export const deleteArea = catchAsyncErrors(async (req, res) => {
  await areaService.deleteArea(req.params.id);
  return success(res, HTTP_STATUS.OK, "Area deleted successfully");
});
