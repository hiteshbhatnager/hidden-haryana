import jwt from 'jsonwebtoken';

export const JWT_SECRET_DEFAULT = 'supersecret_jwt_key_hidden_haryana_2026';

export const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || JWT_SECRET_DEFAULT;
  const expiresIn = process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || '7d';
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn,
  });

  if (res && res.cookie) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie('token', token, cookieOptions);
  }

  return token;
};
