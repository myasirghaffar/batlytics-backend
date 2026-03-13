import config from "../config/index.js";
import { COOKIE_NAMES } from "../config/constants.js";

const cookieExpireMs = config.jwt.cookieExpireDays * 24 * 60 * 60 * 1000;

/**
 * Send JWT in cookie and JSON response.
 * @param {import("../models/userModel.js").default} user - User document (with getJWTToken)
 * @param {number} statusCode - HTTP status code
 * @param {import("express").Response} res - Express response
 */
export default function sendToken(user, statusCode, res) {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(Date.now() + cookieExpireMs),
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "lax",
  };
  res.status(statusCode).cookie(COOKIE_NAMES.AUTH_TOKEN, token, options).json({
    success: true,
    message: "Success",
    data: { user, token },
  });
}
