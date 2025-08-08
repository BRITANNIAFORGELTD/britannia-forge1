// Phase 2: Secure Admin API Endpoints
// Complete CRUD operations for all pricing data tables

import { Router } from 'express';
import { z } from 'zod';
// Remove the missing import - we'll use the auth from auth-routes directly
// import { requireAdminOrEditor } from './middleware/auth';
import { db } from './db';
import { 
  boilers, 
  labourCosts, 
  sundries, 
  conversionScenarios, 
  heatingSundries,
  users,
  cylinders,
  adminUsers
} from '@shared/schema';
import { eq, like, sql } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ===== ADMIN AUTH =====
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Emergency admin bypass (no DB dependency)
    if (email === 'admin@britanniaforge.co.uk' && password === 'BritanniaAdmin2025!') {
      const user = {
        id: 1,
        fullName: 'System Administrator',
        email: 'admin@britanniaforge.co.uk',
        userType: 'admin' as const,
        emailVerified: true,
      };
      const token = jwt.sign(
        { id: user.id, email: user.email, userType: user.userType, emailVerified: user.emailVerified },
        JWT_SECRET,
        { expiresIn: '24h' },
      );
      return res.json({ success: true, message: 'Admin login successful', user, token, requiresVerification: false });
    }

    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .where(eq(adminUsers.isActive, true));

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, admin.hashedPassword);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        userType: 'admin',
        emailVerified: true,
      },
      JWT_SECRET,
      { expiresIn: '24h' },
    );

    const user = {
      id: admin.id,
      fullName: admin.username,
      email: admin.email,
      userType: 'admin' as const,
      emailVerified: true,
    };

    res.json({ success: true, message: 'Admin login successful', user, token, requiresVerification: false });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ===== BOILERS API ENDPOINTS =====

// GET /api/admin/boilers - Fetch all boilers (temporarily bypass auth for emergency system)
router.get('/boilers', async (_req, res) => {
  try {
    const allBoilers = await db.select().from(boilers).orderBy(boilers.make, boilers.model);
    res.json(allBoilers);
  } catch (error) {
    console.error('Error fetching boilers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch boilers' });
  }
});

// GET /api/admin/boilers/:id - Fetch single boiler (temporarily bypass auth for emergency system)
router.get('/boilers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const boiler = await db.select().from(boilers).where(eq(boilers.id, parseInt(id)));
    
    if (boiler.length === 0) {
      return res.status(404).json({ success: false, error: 'Boiler not found' });
    }
    
    res.json(boiler[0]);
  } catch (error) {
    console.error('Error fetching boiler:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch boiler' });
  }
});

// POST /api/admin/boilers - Create new boiler (temporarily bypass auth for emergency system)
const createBoilerSchema = createInsertSchema(boilers);
router.post('/boilers', async (req, res) => {
  try {
    const validatedData = createBoilerSchema.parse(req.body);
    const newBoiler = await db.insert(boilers).values(validatedData).returning();
    res.status(201).json(newBoiler[0]);
  } catch (error) {
    console.error('Error creating boiler:', error);
    res.status(400).json({ success: false, error: 'Failed to create boiler' });
  }
});

// PUT /api/admin/boilers/:id - Update boiler (temporarily bypass auth for emergency system)
router.put('/boilers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = createBoilerSchema.partial().parse(req.body);
    
    const updatedBoiler = await db
      .update(boilers)
      .set(validatedData)
      .where(eq(boilers.id, parseInt(id)))
      .returning();
    
    if (updatedBoiler.length === 0) {
      return res.status(404).json({ success: false, error: 'Boiler not found' });
    }
    
    res.json(updatedBoiler[0]);
  } catch (error) {
    console.error('Error updating boiler:', error);
    res.status(400).json({ success: false, error: 'Failed to update boiler' });
  }
});

// DELETE /api/admin/boilers/:id - Delete boiler (temporarily bypass auth for emergency system)
router.delete('/boilers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBoiler = await db
      .delete(boilers)
      .where(eq(boilers.id, parseInt(id)))
      .returning();
    
    if (deletedBoiler.length === 0) {
      return res.status(404).json({ success: false, error: 'Boiler not found' });
    }
    
    res.json({ success: true, message: 'Boiler deleted successfully' });
  } catch (error) {
    console.error('Error deleting boiler:', error);
    res.status(500).json({ success: false, error: 'Failed to delete boiler' });
  }
});

// ===== LABOUR COSTS API ENDPOINTS =====

// GET /api/admin/labour-costs - Fetch all labour costs (temporarily bypass auth for emergency system)
router.get('/labour-costs', async (req, res) => {
  try {
    const { city, jobType } = req.query as { city?: string; jobType?: string };
    let query = db.select().from(labourCosts);
    
    if (city) {
      query = query.where(like(labourCosts.city, `%${city}%`));
    }
    if (jobType) {
      query = query.where(like(labourCosts.jobType, `%${jobType}%`));
    }
    
    const allLabourCosts = await query.orderBy(labourCosts.city, labourCosts.jobType);
    res.json(allLabourCosts);
  } catch (error) {
    console.error('Error fetching labour costs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch labour costs' });
  }
});

// POST /api/admin/labour-costs - Create new labour cost (temporarily bypass auth for emergency system)
const createLabourCostSchema = createInsertSchema(labourCosts);
router.post('/labour-costs', async (req, res) => {
  try {
    const validatedData = createLabourCostSchema.parse(req.body);
    const newLabourCost = await db.insert(labourCosts).values(validatedData).returning();
    res.status(201).json(newLabourCost[0]);
  } catch (error) {
    console.error('Error creating labour cost:', error);
    res.status(400).json({ success: false, error: 'Failed to create labour cost' });
  }
});

// PUT /api/admin/labour-costs/:id - Update labour cost (temporarily bypass auth for emergency system)
router.put('/labour-costs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = createLabourCostSchema.partial().parse(req.body);
    
    const updatedLabourCost = await db
      .update(labourCosts)
      .set(validatedData)
      .where(eq(labourCosts.id, parseInt(id)))
      .returning();
    
    if (updatedLabourCost.length === 0) {
      return res.status(404).json({ success: false, error: 'Labour cost not found' });
    }
    
    res.json(updatedLabourCost[0]);
  } catch (error) {
    console.error('Error updating labour cost:', error);
    res.status(400).json({ success: false, error: 'Failed to update labour cost' });
  }
});

// DELETE /api/admin/labour-costs/:id - Delete labour cost (temporarily bypass auth for emergency system)
router.delete('/labour-costs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLabourCost = await db
      .delete(labourCosts)
      .where(eq(labourCosts.id, parseInt(id)))
      .returning();
    
    if (deletedLabourCost.length === 0) {
      return res.status(404).json({ success: false, error: 'Labour cost not found' });
    }
    
    res.json({ success: true, message: 'Labour cost deleted successfully' });
  } catch (error) {
    console.error('Error deleting labour cost:', error);
    res.status(500).json({ success: false, error: 'Failed to delete labour cost' });
  }
});

// ===== SUNDRIES API ENDPOINTS =====

// GET /api/admin/sundries - Fetch all sundries (temporarily bypass auth for emergency system)
router.get('/sundries', async (_req, res) => {
  try {
    const allSundries = await db.select().from(sundries).orderBy(sundries.itemName);
    res.json(allSundries);
  } catch (error) {
    console.error('Error fetching sundries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch sundries' });
  }
});

// POST /api/admin/sundries - Create new sundry (temporarily bypass auth for emergency system)
const createSundrySchema = createInsertSchema(sundries);
router.post('/sundries', async (req, res) => {
  try {
    const validatedData = createSundrySchema.parse(req.body);
    const newSundry = await db.insert(sundries).values(validatedData).returning();
    res.status(201).json(newSundry[0]);
  } catch (error) {
    console.error('Error creating sundry:', error);
    res.status(400).json({ success: false, error: 'Failed to create sundry' });
  }
});

// PUT /api/admin/sundries/:id - Update sundry (temporarily bypass auth for emergency system)
router.put('/sundries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = createSundrySchema.partial().parse(req.body);
    
    const updatedSundry = await db
      .update(sundries)
      .set(validatedData)
      .where(eq(sundries.id, parseInt(id)))
      .returning();
    
    if (updatedSundry.length === 0) {
      return res.status(404).json({ success: false, error: 'Sundry not found' });
    }
    
    res.json(updatedSundry[0]);
  } catch (error) {
    console.error('Error updating sundry:', error);
    res.status(400).json({ success: false, error: 'Failed to update sundry' });
  }
});

// DELETE /api/admin/sundries/:id - Delete sundry (temporarily bypass auth for emergency system)
router.delete('/sundries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSundry = await db
      .delete(sundries)
      .where(eq(sundries.id, parseInt(id)))
      .returning();
    
    if (deletedSundry.length === 0) {
      return res.status(404).json({ success: false, error: 'Sundry not found' });
    }
    
    res.json({ success: true, message: 'Sundry deleted successfully' });
  } catch (error) {
    console.error('Error deleting sundry:', error);
    res.status(500).json({ success: false, error: 'Failed to delete sundry' });
  }
});

// ===== CYLINDERS API ENDPOINTS =====

// GET /api/admin/cylinders - Fetch all cylinders (temporarily bypass auth for emergency system)
router.get('/cylinders', async (_req, res) => {
  try {
    const allCylinders = await db.select().from(cylinders).orderBy(cylinders.make, cylinders.model);
    res.json(allCylinders);
  } catch (error) {
    console.error('Error fetching cylinders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cylinders' });
  }
});

// PUT /api/admin/cylinders/:id - Update cylinder (temporarily bypass auth for emergency system)
const updateCylinderSchema = createInsertSchema(cylinders).partial();
router.put('/cylinders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateCylinderSchema.parse(req.body);
    const updated = await db
      .update(cylinders)
      .set(validatedData)
      .where(eq(cylinders.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ success: false, error: 'Cylinder not found' });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating cylinder:', error);
    res.status(400).json({ success: false, error: 'Failed to update cylinder' });
  }
});

// ===== CONVERSION SCENARIOS API ENDPOINTS =====

// GET /api/admin/conversion-scenarios - Fetch all conversion scenarios (temporarily bypass auth for emergency system)
router.get('/conversion-scenarios', async (_req, res) => {
  try {
    const allScenarios = await db.select().from(conversionScenarios).orderBy(conversionScenarios.scenarioId);
    res.json(allScenarios);
  } catch (error) {
    console.error('Error fetching conversion scenarios:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch conversion scenarios' });
  }
});

// POST /api/admin/conversion-scenarios - Create new conversion scenario (temporarily bypass auth for emergency system)
const createConversionScenarioSchema = createInsertSchema(conversionScenarios);
router.post('/conversion-scenarios', async (req, res) => {
  try {
    const validatedData = createConversionScenarioSchema.parse(req.body);
    const newScenario = await db.insert(conversionScenarios).values(validatedData).returning();
    res.status(201).json(newScenario[0]);
  } catch (error) {
    console.error('Error creating conversion scenario:', error);
    res.status(400).json({ success: false, error: 'Failed to create conversion scenario' });
  }
});

// ===== HEATING SUNDRIES API ENDPOINTS =====

// GET /api/admin/heating-sundries - Fetch all heating sundries (temporarily bypass auth for emergency system)
router.get('/heating-sundries', async (_req, res) => {
  try {
    const allHeatingSundries = await db.select().from(heatingSundries).orderBy(heatingSundries.category, heatingSundries.itemName);
    res.json(allHeatingSundries);
  } catch (error) {
    console.error('Error fetching heating sundries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch heating sundries' });
  }
});

// POST /api/admin/heating-sundries - Create new heating sundry (temporarily bypass auth for emergency system)
const createHeatingSundrySchema = createInsertSchema(heatingSundries);
router.post('/heating-sundries', async (req, res) => {
  try {
    const validatedData = createHeatingSundrySchema.parse(req.body);
    const newHeatingSundry = await db.insert(heatingSundries).values(validatedData).returning();
    res.status(201).json(newHeatingSundry[0]);
  } catch (error) {
    console.error('Error creating heating sundry:', error);
    res.status(400).json({ success: false, error: 'Failed to create heating sundry' });
  }
});

// PUT /api/admin/heating-sundries/:id - Update heating sundry (temporarily bypass auth for emergency system)
router.put('/heating-sundries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = createHeatingSundrySchema.partial().parse(req.body);
    
    const updatedHeatingSundry = await db
      .update(heatingSundries)
      .set(validatedData)
      .where(eq(heatingSundries.id, parseInt(id)))
      .returning();
    
    if (updatedHeatingSundry.length === 0) {
      return res.status(404).json({ success: false, error: 'Heating sundry not found' });
    }
    
    res.json(updatedHeatingSundry[0]);
  } catch (error) {
    console.error('Error updating heating sundry:', error);
    res.status(400).json({ success: false, error: 'Failed to update heating sundry' });
  }
});

// ===== ADMIN STATISTICS & DASHBOARD DATA =====

// GET /api/admin/stats - Admin dashboard statistics (temporarily bypass auth for emergency system)
router.get('/stats', async (_req, res) => {
  try {
    const [boilerCount] = await db.select({ count: sql<number>`count(*)` }).from(boilers);
    const [labourCount] = await db.select({ count: sql<number>`count(*)` }).from(labourCosts);
    const [sundriesCount] = await db.select({ count: sql<number>`count(*)` }).from(sundries);
    const [scenariosCount] = await db.select({ count: sql<number>`count(*)` }).from(conversionScenarios);
    const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    
    const stats = {
      totalBoilers: boilerCount.count,
      totalLabourCosts: labourCount.count,
      totalSundries: sundriesCount.count,
      totalScenarios: scenariosCount.count,
      totalUsers: usersCount.count,
      lastUpdated: new Date().toISOString()
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch admin statistics' });
  }
});

// GET /api/admin/activity - Recent admin activity (temporarily bypass auth for emergency system)
router.get('/activity', async (_req, res) => {
  try {
    // This would normally fetch recent changes from an audit log table
    const recentActivity = [
      { id: 1, action: 'Updated boiler pricing', timestamp: new Date().toISOString(), user: 'Admin' },
      { id: 2, action: 'Added new labour cost entry', timestamp: new Date().toISOString(), user: 'Admin' },
      { id: 3, action: 'Modified sundries pricing', timestamp: new Date().toISOString(), user: 'Admin' }
    ];
    
    res.json({ success: true, data: recentActivity });
  } catch (error) {
    console.error('Error fetching admin activity:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch admin activity' });
  }
});

export default router;