import { type IcUser, type InsertIcUser } from "@shared/schema";
import { supabase } from './supabase';
import crypto from 'crypto';

export interface IStorage {
  // IC User operations
  createIcUser(user: InsertIcUser): Promise<IcUser>;
  getIcUserByHash(hashIc: string): Promise<IcUser | undefined>;
  getAllIcUsers(): Promise<IcUser[]>;
  searchIcUsers(searchTerm: string): Promise<IcUser[]>;
}

export class SupabaseStorage implements IStorage {
  async createIcUser(insertUser: InsertIcUser): Promise<IcUser> {
    const { data, error } = await supabase
      .from('users_ic')
      .insert({
        hash_ic: insertUser.hashIc,
        full_name: insertUser.fullName,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return {
      id: data.id,
      hashIc: data.hash_ic,
      fullName: data.full_name,
      createdAt: data.created_at,
    };
  }

  async getIcUserByHash(hashIc: string): Promise<IcUser | undefined> {
    const { data, error } = await supabase
      .from('users_ic')
      .select('*')
      .eq('hash_ic', hashIc)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return undefined;
      }
      console.error('Supabase select error:', error);
      throw new Error(`Failed to get user: ${error.message}`);
    }

    if (!data) return undefined;

    return {
      id: data.id,
      hashIc: data.hash_ic,
      fullName: data.full_name,
      createdAt: data.created_at,
    };
  }

  async getAllIcUsers(): Promise<IcUser[]> {
    const { data, error } = await supabase
      .from('users_ic')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select all error:', error);
      throw new Error(`Failed to get users: ${error.message}`);
    }

    return (data || []).map(row => ({
      id: row.id,
      hashIc: row.hash_ic,
      fullName: row.full_name,
      createdAt: row.created_at,
    }));
  }

  async searchIcUsers(searchTerm: string): Promise<IcUser[]> {
    const { data, error } = await supabase
      .from('users_ic')
      .select('*')
      .eq('full_name', searchTerm)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase search error:', error);
      throw new Error(`Failed to search users: ${error.message}`);
    }

    return (data || []).map(row => ({
      id: row.id,
      hashIc: row.hash_ic,
      fullName: row.full_name,
      createdAt: row.created_at,
    }));
  }
}

// Utility function to hash IC numbers
export function hashIcNumber(icNumber: string): string {
  return crypto.createHash('sha256').update(icNumber).digest('hex');
}

export const storage = new SupabaseStorage();
