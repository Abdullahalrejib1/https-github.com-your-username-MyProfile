import express from 'express';
import cors from 'cors';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Database configuration for Supabase (PostgreSQL)
const { Pool } = pg;

const DATABASE_CONFIG = {
  connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DB_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create connection pool
let pool = null;

// Initialize database connection
const initDatabase = async () => {
  try {
    if (!DATABASE_CONFIG.connectionString) {
      throw new Error('DATABASE_URL or SUPABASE_DB_URL environment variable is required');
    }

    pool = new Pool(DATABASE_CONFIG);
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to Supabase (PostgreSQL) database');
    client.release();
    
    // Create tables if they don't exist
    await createTableIfNotExists();
    
    // Initialize default data if table is empty
    await initializeDefaultData();
  } catch (error) {
    console.error('❌ Database connection error:', error);
    console.error('⚠️  Make sure DATABASE_URL or SUPABASE_DB_URL is set correctly');
    // Don't exit - allow server to start without database
  }
};

// Create tables if they don't exist
const createTableIfNotExists = async () => {
  try {
    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.Users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on email
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON public.Users(email)
    `);

    // Create PortfolioData table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.PortfolioData (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables created/verified successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
};

// Hash password function (same as before)
const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

// Initialize default admin user
const initializeDefaultAdmin = async () => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM public.Users');
    
    if (parseInt(result.rows[0].count) === 0) {
      const defaultEmail = 'admin@admin.com';
      const defaultPassword = hashPassword('admin123');
      
      await pool.query(
        'INSERT INTO public.Users (email, password, role) VALUES ($1, $2, $3)',
        [defaultEmail, defaultPassword, 'admin']
      );
      
      console.log('✅ Default admin user created');
      console.log('   Email: admin@admin.com');
      console.log('   Password: admin123');
    } else {
      console.log('✅ Users table already has data');
    }
  } catch (error) {
    console.error('Error initializing default admin:', error);
  }
};

// Initialize default data
const initializeDefaultData = async () => {
  try {
    await initializeDefaultAdmin();

    const result = await pool.query('SELECT COUNT(*) as count FROM public.PortfolioData');
    
    if (parseInt(result.rows[0].count) === 0) {
      const defaultData = {
        heroData: {
          title: 'Full Stack Developer',
          subtitle: 'Building innovative solutions with modern technologies.',
          badge: 'Available for Hire',
          projects: '50+',
          experience: '5+',
          clients: '30+'
        },
        aboutData: {
          title: 'About Me',
          description: 'Passionate developer with expertise in modern web technologies.'
        },
        skills: [],
        projects: [],
        contactData: {
          email: 'your@email.com',
          phone: '+1234567890',
          location: 'Your Location'
        }
      };

      await pool.query(
        'INSERT INTO public.PortfolioData (data) VALUES ($1)',
        [JSON.stringify(defaultData)]
      );
      
      console.log('✅ Default portfolio data initialized');
    }
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
};

// CORS middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Handle preflight requests
app.options('*', (req, res) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
});

// Test route
app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Basic routing works!' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }
    
    const hashedPassword = hashPassword(password);
    
    const result = await pool.query(
      'SELECT id, email, password, role FROM public.Users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }
    
    const user = result.rows[0];
    
    if (user.password === hashedPassword) {
      res.json({ 
        success: true, 
        token: hashedPassword,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول', details: error.message });
  }
});

// Get portfolio data
app.get('/api/portfolio', async (req, res) => {
  try {
    const result = await pool.query('SELECT data FROM public.PortfolioData ORDER BY id DESC LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.json({});
    }
    
    res.json(result.rows[0].data);
  } catch (error) {
    console.error('❌ Error fetching portfolio:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب البيانات', details: error.message });
  }
});

// Update portfolio data
app.put('/api/portfolio', async (req, res) => {
  try {
    const portfolioData = req.body;
    
    const result = await pool.query(
      'UPDATE public.PortfolioData SET data = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM public.PortfolioData ORDER BY id DESC LIMIT 1) RETURNING id',
      [JSON.stringify(portfolioData)]
    );
    
    if (result.rows.length === 0) {
      // Insert if no data exists
      await pool.query(
        'INSERT INTO public.PortfolioData (data) VALUES ($1)',
        [JSON.stringify(portfolioData)]
      );
    }
    
    res.json({ success: true, message: 'تم حفظ البيانات بنجاح' });
  } catch (error) {
    console.error('❌ Error updating portfolio:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء حفظ البيانات', details: error.message });
  }
});

// Add admin endpoint
app.post('/api/add-admin', async (req, res) => {
  try {
    const { email = 'admin@admin.com', password = 'admin123', role = 'admin' } = req.body;
    
    const hashedPassword = hashPassword(password);
    
    const userCheck = await pool.query(
      'SELECT id, email, role FROM public.Users WHERE email = $1',
      [email]
    );
    
    if (userCheck.rows.length > 0) {
      await pool.query(
        'UPDATE public.Users SET password = $1, role = $2 WHERE email = $3',
        [hashedPassword, role, email]
      );
      
      res.json({ 
        success: true, 
        message: 'تم تحديث مستخدم Admin بنجاح',
        user: { email, role }
      });
    } else {
      const result = await pool.query(
        'INSERT INTO public.Users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
        [email, hashedPassword, role]
      );
      
      res.json({ 
        success: true, 
        message: 'تم إنشاء مستخدم Admin بنجاح',
        user: result.rows[0]
      });
    }
  } catch (error) {
    console.error('❌ Error adding admin:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة Admin', details: error.message });
  }
});

// Start server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Database: Supabase (PostgreSQL)`);
    console.log(`${'='.repeat(60)}\n`);
  });
};

// Initialize database and start server
initDatabase()
  .then(() => {
    console.log('✅ Database initialized successfully');
    startServer();
  })
  .catch((error) => {
    console.error('❌ Failed to initialize database:', error);
    console.log('⚠️  Starting server anyway (database may not be available)');
    startServer();
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  if (pool) {
    await pool.end();
    console.log('✅ Database connection closed');
  }
  process.exit(0);
});

