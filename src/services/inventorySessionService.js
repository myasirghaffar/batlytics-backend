import InventorySession from "../models/inventorySessionModel.js";
import InventoryItem from "../models/inventoryItemModel.js";
import Area from "../models/areaModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { HTTP_STATUS } from "../config/constants.js";

function formatSession(s) {
  if (!s) return null;
  const doc = s.toObject ? s.toObject() : { ...s };
  return {
    id: doc._id?.toString(),
    areaId: doc.areaId?.toString?.(),
    areaName: doc.areaName,
    date: doc.date,
    team: doc.team,
    createdAt: doc.createdAt,
  };
}

function formatItem(i) {
  if (!i) return null;
  const doc = i.toObject ? i.toObject() : { ...i };
  return {
    id: doc._id?.toString(),
    sessionId: doc.sessionId?.toString?.(),
    productId: doc.productId?.toString?.(),
    fullBottles: doc.fullBottles ?? 0,
    fillLevel: doc.fillLevel ?? 100,
  };
}

export async function listSessions(userId, query = {}) {
  const limit = Math.min(parseInt(query.limit, 10) || 50, 100);
  const filter = { userId };
  if (query.areaId) filter.areaId = query.areaId;

  const sessions = await InventorySession.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return sessions.map((s) => ({
    id: s._id.toString(),
    areaId: s.areaId?.toString?.(),
    areaName: s.areaName,
    date: s.date,
    team: s.team,
    createdAt: s.createdAt,
  }));
}

export async function getSessionById(id, userId) {
  const session = await InventorySession.findOne({ _id: id, userId })
    .populate("areaId", "name")
    .lean();
  if (!session)
    throw new ErrorHandler("Session not found", HTTP_STATUS.NOT_FOUND);

  const items = await InventoryItem.find({ sessionId: id })
    .populate("productId")
    .lean();

  return {
    id: session._id.toString(),
    areaId: session.areaId?._id?.toString?.(),
    areaName: session.areaName || session.areaId?.name,
    date: session.date,
    team: session.team,
    createdAt: session.createdAt,
    items: items.map((i) => ({
      id: i._id.toString(),
      sessionId: i.sessionId.toString(),
      productId: i.productId?._id?.toString?.(),
      product: i.productId
        ? {
            id: i.productId._id.toString(),
            name: i.productId.name,
            volume: i.productId.volume ?? i.productId.unitSize,
            fillLevel: i.fillLevel,
          }
        : null,
      fullBottles: i.fullBottles ?? 0,
      fillLevel: i.fillLevel ?? 100,
    })),
  };
}

export async function createSession(userId, payload) {
  const area = await Area.findOne({ _id: payload.areaId, userId });
  if (!area)
    throw new ErrorHandler("Area not found", HTTP_STATUS.NOT_FOUND);

  const session = await InventorySession.create({
    userId,
    areaId: payload.areaId,
    areaName: payload.areaName || area.name,
    date: payload.date || new Date().toISOString().split("T")[0],
    team: payload.team || "",
  });

  return formatSession(session);
}

export async function addSessionItems(sessionId, userId, items) {
  const session = await InventorySession.findOne({ _id: sessionId, userId });
  if (!session)
    throw new ErrorHandler("Session not found", HTTP_STATUS.NOT_FOUND);

  for (const it of items) {
    await InventoryItem.findOneAndUpdate(
      { sessionId, productId: it.productId },
      {
        fullBottles: it.fullBottles ?? 0,
        fillLevel: it.fillLevel ?? 100,
      },
      { upsert: true, new: true }
    );
  }

  return getSessionById(sessionId, userId);
}
