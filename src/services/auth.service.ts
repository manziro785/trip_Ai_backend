import bcrypt from "bcrypt";
import { prisma } from "../config/database";
import { generateToken } from "../utils/jwt";
import { AppError } from "../middleware/error.middleware";

export class AuthService {
  async register(email: string, password: string, name?: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    });

    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    });

    return {
      token,
    };
  }

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
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, avatar: avatar || user.avatar },
        });
      } else {
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
