import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate a JWT token for a user
 * @param {Object} payload - User data to encode in token
 * @param {number} payload.userId - User ID
 * @param {string} payload.email - User email
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
  try {
    const token = jwt.sign(
      {
        userId: payload.userId,
        email: payload.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      console.error('Error verifying token:', error);
      throw new Error('Failed to verify token');
    }
  }
};
