import express from 'express';
import dotenv from 'dotenv';
import { productsRouter } from './routes/products';
import { enquiriesRouter } from './routes/enquiries';
import { wholesaleRouter } from './routes/wholesale';
import { b2bRouter } from './routes/b2b';
import { healthRouter } from './routes/health';
import { handleCreateOrder, handleGetOrderDetails } from './routes/orders';
import {
  handleAdminLogin,
  handleAdminLogout,
  handleGetAdminMe,
  handleGetDashboardStats,
  handleGetAdminOrders,
  handleUpdateAdminOrder,
  handleUpdateAdminB2B,
  handleUpdateAdminWholesale,
  handleGetAdminProducts,
  handleUpdateAdminProduct,
  handleGetAdminSettings,
  handleUpdateAdminSettings,
  adminAuthMiddleware,
} from './routes/admin';
import { getSiteSettings, initDatabase } from './db';

dotenv.config();

export const app = express();

// Security & Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// CORS configuration for local & preview origins
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 1. Public API Routes
app.use('/api', healthRouter);
app.use('/api/products', productsRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/wholesale-enquiries', wholesaleRouter);
app.use('/api/b2b-enquiries', b2bRouter);

// Public Order Endpoints
app.post('/api/orders', handleCreateOrder);
app.get('/api/orders/:id', handleGetOrderDetails);

// Public Settings Endpoint
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getSiteSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
});

// 2. Unprotected Admin Auth Endpoints
app.post('/api/admin/login', handleAdminLogin);
app.post('/api/admin/logout', handleAdminLogout);

// 3. Protected Admin API Endpoints (adminAuthMiddleware)
app.use('/api/admin/*', adminAuthMiddleware);

app.get('/api/admin/me', handleGetAdminMe);
app.get('/api/admin/dashboard-stats', handleGetDashboardStats);

app.get('/api/admin/orders', handleGetAdminOrders);
app.put('/api/admin/orders/:id', handleUpdateAdminOrder);

app.put('/api/admin/b2b-enquiries/:id', handleUpdateAdminB2B);
app.put('/api/admin/wholesale-enquiries/:id', handleUpdateAdminWholesale);

app.get('/api/admin/products', handleGetAdminProducts);
app.put('/api/admin/products/:id', handleUpdateAdminProduct);

app.get('/api/admin/settings', handleGetAdminSettings);
app.put('/api/admin/settings', handleUpdateAdminSettings);

// Database initialization promise
let dbInitialized = false;
export async function ensureDbReady() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// Global 404 Handler for /api/*
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route '${req.originalUrl}' not found.`,
  });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Internal Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});
