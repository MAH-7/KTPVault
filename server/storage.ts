import { type IcUser, type InsertIcUser } from "@shared/schema";
import { db } from './db';
import { usersIc } from '@shared/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export interface IStorage {
  // IC User operations
  createIcUser(user: InsertIcUser): Promise<IcUser>;
  getIcUserByHash(hashIc: string): Promise<IcUser | undefined>;
  getAllIcUsers(): Promise<IcUser[]>;
  searchIcUsers(searchTerm: string): Promise<IcUser[]>;
}

export class DatabaseStorage implements IStorage {
  async createIcUser(insertUser: InsertIcUser): Promise<IcUser> {
    const result = await db.insert(usersIc).values(insertUser).returning();
    return result[0];
  }

  async getIcUserByHash(hashIc: string): Promise<IcUser | undefined> {
    const result = await db.select().from(usersIc).where(eq(usersIc.hashIc, hashIc)).limit(1);
    return result[0];
  }

  async getAllIcUsers(): Promise<IcUser[]> {
    return await db.select().from(usersIc).orderBy(usersIc.createdAt);
  }

  async searchIcUsers(searchTerm: string): Promise<IcUser[]> {
    const result = await db
      .select()
      .from(usersIc)
      .where(eq(usersIc.fullName, searchTerm))
      .orderBy(usersIc.createdAt);
    return result;
  }
}

// Utility function to hash IC numbers
export function hashIcNumber(icNumber: string): string {
  return crypto.createHash('sha256').update(icNumber).digest('hex');
}

export const storage = new DatabaseStorage();
