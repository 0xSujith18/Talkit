import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export const rateLimit = (maxRequests: number, windowMs: number) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const key = req.user?._id?.toString() || req.ip;
    const now = Date.now();
    
    if (!store[key] || now > store[key].resetTime) {
      store[key] = { count: 1, resetTime: now + windowMs };
      return next();
    }
    
    if (store[key].count >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests, please try again later' });
    }
    
    store[key].count++;
    next();
  };
};
