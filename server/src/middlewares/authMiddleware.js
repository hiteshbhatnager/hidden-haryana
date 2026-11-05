import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { JWT_SECRET_DEFAULT } from '../utils/generateToken.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

/**
 * Protect routes: verify JWT from cookie or Bearer token header
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  try {
    const secret = process.env.JWT_SECRET || JWT_SECRET_DEFAULT;
    const decoded = jwt.verify(token, secret);

    if (isDBConnected()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        throw new ApiError(401, 'User no longer exists');
      }
      req.user = user;
    } else {
      // Memory fallback user check
      req.user = {
        _id: decoded.id,
        name: 'Haryana Tourism Admin',
        email: 'admin@hiddenharyana.org',
        role: 'admin',
      };
    }

    next();
  } catch (error) {
    throw new ApiError(401, 'Not authorized, token invalid or expired');
  }
});

/**
 * Authorize roles: restrict route access to specific roles e.g. admin
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role (${req.user ? req.user.role : 'unauthorized'}) is not allowed to access this resource`
      );
    }
    next();
  };
};
