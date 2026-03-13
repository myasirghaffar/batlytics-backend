import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { COOKIE_NAMES, HTTP_STATUS } from "../config/constants.js";

function getAuthToken(req) {
  const bearer = req.headers.authorization;
  if (bearer && bearer.startsWith("Bearer ")) {
    return bearer.slice(7);
  }
  return req.cookies[COOKIE_NAMES.AUTH_TOKEN];
}

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const authToken = getAuthToken(req);
  if (!authToken) {
    return next(
      new ErrorHandler(
        "Please sign in to access this resource.",
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }

  const decoded = jwt.verify(authToken, config.jwt.secret);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new ErrorHandler(
        "Please sign in to access this resource.",
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }
  req.user = user;
  next();
});

export const optionalAuth = catchAsyncErrors(async (req, res, next) => {
  const authToken = getAuthToken(req);
  if (!authToken) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(authToken, config.jwt.secret);
    const user = await User.findById(decoded.id);
    req.user = user || null;
  } catch {
    req.user = null;
  }
  next();
});

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          "You do not have permission to access this resource.",
          HTTP_STATUS.FORBIDDEN
        )
      );
    }
    next();
  };
};
