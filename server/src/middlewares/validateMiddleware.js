import { ApiError } from '../utils/apiResponse.js';

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email address is required');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation Failed', errors));
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email is required');
  }
  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation Failed', errors));
  }
  next();
};

export const validateDestination = (req, res, next) => {
  const { name, description, district, category } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Destination name is required');
  }
  if (!description || description.trim().length === 0) {
    errors.push('Destination description is required');
  }
  if (!district || district.trim().length === 0) {
    errors.push('District is required');
  }
  if (!category || category.trim().length === 0) {
    errors.push('Category is required');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation Failed', errors));
  }
  next();
};

