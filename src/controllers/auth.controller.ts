import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  // POST /api/auth/register
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      const result = await authService.register(email, password, name);

      res.status(201).json({
        success: true,
        data: result,
        message: "User registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/login
  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const { token } = await authService.login(email, password);

      res.json({
        // success: true,
        token,
        // message: "Login successful",
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/google
  async googleAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { googleId, email, name, avatar } = req.body;

      const result = await authService.googleAuth(
        googleId,
        email,
        name,
        avatar,
      );
      res.json({
        success: true,
        data: result,
        message: "Google authentication successful",
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/me
  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // User is already attached by auth middleware
      res.json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}
