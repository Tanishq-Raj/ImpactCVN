import { verifyToken } from '../utils/jwt.js';

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Attaches decoded user info to req.user
 */
export const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Authentication error',
        message: 'No token provided'
      });
    }

    // Extract token from "Bearer <token>" format
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Authentication error',
        message: 'Invalid token format. Use: Bearer <token>'
      });
    }

    const token = parts[1];

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.message === 'Token has expired') {
      return res.status(401).json({
        error: 'Authentication error',
        message: 'Token has expired. Please log in again.'
      });
    } else if (error.message === 'Invalid token') {
      return res.status(401).json({
        error: 'Authentication error',
        message: 'Invalid token'
      });
    } else {
      return res.status(401).json({
        error: 'Authentication error',
        message: 'Failed to authenticate token'
      });
    }
  }
};

export default authMiddleware;
