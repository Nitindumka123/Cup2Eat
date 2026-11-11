import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  ProductRecord,
  EnquiryRecord,
  WholesaleEnquiryRecord,
  B2BEnquiryRecord,
  OrderRecord,
  SiteSettingsRecord,
  AdminUserRecord,
  AdminSessionRecord,
} from './types';

const dbPath = path.join(process.cwd(), 'dev.db.json');

interface DatabaseStore {
  products: ProductRecord[];
  enquiries: EnquiryRecord[];
  wholesale_enquiries: WholesaleEnquiryRecord[];
  b2b_enquiries: B2BEnquiryRecord[];
  orders: OrderRecord[];
  site_settings: SiteSettingsRecord;
  admin_users: AdminUserRecord[];
  admin_sessions: AdminSessionRecord[];
}

const defaultSettings: SiteSettingsRecord = {
  id: 'site-settings',
  promotional_wholesale_price: 3999,
  promotional_wholesale_cups: 396,
  promotional_wholesale_title: '396 Edible Cups for ₹3,999',
  promotional_banner_active: true,
  accepting_orders: true,
  contact_phone: '9818192575',
  contact_email: 'Varunkhera6@gmail.com',
  updated_at: new Date().toISOString(),
};

let memoryDb: DatabaseStore = {
  products: [],
  enquiries: [],
  wholesale_enquiries: [],
  b2b_enquiries: [],
  orders: [],
  site_settings: defaultSettings,
  admin_users: [],
  admin_sessions: [],
};

// Helper: Password Hashing
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Load existing database from disk if present
function loadDatabase() {
  try {
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf-8');
      const loaded = JSON.parse(raw);
      memoryDb = {
        products: loaded.products || [],
        enquiries: loaded.enquiries || [],
        wholesale_enquiries: loaded.wholesale_enquiries || [],
        b2b_enquiries: loaded.b2b_enquiries || [],
        orders: loaded.orders || [],
        site_settings: loaded.site_settings || defaultSettings,
        admin_users: loaded.admin_users || [],
        admin_sessions: loaded.admin_sessions || [],
      };
    }
  } catch (err) {
    console.error('⚠️ Warning reading DB file, starting fresh:', err);
  }
}

// Persist memory store to disk atomically
function saveDatabase() {
  try {
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('❌ Error persisting database to disk:', err);
  }
}

// Database initialisation and seeding
export async function initDatabase() {
  loadDatabase();

  // Seed default products if missing
  const seedItems: ProductRecord[] = [
    {
      id: 'prod-chocolate',
      slug: 'chocolate-edible-cup',
      name: 'Chocolate Edible Cup',
      description: 'Crafted with premium cocoa and a golden crispy waffle weave. Retains hot liquids up to 85°C while staying deliciously crisp for 45+ minutes.',
      flavour: 'Chocolate',
      capacity_ml: 100,
      price: 15,
      active: true,
      image_url: '/src/assets/images/flavor_chocolate_cup_1794364085690.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-vanilla',
      slug: 'vanilla-edible-cup',
      name: 'Vanilla Edible Cup',
      description: 'Infused with natural vanilla aroma and baked to golden waffle perfection. Provides a gentle, balanced sweetness that complements specialty teas and lattes.',
      flavour: 'Vanilla',
      capacity_ml: 100,
      price: 15,
      active: true,
      image_url: '/src/assets/images/flavor_vanilla_cup_1794364085246.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-elaichi',
      slug: 'elaichi-edible-cup',
      name: 'Elaichi (Cardamom) Edible Cup',
      description: 'Specially developed for authentic Indian tea lovers. Real green cardamom notes baked directly into the crisp container.',
      flavour: 'Elaichi',
      capacity_ml: 100,
      price: 15,
      active: true,
      image_url: '/src/assets/images/flavor_elaichi_cup_1794364086233.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-wholesale-mix',
      slug: 'wholesale-mix-box',
      name: 'Wholesale Mix Box (396 Cups)',
      description: 'Promotional wholesale box deal containing 396 edible 100ml cups in an assortment of Chocolate, Vanilla, and Elaichi flavours with nationwide delivery included.',
      flavour: 'Mixed Assortment',
      capacity_ml: 100,
      price: 3999,
      active: true,
      image_url: '/src/assets/images/wholesale_box_packaging_1794364086788.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  for (const item of seedItems) {
    const exists = memoryDb.products.some((p) => p.slug === item.slug);
    if (!exists) {
      memoryDb.products.push(item);
    }
  }

  // Seed Admin User if missing or sync password for Varun@123
  const adminEmail = 'dumkanitin0@gmail.com';
  const defaultPassword = process.env.ADMIN_PASSWORD || 'Varun@123';
  const existingAdmin = memoryDb.admin_users.find((u) => u.email === adminEmail);
  if (!existingAdmin) {
    const salt = generateSalt();
    const password_hash = hashPassword(defaultPassword, salt);

    memoryDb.admin_users.push({
      id: 'usr-admin-primary',
      email: adminEmail,
      password_hash,
      salt,
      name: 'Varun Khera (Administrator)',
      role: 'superadmin',
      created_at: new Date().toISOString(),
    });
  } else {
    // Ensure Varun@123 works on existing databases
    const salt = generateSalt();
    existingAdmin.password_hash = hashPassword(defaultPassword, salt);
    existingAdmin.salt = salt;
  }

  saveDatabase();
  console.log(`✅ Database initialized with persistent storage at ${dbPath}`);
}

// ----------------------------------------------------
// Product CRUD Operations
// ----------------------------------------------------
export async function getProducts(includeInactive = false): Promise<ProductRecord[]> {
  loadDatabase();
  return includeInactive ? memoryDb.products : memoryDb.products.filter((p) => p.active);
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  loadDatabase();
  return memoryDb.products.find((p) => p.slug === slug && p.active) || null;
}

export async function updateProduct(id: string, updates: Partial<ProductRecord>): Promise<ProductRecord | null> {
  loadDatabase();
  const index = memoryDb.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  memoryDb.products[index] = {
    ...memoryDb.products[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  saveDatabase();
  return memoryDb.products[index];
}

// ----------------------------------------------------
// Enquiry Operations
// ----------------------------------------------------
export async function insertEnquiry(record: EnquiryRecord): Promise<EnquiryRecord> {
  loadDatabase();
  memoryDb.enquiries.unshift(record);
  saveDatabase();
  return record;
}

export async function insertWholesaleEnquiry(record: WholesaleEnquiryRecord): Promise<WholesaleEnquiryRecord> {
  loadDatabase();
  memoryDb.wholesale_enquiries.unshift(record);
  saveDatabase();
  return record;
}

export async function insertB2BEnquiry(record: B2BEnquiryRecord): Promise<B2BEnquiryRecord> {
  loadDatabase();
  memoryDb.b2b_enquiries.unshift(record);
  saveDatabase();
  return record;
}

export async function updateB2BEnquiryStatus(
  id: string,
  status: string,
  internal_notes?: string
): Promise<B2BEnquiryRecord | null> {
  loadDatabase();
  const index = memoryDb.b2b_enquiries.findIndex((e) => e.id === id);
  if (index === -1) return null;

  memoryDb.b2b_enquiries[index] = {
    ...memoryDb.b2b_enquiries[index],
    status,
    internal_notes: internal_notes !== undefined ? internal_notes : memoryDb.b2b_enquiries[index].internal_notes,
    updated_at: new Date().toISOString(),
  };

  saveDatabase();
  return memoryDb.b2b_enquiries[index];
}

export async function updateWholesaleEnquiryStatus(
  id: string,
  status: string
): Promise<WholesaleEnquiryRecord | null> {
  loadDatabase();
  const index = memoryDb.wholesale_enquiries.findIndex((e) => e.id === id);
  if (index === -1) return null;

  memoryDb.wholesale_enquiries[index] = {
    ...memoryDb.wholesale_enquiries[index],
    status,
    updated_at: new Date().toISOString(),
  };

  saveDatabase();
  return memoryDb.wholesale_enquiries[index];
}

// ----------------------------------------------------
// Customer Orders System
// ----------------------------------------------------
export async function insertOrder(order: OrderRecord): Promise<OrderRecord> {
  loadDatabase();
  memoryDb.orders.unshift(order);
  saveDatabase();
  return order;
}

export async function getOrders(): Promise<OrderRecord[]> {
  loadDatabase();
  return memoryDb.orders;
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  loadDatabase();
  return memoryDb.orders.find((o) => o.id === id || o.order_reference === id) || null;
}

export async function updateOrderStatus(
  id: string,
  updates: Partial<OrderRecord>
): Promise<OrderRecord | null> {
  loadDatabase();
  const index = memoryDb.orders.findIndex((o) => o.id === id || o.order_reference === id);
  if (index === -1) return null;

  memoryDb.orders[index] = {
    ...memoryDb.orders[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  saveDatabase();
  return memoryDb.orders[index];
}

// ----------------------------------------------------
// Site Settings
// ----------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettingsRecord> {
  loadDatabase();
  return memoryDb.site_settings;
}

export async function updateSiteSettings(updates: Partial<SiteSettingsRecord>): Promise<SiteSettingsRecord> {
  loadDatabase();
  memoryDb.site_settings = {
    ...memoryDb.site_settings,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  saveDatabase();
  return memoryDb.site_settings;
}

// ----------------------------------------------------
// Admin Auth & Sessions
// ----------------------------------------------------
export async function authenticateAdmin(email: string, password: string): Promise<{ user: AdminUserRecord; token: string } | null> {
  loadDatabase();
  const user = memoryDb.admin_users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;

  const hash = hashPassword(password, user.salt);
  if (hash !== user.password_hash) return null;

  const token = `adm-sec-${crypto.randomBytes(24).toString('hex')}`;
  const session: AdminSessionRecord = {
    token,
    admin_id: user.id,
    email: user.email,
    expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  memoryDb.admin_sessions.push(session);
  saveDatabase();

  return { user, token };
}

export async function verifyAdminToken(token: string): Promise<AdminUserRecord | null> {
  loadDatabase();
  const session = memoryDb.admin_sessions.find((s) => s.token === token && s.expires_at > Date.now());
  if (!session) return null;

  const user = memoryDb.admin_users.find((u) => u.id === session.admin_id);
  return user || null;
}

export async function revokeAdminToken(token: string): Promise<boolean> {
  loadDatabase();
  const initialLen = memoryDb.admin_sessions.length;
  memoryDb.admin_sessions = memoryDb.admin_sessions.filter((s) => s.token !== token);
  saveDatabase();
  return memoryDb.admin_sessions.length < initialLen;
}

// ----------------------------------------------------
// Dashboard Analytics & Metrics
// ----------------------------------------------------
export async function getDashboardMetrics() {
  loadDatabase();

  const totalOrders = memoryDb.orders.length;
  const newOrders = memoryDb.orders.filter((o) => o.status === 'NEW').length;
  const pendingOrders = memoryDb.orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PROCESSING').length;
  const deliveredOrders = memoryDb.orders.filter((o) => o.status === 'DELIVERED').length;

  const totalRevenue = memoryDb.orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const wholesaleEnquiriesCount = memoryDb.wholesale_enquiries.length;
  const newB2bEnquiriesCount = memoryDb.b2b_enquiries.filter((b) => b.status === 'NEW').length;

  return {
    total_orders: totalOrders,
    new_orders: newOrders,
    pending_orders: pendingOrders,
    delivered_orders: deliveredOrders,
    calculated_revenue: totalRevenue,
    wholesale_enquiries_count: wholesaleEnquiriesCount,
    new_b2b_enquiries_count: newB2bEnquiriesCount,
    total_b2b_enquiries_count: memoryDb.b2b_enquiries.length,
    total_general_enquiries_count: memoryDb.enquiries.length,
  };
}

export async function getDatabaseStats() {
  loadDatabase();
  return {
    products: memoryDb.products.length,
    general_enquiries: memoryDb.enquiries.length,
    wholesale_enquiries: memoryDb.wholesale_enquiries.length,
    b2b_enquiries: memoryDb.b2b_enquiries.length,
    orders: memoryDb.orders.length,
    admin_users: memoryDb.admin_users.length,
    total_records:
      memoryDb.products.length +
      memoryDb.enquiries.length +
      memoryDb.wholesale_enquiries.length +
      memoryDb.b2b_enquiries.length +
      memoryDb.orders.length,
  };
}
