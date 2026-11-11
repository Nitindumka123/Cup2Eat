import { Router } from 'express';
import { getDatabaseStats } from '../db';

export const healthRouter = Router();

// GET /api/health - Health check endpoint
healthRouter.get('/health', async (req, res) => {
  try {
    const stats = await getDatabaseStats();
    res.json({
      status: 'ok',
      service: 'Cup2Eat Backend API',
      timestamp: new Date().toISOString(),
      database: 'connected',
      active_products: stats.products,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      service: 'Cup2Eat Backend API',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// GET /api/admin/stats - Internal administrative verification stats
healthRouter.get('/admin/stats', async (req, res) => {
  try {
    const stats = await getDatabaseStats();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      counts: stats,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
