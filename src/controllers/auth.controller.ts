import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
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

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const { token } = await authService.login(email, password);

      res.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }

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

  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}
