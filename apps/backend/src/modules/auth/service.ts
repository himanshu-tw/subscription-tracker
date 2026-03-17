import { prisma } from "db";

export abstract class AuthService {
  static async signup(
    username: string,
    email: string,
    password: string,
  ): Promise<string> {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: await Bun.password.hash(password),
      },
    });
    return user.id.toString();
  }

  static async signin(
    email: string,
    password: string,
  ): Promise<{ correctCreds: boolean; userId?: string }> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        correctCreds: false,
      };
    }

    if (!(await Bun.password.verify(password, user.password))) {
      return {
        correctCreds: false,
      };
    }

    return {
      correctCreds: true,
      userId: user.id.toString(),
    };
  }
}
