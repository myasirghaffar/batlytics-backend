import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import * as sessionService from "../services/inventorySessionService.js";
import { success } from "../utils/response.js";
import { HTTP_STATUS } from "../config/constants.js";

export const getSessions = catchAsyncErrors(async (req, res) => {
  const userId = req.user?.id;
  const sessions = await sessionService.listSessions(userId, req.query);
  return success(res, HTTP_STATUS.OK, "Success", sessions);
});

export const getSessionById = catchAsyncErrors(async (req, res) => {
  const userId = req.user?.id;
  const session = await sessionService.getSessionById(req.params.id, userId);
  return success(res, HTTP_STATUS.OK, "Success", session);
});

export const createSession = catchAsyncErrors(async (req, res) => {
  const userId = req.user?.id;
  const session = await sessionService.createSession(userId, req.body);
  return success(res, HTTP_STATUS.CREATED, "Session created", session);
});

export const addSessionItems = catchAsyncErrors(async (req, res) => {
  const userId = req.user?.id;
  const session = await sessionService.addSessionItems(
    req.params.id,
    userId,
    req.body.items
  );
  return success(res, HTTP_STATUS.OK, "Items added", session);
});
