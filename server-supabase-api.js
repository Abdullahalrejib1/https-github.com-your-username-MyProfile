import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ivoppfeuslvfkmamizsv.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
let supabase = null;

// Initialize Supabase connection
const initSupabase = async () => {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error('SUPABASE_URL and SUPABASE_KEY environment variables are required');
    }

    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Test connection
    const { data, error } = await supabase.from('Users').select('count').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (we'll create it)
      console.error('❌ Supabase connection error:', error);
      throw error;
    }
    
    console.log('✅ Connected to Supabase');
    
    // Create tables if they don't exist
    await createTableIfNotExists();
    
    // Initialize default data if table is empty
    await initializeDefaultData();
  } catch (error) {
    console.error('❌ Supabase initialization error:', error);
    console.error('⚠️  Make sure SUPABASE_URL and SUPABASE_KEY are set correctly');
    // Don't exit - allow server to start without database
  }
};

// Create tables if they don't exist
const createTableIfNotExists = async () => {
  try {
    // Use SQL Editor in Supabase Dashboard to create tables
    // Or use Supabase Management API
    console.log('ℹ️  Create tables in Supabase Dashboard → SQL Editor');
    console.log('   Run the SQL from SUPABASE-SETUP.md');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
};

// Hash password function
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
    const { data: users, error } = await supabase
      .from('Users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Error checking users:', error);
      return;
    }
    
    if (!users || users.length === 0) {
      const defaultEmail = 'admin@admin.com';
      const defaultPassword = hashPassword('admin123');
      
      const { error: insertError } = await supabase
        .from('Users')
        .insert([
          {
            email: defaultEmail,
            password: defaultPassword,
            role: 'admin'
          }
        ]);
      
      if (insertError) {
        console.error('Error creating default admin:', insertError);
      } else {
        console.log('✅ Default admin user created');
        console.log('   Email: admin@admin.com');
        console.log('   Password: admin123');
      }
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

    const { data: portfolio, error } = await supabase
      .from('PortfolioData')
      .select('id')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking portfolio:', error);
      return;
    }
    
    if (!portfolio || portfolio.length === 0) {
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

      const { error: insertError } = await supabase
        .from('PortfolioData')
        .insert([{ data: defaultData }]);
      
      if (insertError) {
        console.error('Error creating default portfolio:', insertError);
      } else {
        console.log('✅ Default portfolio data initialized');
      }
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
    
    const { data: users, error } = await supabase
      .from('Users')
      .select('id, email, password, role')
      .eq('email', email)
      .limit(1);
    
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول', details: error.message });
    }
    
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }
    
    const user = users[0];
    
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
    const { data, error } = await supabase
      .from('PortfolioData')
      .select('data')
      .order('id', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.json({});
      }
      console.error('Database error:', error);
      return res.status(500).json({ error: 'حدث خطأ أثناء جلب البيانات', details: error.message });
    }
    
    res.json(data?.data || {});
  } catch (error) {
    console.error('❌ Error fetching portfolio:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب البيانات', details: error.message });
  }
});

// Update portfolio data
app.put('/api/portfolio', async (req, res) => {
  try {
    const portfolioData = req.body;
    
    // Get latest record
    const { data: existing, error: fetchError } = await supabase
      .from('PortfolioData')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching portfolio:', fetchError);
    }
    
    if (existing) {
      // Update existing
      const { error: updateError } = await supabase
        .from('PortfolioData')
        .update({ data: portfolioData })
        .eq('id', existing.id);
      
      if (updateError) {
        throw updateError;
      }
    } else {
      // Insert new
      const { error: insertError } = await supabase
        .from('PortfolioData')
        .insert([{ data: portfolioData }]);
      
      if (insertError) {
        throw insertError;
      }
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
    
    const { data: existing, error: checkError } = await supabase
      .from('Users')
      .select('id, email, role')
      .eq('email', email)
      .limit(1)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking user:', checkError);
    }
    
    if (existing) {
      // Update existing
      const { error: updateError } = await supabase
        .from('Users')
        .update({ password: hashedPassword, role })
        .eq('id', existing.id);
      
      if (updateError) {
        throw updateError;
      }
      
      res.json({ 
        success: true, 
        message: 'تم تحديث مستخدم Admin بنجاح',
        user: { email, role }
      });
    } else {
      // Create new
      const { data: newUser, error: insertError } = await supabase
        .from('Users')
        .insert([{ email, password: hashedPassword, role }])
        .select('id, email, role')
        .single();
      
      if (insertError) {
        throw insertError;
      }
      
      res.json({ 
        success: true, 
        message: 'تم إنشاء مستخدم Admin بنجاح',
        user: newUser
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
    console.log(`📊 Database: Supabase (REST API)`);
    console.log(`🔗 Supabase URL: ${SUPABASE_URL}`);
    console.log(`${'='.repeat(60)}\n`);
  });
};

// Initialize Supabase and start server
initSupabase()
  .then(() => {
    console.log('✅ Supabase initialized successfully');
    startServer();
  })
  .catch((error) => {
    console.error('❌ Failed to initialize Supabase:', error);
    console.log('⚠️  Starting server anyway (Supabase may not be available)');
    startServer();
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('✅ Server shutting down');
  process.exit(0);
});

