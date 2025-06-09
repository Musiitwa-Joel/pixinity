import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./database";
import type { User } from "../src/types";
import type { ResultSetHeader } from "mysql2";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface AuthUser extends Omit<User, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}

export function generateToken(userId: string): string {
  // Cast the secret to string to ensure TypeScript knows it's not null
  const secret = JWT_SECRET as string;
  // Cast the expiresIn to a valid type for jwt.SignOptions
  return jwt.sign({ userId }, secret, { expiresIn: JWT_EXPIRES_IN as string });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    // Cast the secret to string to ensure TypeScript knows it's not null
    const secret = JWT_SECRET as string;
    return jwt.verify(token, secret) as { userId: string };
  } catch {
    return null;
  }
}

export async function createUser(userData: {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}): Promise<AuthUser> {
  const passwordHash = await hashPassword(userData.password);

  const [result] = await pool.execute(
    `INSERT INTO users (email, username, password_hash, first_name, last_name, role) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userData.email,
      userData.username,
      passwordHash,
      userData.firstName,
      userData.lastName,
      userData.role || "photographer",
    ]
  );

  const insertResult = result as ResultSetHeader;
  return getUserById(insertResult.insertId.toString());
}

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  try {
    const [rows] = await pool.execute(
      `SELECT id, email, username, first_name, last_name, avatar, bio, website, location,
              instagram, twitter, behance, dribbble, role, verified, followers_count,
              following_count, uploads_count, total_views, total_downloads, created_at, updated_at
       FROM users WHERE email = ?`,
      [email]
    );

    const users = rows as any[];
    if (users.length === 0) return null;

    return mapDbUserToAuthUser(users[0]);
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

export async function getUserById(id: string): Promise<AuthUser> {
  try {
    const [rows] = await pool.execute(
      `SELECT id, email, username, first_name, last_name, avatar, bio, website, location,
              instagram, twitter, behance, dribbble, role, verified, followers_count,
              following_count, uploads_count, total_views, total_downloads, created_at, updated_at
       FROM users WHERE id = ?`,
      [id]
    );

    const users = rows as any[];
    if (users.length === 0) throw new Error("User not found");

    return mapDbUserToAuthUser(users[0]);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
}

export async function getUserWithPassword(
  email: string
): Promise<(AuthUser & { passwordHash: string }) | null> {
  try {
    const [rows] = await pool.execute(
      `SELECT id, email, username, password_hash, first_name, last_name, avatar, bio, website, location,
              instagram, twitter, behance, dribbble, role, verified, followers_count,
              following_count, uploads_count, total_views, total_downloads, created_at, updated_at
       FROM users WHERE email = ?`,
      [email]
    );

    const users = rows as any[];
    if (users.length === 0) return null;

    const user = mapDbUserToAuthUser(users[0]);
    return { ...user, passwordHash: users[0].password_hash };
  } catch (error) {
    console.error("Error getting user with password:", error);
    return null;
  }
}

export async function saveSession(
  userId: string,
  token: string
): Promise<void> {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await pool.execute(
      "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, token, expiresAt]
    );
  } catch (error) {
    console.error("Error saving session:", error);
    throw error;
  }
}

export async function deleteSession(token: string): Promise<void> {
  try {
    await pool.execute("DELETE FROM user_sessions WHERE token = ?", [token]);
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
}

export async function validateSession(token: string): Promise<AuthUser | null> {
  try {
    const [rows] = await pool.execute(
      `SELECT u.id, u.email, u.username, u.first_name, u.last_name, u.avatar, u.bio, u.website, u.location,
              u.instagram, u.twitter, u.behance, u.dribbble, u.role, u.verified, u.followers_count,
              u.following_count, u.uploads_count, u.total_views, u.total_downloads, u.created_at, u.updated_at
       FROM user_sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.token = ? AND s.expires_at > NOW()`,
      [token]
    );

    const users = rows as any[];
    if (users.length === 0) return null;

    return mapDbUserToAuthUser(users[0]);
  } catch (error) {
    console.error("Error validating session:", error);
    return null;
  }
}

function mapDbUserToAuthUser(dbUser: any): AuthUser {
  return {
    id: dbUser.id,
    email: dbUser.email,
    username: dbUser.username,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    avatar: dbUser.avatar,
    bio: dbUser.bio,
    website: dbUser.website,
    location: dbUser.location,
    socialLinks: {
      instagram: dbUser.instagram,
      twitter: dbUser.twitter,
      behance: dbUser.behance,
      dribbble: dbUser.dribbble,
    },
    role: dbUser.role,
    verified: dbUser.verified,
    followersCount: dbUser.followers_count,
    followingCount: dbUser.following_count,
    uploadsCount: dbUser.uploads_count,
    totalViews: dbUser.total_views,
    totalDownloads: dbUser.total_downloads,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
  };
}
