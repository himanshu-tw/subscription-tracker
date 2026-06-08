import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { type AuthRequest } from '../middleware/middleware';
import { generateToken } from '../utils/generateToken';


export const register = async (req: AuthRequest, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email));

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. Please sign-in.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUser] = await db.insert(users).values({
            name: username,
            email,
            password: hashedPassword
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
        const user = await db.select().from(users).where(eq(users.email, email)).then(result => result[0]);

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password as string);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.id);

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await db.select().from(users).where(eq(users.id, req.user?.id as string)).then(result => result[0]);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const logout = (req: AuthRequest, res: Response) => {
    // Invalidate the token on the client side by clearing it
    res.json({ message: 'Logged out successfully' });
};
