import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  id: string;
  email: string;
  name?: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token);
    return decoded as JwtPayload;
  } catch (error) {
    return null;
  }
};
