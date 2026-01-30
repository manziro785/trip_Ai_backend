import bcrypt from "bcrypt";
import { prisma } from "../config/database";
import { generateToken } from "../utils/jwt";
import { AppError } from "../middleware/error.middleware";

export class AuthService {
  // Register new user
  async register(email: string, password: string, name?: string) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    });

    return { user, token };
  }

  // Login user
  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new AppError("Invalid credentials", 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      token,
    };
  }

  // Google OAuth
  async googleAuth(
    googleId: string,
    email: string,
    name: string,
    avatar?: string,
  ) {
    let user = await prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      // Check if email exists
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // Link Google account to existing user
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, avatar: avatar || user.avatar },
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            googleId,
            name,
            avatar,
          },
        });
      }
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      token,
    };
  }
}
