import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { app as apiApp, ensureDbReady } from './server/app';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  // Ensure SQLite Database is initialized & seeded
  await ensureDbReady();

  const mainApp = express();

  // Mount API Sub-app
  mainApp.use(apiApp);

  if (!isProduction) {
    // Development mode: Mount Vite dev server middleware
    console.log('⚡ Starting Vite Middleware Development Server...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    mainApp.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files from dist/
    const distPath = path.join(process.cwd(), 'dist');
    mainApp.use(express.static(distPath));

    mainApp.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  mainApp.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Cup2Eat Full-Stack Server running at http://0.0.0.0:${PORT}`);
    console.log(`📡 API Endpoints active at http://0.0.0.0:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
