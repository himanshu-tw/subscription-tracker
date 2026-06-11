import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type Response } from 'express';
import bcrypt from 'bcryptjs';
import { type AuthRequest } from '../middleware/middleware';
import { generateToken } from '../utils/generateToken';
import { setAuthCookie } from '../utils/authCookie';


export const verify = async (req: AuthRequest, res: Response) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      return res.status(400).json({ message: "token not found" })
    }

    const [user] = await db.select().from(users).where(eq(users.verificationToken, token))

    if (!user) {
      return res.status(400).json({ message: "invalid token" })
    }

    if (new Date() > user.verificationTokenExpiry!) {
      return res.status(400).json({ message: "token expired" })
    }

    const [updatedUser] = await db.update(users).set({
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    }).where(eq(users.id, user.id)).returning();

    // generate jwt token
    const jwtToken = generateToken(user.id)

    // set cookie
    setAuthCookie(res, jwtToken)

    // return success message
    return res.status(200).json({ message: "success" })
  } catch (error) {
    return res.status(500).json({ message: "internal server error" })
  }
}


export const register = async (req: AuthRequest, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verification_token = crypto.randomUUID();

    const [newUser] = await db.insert(users).values({
      name: username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken: verification_token,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }).returning();

    res.status(201).json({ message: "check your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    const isVerified = user.isVerified;

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!isVerified) {
      return res.status(400).json({ message: "User is not verified. Please verify your email." })
    }

    const token = generateToken(user.id);

    // set the auth cookie as the jwt token generated
    setAuthCookie(res, token)

    // success message
    res.json({ message: "successfully logged in" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(400).json({ message: "unauthorized" })
  }

  res.json({ id: req.user.id })
}

export const logout = async (req: AuthRequest, res: Response) => {
  // clear the auth cookie

  res.json({ message: "Logged out" })
}
