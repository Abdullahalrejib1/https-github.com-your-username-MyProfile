import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// VERY FIRST ROUTE - Test if routing works at all
app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Basic routing works!' });
});

app.get('/api/simple', (req, res) => {
  res.json({ success: true, message: 'API routing works!' });
});

// CRITICAL: Add /api/users route at the VERY BEGINNING
app.get('/api/users', async (req, res) => {
  // Set CORS headers manually
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Authentication
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ error: 'Unauthorized - Please login first' });
  }
  
  try {
    // Verify token
    const result = await pool.request()
      .input('token', sql.NVarChar, token)
      .query('SELECT id, email, role FROM dbo.Users WHERE password = @token');
    
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
    
    // Fetch users from database
    const usersResult = await pool.request()
      .query('SELECT id, email, role, createdAt, updatedAt FROM dbo.Users ORDER BY createdAt DESC');
    
    res.json({ success: true, users: usersResult.recordset });
  } catch (error) {
    console.error('❌ Error in /api/users:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب المستخدمين', details: error.message });
  }
});

// Database configuration
const DATABASE_CONFIG = {
  server: 'ABDULLAH\\SQLEXPRESS',
  database: 'MyProfileDB',
  user: 'sa',
  password: 'Max!Smart@00905528416704@Code',
  options: {
    trustServerCertificate: true,
    encrypt: false,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Middleware
// CORS must be first - Allow all origins for now
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Handle preflight requests - MUST be after CORS but before routes
app.options('*', (req, res) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
});

// Log ALL requests (for debugging) - DISABLED for performance
// app.use((req, res, next) => {
//   console.log(`\n🌐 ${req.method} ${req.path}`);
//   console.log(`   URL: ${req.url}`);
//   console.log(`   Headers:`, {
//     authorization: req.headers.authorization ? 'present' : 'missing',
//     'content-type': req.headers['content-type'],
//     origin: req.headers.origin
//   });
//   next();
// });

// Remove Content Security Policy headers that block Chrome DevTools
app.use((req, res, next) => {
  // Remove CSP headers that might block DevTools
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('X-Content-Security-Policy');
  res.removeHeader('X-WebKit-CSP');
  next();
});

// Handle Chrome DevTools connection
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.json({});
});

// Note: Static files middleware is added after API routes to ensure API routes are handled first

// Database connection pool
let pool = null;

// Initialize database connection
const initDatabase = async () => {
  try {
    pool = await sql.connect(DATABASE_CONFIG);
    console.log('✅ Connected to SQL Server database');
    
    // Create table if it doesn't exist
    await createTableIfNotExists();
    
    // Initialize default data if table is empty
    await initializeDefaultData();
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Create portfolio table if it doesn't exist
const createTableIfNotExists = async () => {
  try {
    // Create PortfolioData table
    // First check if table exists
    try {
      const checkPortfolioTable = await pool.request().query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'PortfolioData' AND TABLE_SCHEMA = 'dbo'
      `);
      
      if (checkPortfolioTable.recordset.length === 0) {
        // Table doesn't exist, create it
        console.log('📝 Creating PortfolioData table...');
        const createPortfolioTableQuery = `
          CREATE TABLE dbo.PortfolioData (
            id INT PRIMARY KEY IDENTITY(1,1),
            section NVARCHAR(50) NOT NULL UNIQUE,
            data NVARCHAR(MAX) NOT NULL,
            updatedAt DATETIME DEFAULT GETDATE()
          )
        `;
        const result = await pool.request().query(createPortfolioTableQuery);
        console.log('✅ PortfolioData table created successfully in dbo schema');
      } else {
        console.log('✅ PortfolioData table already exists in dbo schema');
      }
    } catch (error) {
      console.error('❌ Error creating PortfolioData table:', error);
      throw error;
    }

    // Create Users table for admin authentication
    // First check if table exists
    try {
      const checkUsersTable = await pool.request().query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'Users' AND TABLE_SCHEMA = 'dbo'
      `);
      
      if (checkUsersTable.recordset.length === 0) {
        // Table doesn't exist, create it
        console.log('📝 Creating Users table...');
        const createUsersTableQuery = `
          CREATE TABLE dbo.Users (
            id INT PRIMARY KEY IDENTITY(1,1),
            email NVARCHAR(255) NOT NULL UNIQUE,
            password NVARCHAR(255) NOT NULL,
            role NVARCHAR(50) DEFAULT 'admin',
            createdAt DATETIME DEFAULT GETDATE(),
            updatedAt DATETIME DEFAULT GETDATE()
          )
        `;
        const result = await pool.request().query(createUsersTableQuery);
        console.log('✅ Users table created successfully in dbo schema');
      } else {
        console.log('✅ Users table already exists in dbo schema');
      }
    } catch (error) {
      console.error('❌ Error creating Users table:', error);
      throw error;
    }

    // Create index on email for faster lookups (if not exists)
    try {
      // Check if index exists
      const checkIndex = await pool.request().query(`
        SELECT name 
        FROM sys.indexes 
        WHERE name = 'IX_Users_Email' AND object_id = OBJECT_ID('dbo.Users')
      `);
      
      if (checkIndex.recordset.length === 0) {
        // Index doesn't exist, create it
        await pool.request().query(`CREATE INDEX IX_Users_Email ON dbo.Users(email)`);
        console.log('✅ Users table index created');
      } else {
        console.log('✅ Users table index already exists');
      }
    } catch (error) {
      console.log('Error creating index:', error.message);
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

// Simple password hashing (in production, use bcrypt)
const hashPassword = (password) => {
  // Simple hash function (in production, use bcrypt)
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

// Initialize default admin user
const initializeDefaultAdmin = async () => {
  try {
    const checkUserQuery = `SELECT COUNT(*) as count FROM dbo.Users`;
    const result = await pool.request().query(checkUserQuery);
    
    if (result.recordset[0].count === 0) {
      // Create default admin user
      // Email: admin@admin.com
      // Password: admin123
      const defaultEmail = 'admin@admin.com';
      const defaultPassword = hashPassword('admin123');
      
      await pool.request()
        .input('email', sql.NVarChar, defaultEmail)
        .input('password', sql.NVarChar, defaultPassword)
        .input('role', sql.NVarChar, 'admin')
        .query(`
          INSERT INTO dbo.Users (email, password, role) 
          VALUES (@email, @password, @role)
        `);
      console.log('✅ Default admin user created in dbo.Users');
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
    // Initialize default admin user
    await initializeDefaultAdmin();

    const checkQuery = `SELECT COUNT(*) as count FROM dbo.PortfolioData`;
    const result = await pool.request().query(checkQuery);
    
    if (result.recordset[0].count === 0) {
      const defaultData = {
        heroData: {
          title: 'Full Stack Developer',
          subtitle: 'Building innovative solutions with modern technologies. Passionate about creating exceptional digital experiences.',
          badge: 'Available for Hire',
          projects: '50+',
          experience: '5+',
          clients: '100+'
        },
        aboutData: [
          {
            icon: 'Terminal',
            title: 'Frontend Development',
            description: 'Expert in React, TypeScript, and modern CSS frameworks like Tailwind CSS'
          },
          {
            icon: 'Code2',
            title: 'Backend Development',
            description: 'Proficient in Node.js, databases, and building scalable APIs'
          },
          {
            icon: 'Boxes',
            title: 'Full Stack',
            description: 'End-to-end development from frontend to backend, delivering complete solutions'
          }
        ],
        skills: [
          { name: 'React', level: 95, color: '#61dafb' },
          { name: 'TypeScript', level: 90, color: '#3178c6' },
          { name: 'Node.js', level: 88, color: '#339933' },
          { name: 'Next.js', level: 85, color: '#000000' },
          { name: 'Tailwind CSS', level: 92, color: '#06b6d4' },
          { name: 'MongoDB', level: 80, color: '#47a248' },
        ],
        projects: [
          {
            title: 'E-Commerce Platform',
            description: 'Full-stack e-commerce solution with payment integration, admin dashboard, and real-time inventory management.',
            tech: ['React', 'Node.js', 'MongoDB', 'Stripe']
          },
          {
            title: 'Task Management App',
            description: 'Collaborative task management application with real-time updates, team collaboration, and project tracking.',
            tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL']
          }
        ],
        experiences: [
          {
            role: 'Senior Full Stack Developer',
            company: 'Tech Solutions Inc.',
            period: '2022 - Present',
            location: 'Remote',
            description: 'Leading development of enterprise applications, mentoring junior developers, and implementing best practices.'
          }
        ],
        contactData: {
          email: 'contact@example.com',
          location: 'Remote / Available Worldwide',
          availability: 'Available for new projects'
        }
      };

      // Insert all sections
      const sections = Object.keys(defaultData);
      for (const section of sections) {
        await pool.request()
          .input('section', sql.NVarChar, section)
          .input('data', sql.NVarChar(sql.MAX), JSON.stringify(defaultData[section]))
          .query(`
            INSERT INTO dbo.PortfolioData (section, data) 
            VALUES (@section, @data)
          `);
      }
      console.log('✅ Default data initialized');
    }
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
};

// Helper function to get data from database
const getDataFromDB = async (section = null) => {
  try {
    if (section) {
      const result = await pool.request()
        .input('section', sql.NVarChar, section)
        .query('SELECT data FROM dbo.PortfolioData WHERE section = @section');
      
      if (result.recordset.length > 0) {
        return JSON.parse(result.recordset[0].data);
      }
      return null;
    } else {
      // Get all sections
      const result = await pool.request()
        .query('SELECT section, data FROM dbo.PortfolioData');
      
      const data = {};
      result.recordset.forEach(row => {
        data[row.section] = JSON.parse(row.data);
      });
      return data;
    }
  } catch (error) {
    console.error('Error reading from database:', error);
    throw error;
  }
};

// Helper function to save data to database
const saveDataToDB = async (section, data) => {
  try {
    const dataJson = JSON.stringify(data);
    await pool.request()
      .input('section', sql.NVarChar, section)
      .input('data', sql.NVarChar(sql.MAX), dataJson)
      .query(`
        IF EXISTS (SELECT * FROM dbo.PortfolioData WHERE section = @section)
          UPDATE dbo.PortfolioData SET data = @data, updatedAt = GETDATE() WHERE section = @section
        ELSE
          INSERT INTO dbo.PortfolioData (section, data) VALUES (@section, @data)
      `);
    return true;
  } catch (error) {
    console.error('Error saving to database:', error);
    throw error;
  }
};

// Helper function to save all data
const saveAllDataToDB = async (allData) => {
  try {
    const sections = Object.keys(allData);
    for (const section of sections) {
      await saveDataToDB(section, allData[section]);
    }
    return true;
  } catch (error) {
    console.error('Error saving all data:', error);
    throw error;
  }
};

// Authentication middleware - verify email and password from database
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    // If token exists and is valid, allow access
    if (token && token !== 'null' && token !== 'undefined') {
      // Verify token (in production, use JWT)
      try {
        const result = await pool.request()
          .input('token', sql.NVarChar, token)
          .query('SELECT id, email, role FROM dbo.Users WHERE password = @token');
        
        if (result.recordset.length > 0) {
          req.user = result.recordset[0];
          next();
          return;
        }
      } catch (dbError) {
        console.error('❌ Database error during authentication:', dbError);
        res.status(500).json({ error: 'Database error during authentication', details: dbError.message });
        return;
      }
    }
    
    res.status(401).json({ error: 'Unauthorized - Please login first', path: req.path });
  } catch (error) {
    console.error('❌ Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed', details: error.message });
  }
};

// Routes

// API request logging middleware - DISABLED for performance
// app.use('/api', (req, res, next) => {
//   console.log(`📡 API Request: ${req.method} ${req.path}`);
//   console.log(`   Full URL: ${req.originalUrl}`);
//   console.log(`   Headers:`, {
//     authorization: req.headers.authorization ? 'present' : 'missing',
//     'content-type': req.headers['content-type']
//   });
//   next();
// });

// Simple test route to verify routing works - MUST be first
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API routing works!' });
});

// REMOVED - Route is already defined at the beginning of the file

app.get('/api/test2', (req, res) => {
  res.json({ success: true, message: 'API routing works 2!' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }
    
    // Hash the provided password
    const hashedPassword = hashPassword(password);
    
    // First, check if user exists with this email
    const userCheck = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id, email, password, role FROM dbo.Users WHERE email = @email');
    
    if (userCheck.recordset.length === 0) {
      return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }
    
    const user = userCheck.recordset[0];
    
    // Check if password matches
    if (user.password === hashedPassword) {
      // Return the hashed password as token (in production, use JWT)
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

// Hash password endpoint (for testing)
app.post('/api/hash-password', (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'كلمة المرور مطلوبة' });
    }
    const hashed = hashPassword(password);
    res.json({ password, hashed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update user endpoint (for admin setup)
app.post('/api/create-user', async (req, res) => {
  try {
    const { email, password, role = 'admin' } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }
    
    const hashedPassword = hashPassword(password);
    
    // Check if user exists
    const userCheck = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id, password FROM dbo.Users WHERE email = @email');
    
    if (userCheck.recordset.length > 0) {
      // Update existing user
      await pool.request()
        .input('email', sql.NVarChar, email)
        .input('password', sql.NVarChar, hashedPassword)
        .input('role', sql.NVarChar, role)
        .query('UPDATE dbo.Users SET password = @password, role = @role WHERE email = @email');
      
      console.log('✅ User password updated:', email);
      console.log('   Old hash:', userCheck.recordset[0].password);
      console.log('   New hash:', hashedPassword);
      res.json({ 
        success: true, 
        message: 'تم تحديث كلمة المرور بنجاح',
        oldHash: userCheck.recordset[0].password,
        newHash: hashedPassword
      });
    } else {
      // Create new user
      await pool.request()
        .input('email', sql.NVarChar, email)
        .input('password', sql.NVarChar, hashedPassword)
        .input('role', sql.NVarChar, role)
        .query('INSERT INTO dbo.Users (email, password, role) VALUES (@email, @password, @role)');
      
      console.log('✅ New user created:', email);
      res.json({ success: true, message: 'تم إنشاء المستخدم بنجاح' });
    }
  } catch (error) {
    console.error('❌ Error creating/updating user:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء/تحديث المستخدم', details: error.message });
  }
});

// Add Admin User Endpoint (Simple - No auth required for initial setup)
app.post('/api/add-admin', async (req, res) => {
  try {
    const { email = 'admin@admin.com', password = 'admin123', role = 'admin' } = req.body;
    
    const hashedPassword = hashPassword(password);
    
    // Check if user exists
    const userCheck = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id, email, role FROM dbo.Users WHERE email = @email');
    
    if (userCheck.recordset.length > 0) {
      // Update existing user
      await pool.request()
        .input('email', sql.NVarChar, email)
        .input('password', sql.NVarChar, hashedPassword)
        .input('role', sql.NVarChar, role)
        .query('UPDATE dbo.Users SET password = @password, role = @role WHERE email = @email');
      
      res.json({ 
        success: true, 
        message: 'تم تحديث مستخدم Admin بنجاح',
        user: {
          email: email,
          role: role
        }
      });
    } else {
      // Create new admin user
      const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .input('password', sql.NVarChar, hashedPassword)
        .input('role', sql.NVarChar, role)
        .query('INSERT INTO dbo.Users (email, password, role) OUTPUT INSERTED.id, INSERTED.email, INSERTED.role VALUES (@email, @password, @role)');
      
      res.json({ 
        success: true, 
        message: 'تم إنشاء مستخدم Admin بنجاح',
        user: {
          id: result.recordset[0].id,
          email: result.recordset[0].email,
          role: result.recordset[0].role
        }
      });
    }
  } catch (error) {
    console.error('❌ Error adding admin:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة Admin', details: error.message });
  }
});

// ==================== Users Management Endpoints ====================

// Test endpoint (without auth for debugging) - MUST be before /api/users
app.get('/api/users/test', (req, res) => {
  console.log('✅ Test endpoint reached');
  res.json({ success: true, message: 'Test endpoint works!' });
});

// Test endpoint for POST (without auth for debugging)
app.post('/api/users/test', (req, res) => {
  console.log('✅ Test POST endpoint reached');
  res.json({ success: true, message: 'Test POST endpoint works!', body: req.body });
});

// Get all users - MUST be registered before catch-all route
// Add a route without auth first for debugging
app.get('/api/users/debug', (req, res) => {
  console.log('✅ Debug endpoint reached - routing works!');
  res.json({ success: true, message: 'Routing works!', path: req.path });
});

// Get all users - with authentication (full version)
app.get('/api/users-full', async (req, res) => {
  console.log('📥 GET /api/users-full - Route handler reached!');
  console.log('   Full path:', req.path);
  console.log('   Method:', req.method);
  // Try authentication, but don't fail if it doesn't work
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token && token !== 'null' && token !== 'undefined') {
    try {
      const result = await pool.request()
        .input('token', sql.NVarChar, token)
        .query('SELECT id, email, role FROM dbo.Users WHERE password = @token');
      
      if (result.recordset.length > 0) {
        req.user = result.recordset[0];
        console.log('✅ Authentication successful for:', req.user.email);
      } else {
        console.log('❌ Token not found in database');
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
      }
    } catch (dbError) {
      console.error('❌ Database error during authentication:', dbError);
      return res.status(500).json({ error: 'Database error', details: dbError.message });
    }
  } else {
    console.log('❌ No token provided');
    return res.status(401).json({ error: 'Unauthorized - Please login first' });
  }
  
  // If we get here, authentication was successful
  try {
    console.log('📥 GET /api/users - Fetching users from database');
    const result = await pool.request()
      .query('SELECT id, email, role, createdAt, updatedAt FROM dbo.Users ORDER BY createdAt DESC');
    
    console.log('✅ Users fetched:', result.recordset.length);
    res.json({ success: true, users: result.recordset });
  } catch (error) {
    console.error('❌ Error getting users:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب المستخدمين', details: error.message });
  }
});

// Get single user by ID
app.get('/api/users/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT id, email, role, createdAt, updatedAt FROM dbo.Users WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    
    res.json({ success: true, user: result.recordset[0] });
  } catch (error) {
    console.error('❌ Error getting user:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب المستخدم', details: error.message });
  }
});

// Create new user
app.post('/api/users', authenticate, async (req, res) => {
  try {
    const { email, password, role = 'admin' } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }
    
    // Check if user already exists
    const checkResult = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id FROM dbo.Users WHERE email = @email');
    
    if (checkResult.recordset.length > 0) {
      return res.status(400).json({ error: 'البريد الإلكتروني مستخدم بالفعل' });
    }
    
    const hashedPassword = hashPassword(password);
    
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .input('role', sql.NVarChar, role)
      .query(`
        INSERT INTO dbo.Users (email, password, role) 
        OUTPUT INSERTED.id, INSERTED.email, INSERTED.role, INSERTED.createdAt, INSERTED.updatedAt
        VALUES (@email, @password, @role)
      `);
    
    console.log('✅ New user created:', email);
    res.json({ success: true, message: 'تم إنشاء المستخدم بنجاح', user: result.recordset[0] });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء المستخدم', details: error.message });
  }
});

// Update user
app.put('/api/users/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, role } = req.body;
    
    // Check if user exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT id FROM dbo.Users WHERE id = @id');
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    
    // If email is being changed, check if new email already exists
    if (email) {
      const emailCheck = await pool.request()
        .input('email', sql.NVarChar, email)
        .input('id', sql.Int, id)
        .query('SELECT id FROM dbo.Users WHERE email = @email AND id != @id');
      
      if (emailCheck.recordset.length > 0) {
        return res.status(400).json({ error: 'البريد الإلكتروني مستخدم بالفعل' });
      }
    }
    
    let updateQuery = 'UPDATE dbo.Users SET ';
    const request = pool.request().input('id', sql.Int, id);
    
    if (email) {
      updateQuery += 'email = @email, ';
      request.input('email', sql.NVarChar, email);
    }
    
    if (password) {
      const hashedPassword = hashPassword(password);
      updateQuery += 'password = @password, ';
      request.input('password', sql.NVarChar, hashedPassword);
    }
    
    if (role) {
      updateQuery += 'role = @role, ';
      request.input('role', sql.NVarChar, role);
    }
    
    updateQuery += 'updatedAt = GETDATE() OUTPUT INSERTED.id, INSERTED.email, INSERTED.role, INSERTED.createdAt, INSERTED.updatedAt WHERE id = @id';
    
    const result = await request.query(updateQuery);
    
    console.log('✅ User updated:', id);
    res.json({ success: true, message: 'تم تحديث المستخدم بنجاح', user: result.recordset[0] });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث المستخدم', details: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT id, email FROM dbo.Users WHERE id = @id');
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    
    // Prevent deleting yourself
    const currentUser = req.user;
    if (currentUser && currentUser.id === parseInt(id)) {
      return res.status(400).json({ error: 'لا يمكنك حذف حسابك الخاص' });
    }
    
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM dbo.Users WHERE id = @id');
    
    console.log('✅ User deleted:', checkResult.recordset[0].email);
    res.json({ success: true, message: 'تم حذف المستخدم بنجاح' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء حذف المستخدم', details: error.message });
  }
});

// ==================== Portfolio Endpoints ====================

// Get all portfolio data
app.get('/api/portfolio', async (req, res) => {
  try {
    const data = await getDataFromDB();
    res.json(data);
  } catch (error) {
    console.error('Error getting portfolio data:', error);
    res.status(500).json({ error: 'Failed to read data from database' });
  }
});

// Update portfolio data
app.post('/api/portfolio', authenticate, async (req, res) => {
  try {
    const newData = req.body;
    await saveAllDataToDB(newData);
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving portfolio data:', error);
    res.status(500).json({ error: 'Failed to save data to database' });
  }
});

// Get specific section
app.get('/api/portfolio/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const data = await getDataFromDB(section);
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    console.error('Error getting section:', error);
    res.status(500).json({ error: 'Failed to read section from database' });
  }
});

// Update specific section
app.post('/api/portfolio/:section', authenticate, async (req, res) => {
  try {
    const { section } = req.params;
    await saveDataToDB(section, req.body);
    res.json({ success: true, message: `${section} updated successfully` });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ error: 'Failed to save section to database' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const result = await pool.request().query('SELECT 1 as test');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString() 
    });
  }
});

// Create tables manually (for troubleshooting)
app.post('/api/create-tables', async (req, res) => {
  try {
    // Create PortfolioData table
    try {
      const checkPortfolio = await pool.request().query(`
        SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'PortfolioData' AND TABLE_SCHEMA = 'dbo'
      `);
      
      if (checkPortfolio.recordset.length === 0) {
        await pool.request().query(`
          CREATE TABLE dbo.PortfolioData (
            id INT PRIMARY KEY IDENTITY(1,1),
            section NVARCHAR(50) NOT NULL UNIQUE,
            data NVARCHAR(MAX) NOT NULL,
            updatedAt DATETIME DEFAULT GETDATE()
          )
        `);
        console.log('✅ PortfolioData table created via API');
      }
    } catch (error) {
      console.error('Error creating PortfolioData:', error);
    }

    // Create Users table
    try {
      const checkUsers = await pool.request().query(`
        SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'Users' AND TABLE_SCHEMA = 'dbo'
      `);
      
      if (checkUsers.recordset.length === 0) {
        await pool.request().query(`
          CREATE TABLE dbo.Users (
            id INT PRIMARY KEY IDENTITY(1,1),
            email NVARCHAR(255) NOT NULL UNIQUE,
            password NVARCHAR(255) NOT NULL,
            role NVARCHAR(50) DEFAULT 'admin',
            createdAt DATETIME DEFAULT GETDATE(),
            updatedAt DATETIME DEFAULT GETDATE()
          )
        `);
        console.log('✅ Users table created via API');
      }
    } catch (error) {
      console.error('Error creating Users:', error);
    }

    res.json({ 
      success: true, 
      message: 'Tables creation attempted. Check server logs for details.' 
    });
  } catch (error) {
    console.error('Error in create-tables endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check if Users table exists
app.get('/api/check-tables', async (req, res) => {
  try {
    // Check if Users table exists
    const usersTableCheck = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'Users' AND TABLE_SCHEMA = 'dbo'
    `);
    
    // Check if PortfolioData table exists
    const portfolioTableCheck = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'PortfolioData' AND TABLE_SCHEMA = 'dbo'
    `);
    
    // Get Users count
    let usersCount = 0;
    if (usersTableCheck.recordset.length > 0) {
      try {
        const countResult = await pool.request().query('SELECT COUNT(*) as count FROM dbo.Users');
        usersCount = countResult.recordset[0].count;
      } catch (error) {
        console.error('Error counting users:', error);
      }
    }

    // Get PortfolioData count
    let portfolioCount = 0;
    if (portfolioTableCheck.recordset.length > 0) {
      try {
        const countResult = await pool.request().query('SELECT COUNT(*) as count FROM dbo.PortfolioData');
        portfolioCount = countResult.recordset[0].count;
      } catch (error) {
        console.error('Error counting portfolio data:', error);
      }
    }
    
    res.json({
      usersTable: {
        exists: usersTableCheck.recordset.length > 0,
        schema: 'dbo',
        rowCount: usersCount
      },
      portfolioTable: {
        exists: portfolioTableCheck.recordset.length > 0,
        schema: 'dbo',
        rowCount: portfolioCount
      },
      message: portfolioTableCheck.recordset.length > 0 && usersTableCheck.recordset.length > 0
        ? 'Both tables exist in dbo schema' 
        : portfolioTableCheck.recordset.length === 0
        ? 'PortfolioData table does not exist. Use POST /api/create-tables to create it.'
        : 'Users table does not exist. Use POST /api/create-tables to create it.'
    });
  } catch (error) {
    console.error('Error checking tables:', error);
    res.status(500).json({ 
      error: 'Failed to check tables',
      details: error.message 
    });
  }
});

// Catch-all for API routes - must be before static middleware
app.all('/api/*', (req, res) => {
  console.log(`⚠️  API route not found: ${req.method} ${req.path}`);
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.path,
    method: req.method,
    message: `The endpoint ${req.method} ${req.path} does not exist. Check the server console for available routes.`
  });
});

// Static files middleware (after API routes)
// Only serve static files if dist folder exists (production mode)
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(__dirname, 'dist', 'index.html');
if (fs.existsSync(distPath) && fs.existsSync(indexPath)) {
  try {
    app.use(express.static('dist'));
    console.log('✅ Static files middleware enabled (production mode)');
  } catch (error) {
    console.log('⚠️  Static files middleware error:', error.message);
  }
} else {
  console.log('ℹ️  Static files disabled (development mode - using Vite dev server)');
}

// TEMPORARILY DISABLED - Testing routing
// Handle non-API POST/PUT/DELETE/PATCH requests
// ['post', 'put', 'delete', 'patch'].forEach(method => {
//   app[method]('*', (req, res) => {
//     // Don't serve HTML for API routes
//     if (req.path.startsWith('/api')) {
//       console.log(`⚠️  Catch-all ${method.toUpperCase()} route caught API request:`, req.path);
//       console.log('   This means the API route was not found!');
//       return res.status(404).json({ error: 'API endpoint not found', path: req.path, method: req.method });
//     }
//     
//     // For non-API routes, return 404
//     res.status(404).json({ 
//       error: 'Endpoint not found',
//       path: req.path,
//       method: req.method
//     });
//   });
// });

// TEMPORARILY DISABLED - Testing routing
// Serve React app for GET requests only (catch-all for frontend routes)
// app.get('*', (req, res) => {
//   // Don't serve HTML for API routes
//   if (req.path.startsWith('/api')) {
//     console.log('⚠️  Catch-all GET route caught API request:', req.path);
//     console.log('   This means the API route was not found!');
//     return res.status(404).json({ error: 'API endpoint not found', path: req.path, method: req.method });
//   }
//   
//   // Only serve HTML if dist folder exists (production mode)
//   const indexPath = path.join(__dirname, 'dist', 'index.html');
//   if (fs.existsSync(indexPath)) {
//     try {
//       res.sendFile(indexPath);
//     } catch (error) {
//       console.error('Error sending index.html:', error.message);
//       res.status(500).json({ 
//         error: 'Internal server error',
//         message: 'Failed to serve index.html'
//       });
//     }
//   } else {
//     // In development mode, redirect to Vite dev server or show helpful message
//     const viteDevServer = 'http://localhost:5050';
//     
//     // If it's a browser request (has Accept: text/html), redirect
//     if (req.headers.accept && req.headers.accept.includes('text/html')) {
//       return res.redirect(302, `${viteDevServer}${req.path}`);
//     }
//     
//     // Otherwise, return JSON for API clients
//     res.status(404).json({ 
//       error: 'Page not found',
//       message: 'This is the API server (port 3001). In development mode, use Vite dev server for frontend.',
//       frontend: viteDevServer,
//       api: 'API endpoints are available at /api/*',
//       redirect: `${viteDevServer}${req.path}`
//     });
//   }
// });

// Start server (even if database init fails)
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${DATABASE_CONFIG.server}/${DATABASE_CONFIG.database}`);
    console.log(`${'='.repeat(60)}\n`);
    console.log('📋 Test Routes (try these first in browser):');
    console.log('   GET  http://localhost:3001/test');
    console.log('   GET  http://localhost:3001/api/simple');
    console.log('   GET  http://localhost:3001/api/test');
    console.log('   GET  http://localhost:3001/api/test2');
    console.log('   GET  http://localhost:3001/api/users/test');
    console.log('   GET  http://localhost:3001/api/users/debug');
    console.log('\n📋 Main API Routes:');
    console.log('   POST /api/add-admin (Create/Update admin user - No auth required)');
    console.log('   POST /api/create-user (Create/Update any user - No auth required)');
    console.log('   POST /api/login (Login endpoint)');
    console.log('   GET  /api/users (auth required)');
    console.log('   POST /api/users (auth required)');
    console.log('   GET  /api/users/:id (auth required)');
    console.log('   PUT  /api/users/:id (auth required)');
    console.log('   DELETE /api/users/:id (auth required)');
    console.log(`\n${'='.repeat(60)}\n`);
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
  console.log('\n🛑 Shutting down server...');
  if (pool) {
    await pool.close();
    console.log('✅ Database connection closed');
  }
  process.exit(0);
});
