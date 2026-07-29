import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { users } from "../../../db/schema.js";

export const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, 10);
};

export const comparePassword = async (plainPassword, hash) => {
  return await bcrypt.compare(plainPassword, hash);
};

export const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const registerUser = async (email, password) => {
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    const err = new Error("Email already registered");
    err.status = 409;
    throw err;
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning({ id: users.id, email: users.email });

  return user;
};

export const validateUser = async (email, password) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return null;

  const matches = await comparePassword(password, user.passwordHash);
  if (!matches) return null;

  return { id: user.id, email: user.email };
};