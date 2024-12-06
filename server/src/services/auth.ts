import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

/**
 * Middleware for authenticating JWTs for GraphQL APIs.
 * Checks the Authorization header for a valid JWT token and attaches the decoded user info to req.user.
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      errors: [{ message: 'Unauthorized: No token provided.' }],
    });
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY || '';

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({
        errors: [{ message: 'Forbidden: Invalid or expired token.' }],
      });
    }

    req.user = user as JwtPayload; // Attach user info to req object
    return next();
  });
};

/**
 * Function to sign a JWT token.
 * @param username - Username of the user
 * @param email - Email of the user
 * @param _id - User ID
 * @returns Signed JWT token
 */
export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
