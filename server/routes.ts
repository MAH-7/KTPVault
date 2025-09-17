import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, hashIcNumber } from "./storage";
import { insertIcUserSchema } from "@shared/schema";
import { z } from "zod";
import { supabase } from "./supabase";
import { requireAdmin } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // IC Registration endpoint
  app.post('/api/register', async (req, res) => {
    try {
      // Validate request body
      const { icNumber, fullName } = req.body;
      
      if (!icNumber || !fullName) {
        return res.status(400).json({ error: 'IC Number and Full Name are required' });
      }
      
      // Validate IC number format
      if (!/^\d{12}$/.test(icNumber)) {
        return res.status(400).json({ error: 'IC Number must be exactly 12 digits' });
      }
      
      // Validate full name format
      if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) {
        return res.status(400).json({ error: 'Full name must contain only letters and spaces' });
      }
      
      // Hash the IC number
      const hashIc = hashIcNumber(icNumber);
      
      // Check if IC already exists
      const existingUser = await storage.getIcUserByHash(hashIc);
      if (existingUser) {
        return res.status(409).json({ error: 'IC telah didaftar' });
      }
      
      // Create new user
      const newUser = await storage.createIcUser({
        hashIc,
        fullName: fullName.trim().toUpperCase()
      });
      
      res.json({ 
        success: true, 
        message: 'Berjaya didaftar',
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          createdAt: newUser.createdAt
        }
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Admin authentication routes
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      res.json({ 
        user: data.user,
        session: data.session,
        access_token: data.session?.access_token
      });
      
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.post('/api/admin/logout', async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ error: 'Logout failed' });
      }
      
      res.json({ message: 'Logged out successfully' });
      
    } catch (error) {
      console.error('Admin logout error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Protected admin endpoints
  app.get('/api/admin/users', requireAdmin, async (req, res) => {
    try {
      const { search } = req.query;
      
      let users;
      if (search && typeof search === 'string') {
        users = await storage.searchIcUsers(search.toUpperCase());
      } else {
        users = await storage.getAllIcUsers();
      }
      
      res.json({ users });
    } catch (error) {
      console.error('Admin users fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Protected CSV export endpoint
  app.get('/api/admin/export-csv', requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllIcUsers();
      
      // Create CSV content
      const csvHeaders = ['ID', 'Hash IC', 'Full Name', 'Created At'];
      const csvRows = users.map(user => [
        user.id,
        user.hashIc,
        user.fullName,
        new Date(user.createdAt || '').toISOString()
      ]);
      
      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="ic-registrations.csv"');
      res.send(csvContent);
      
    } catch (error) {
      console.error('CSV export error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
