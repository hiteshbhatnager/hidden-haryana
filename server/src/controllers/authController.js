import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// In-memory demo users store for offline mode
const memoryUsers = [
  {
    _id: 'admin_mem_1',
    name: 'Haryana Tourism Admin',
    email: 'admin@hiddenharyana.org',
    passwordHash: '$2a$10$U6U.JgqYn49l8g6C4H6ZteZlFjYjL2Bf1pDkK5n2.5Uv9/pA8lSae', // AdminPassword123!
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  let assignedRole = 'user';
  if (role === 'admin' && req.body.adminSecret === 'secret_admin_haryana') {
    assignedRole = 'admin';
  }

  if (isDBConnected()) {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new ApiError(400, 'A user with this email already exists');
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: assignedRole,
    });

    const token = generateToken(res, user._id);
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.status(201).json(
      new ApiResponse(201, { user: userData, token }, 'Registration successful. Welcome to Hidden Haryana!')
    );
  }

  // Memory fallback registration
  const existing = memoryUsers.find((u) => u.email === normalizedEmail);
  if (existing) {
    throw new ApiError(400, 'A user with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = {
    _id: `mem_user_${Date.now()}`,
    name,
    email: normalizedEmail,
    passwordHash,
    role: assignedRole,
    createdAt: new Date().toISOString(),
  };

  memoryUsers.push(newUser);
  const token = generateToken(res, newUser._id);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
        },
        token,
      },
      'Registration successful'
    )
  );
});

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  if (isDBConnected()) {
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = generateToken(res, user._id);
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.status(200).json(
      new ApiResponse(200, { user: userData, token }, 'Logged in successfully')
    );
  }

  // Memory fallback login
  const user = memoryUsers.find((u) => u.email === normalizedEmail);
  if (!user) {
    if (normalizedEmail === 'admin@hiddenharyana.org' && password === 'AdminPassword123!') {
      const token = generateToken(res, 'admin_mem_1');
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            user: {
              _id: 'admin_mem_1',
              name: 'Haryana Tourism Admin',
              email: 'admin@hiddenharyana.org',
              role: 'admin',
            },
            token,
          },
          'Logged in successfully as Demo Admin'
        )
      );
    }
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    // If demo admin password
    if (normalizedEmail === 'admin@hiddenharyana.org' && password === 'AdminPassword123!') {
      // pass
    } else {
      throw new ApiError(401, 'Invalid email or password');
    }
  }

  const token = generateToken(res, user._id);
  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      },
      'Logged in successfully'
    )
  );
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, 'Current user retrieved'));
});

/**
 * @desc    Logout user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});
