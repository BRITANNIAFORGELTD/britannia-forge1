// Production server entry point for Vercel deployment
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create express app
const app = express();

// Production configuration
process.env.NODE_ENV = 'production';

// Build frontend first
console.log('Building frontend...');
try {
  execSync('cd client && npm install && npm run build', { stdio: 'inherit' });
  console.log('Frontend built successfully');
} catch (error) {
  console.error('Frontend build failed:', error.message);
  console.log('Attempting fallback build...');
  try {
    execSync('cd client && npm run build', { stdio: 'inherit' });
    console.log('Fallback build successful');
  } catch (fallbackError) {
    console.error('Fallback build also failed:', fallbackError.message);
  }
}

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS headers for production
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: 'production'
  });
});

// Serve static files from client build
app.use(express.static(path.join(__dirname, 'client/dist')));

// Initialize backend routes
async function initializeRoutes() {
  try {
    const { registerRoutes } = await import('./dist/routes.js');
    await registerRoutes(app);
    console.log('Backend routes registered successfully');
  } catch (error) {
    console.error('Failed to register backend routes:', error.message);
    
    // Fallback API endpoints
    app.get('/api/test', (req, res) => {
      res.json({ message: 'API is working', timestamp: new Date().toISOString() });
    });
    
    app.get('/api/health', (req, res) => {
      res.json({ status: 'healthy', environment: 'production' });
    });
  }
}

// Initialize routes
initializeRoutes();

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'client/dist/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).json({ 
        error: 'Failed to serve application',
        message: 'Please check if the build completed successfully'
      });
    }
  });
});

// Export for Vercel
export default app;