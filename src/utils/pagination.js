import mongoose from "mongoose";
import { PAGINATION } from "../config/constants.js";

/**
 * Normalize limit from query (default, min 1, max MAX_LIMIT).
 */
export function parseLimit(queryLimit) {
  const limit = Math.min(
    Math.max(parseInt(queryLimit, 10) || PAGINATION.DEFAULT_LIMIT, 1),
    PAGINATION.MAX_LIMIT
  );
  return limit;
}

/**
 * Validate cursor is a valid 24-char hex ObjectId. Returns ObjectId or null.
 */
export function parseCursor(cursor) {
  if (!cursor || typeof cursor !== "string") return null;
  if (/^[0-9a-fA-F]{24}$/.test(cursor)) {
    try {
      return new mongoose.Types.ObjectId(cursor);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Build cursor-based pagination result.
 * @param {Array} items - Page of items (length may be limit+1)
 * @param {number} limit - Requested limit
 * @param {string} cursorKey - Key on each item to use as nextCursor (e.g. '_id')
 */
export function buildCursorResult(items, limit, cursorKey = "_id") {
  const hasMore = items.length > limit;
  const page = hasMore ? items.slice(0, limit) : items;
  const nextCursor =
    hasMore && page.length ? String(page[page.length - 1][cursorKey]) : null;
  return {
    items: page,
    nextCursor,
    hasMore,
  };
}
