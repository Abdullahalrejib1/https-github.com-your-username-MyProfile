# ⚡ رفع سريع على Netlify + Railway + Supabase

## 🎯 الخطوات السريعة:

### 1️⃣ Supabase - إنشاء الجداول:

1. اذهب إلى: https://supabase.com/dashboard/project/ivoppfeuslvfkmamizsv
2. SQL Editor → Run:

```sql
CREATE TABLE IF NOT EXISTS public.Users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.Users(email);

CREATE TABLE IF NOT EXISTS public.PortfolioData (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2️⃣ Railway - Backend:

1. اذهب إلى: https://railway.app
2. New Project → Deploy from GitHub → اختر Repository
3. Settings → Variables → أضف:

```
SUPABASE_URL=https://ivoppfeuslvfkmamizsv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2b3BwZmV1c2x2ZmttYW1penN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDgyMDc3NCwiZXhwIjoyMDcwMzk2Nzc0fQ.O083gAlNXMFjG1Wtlk4Jl11xcTNtChDdTLYsRbRvfJE
PORT=3001
```

4. Settings → Networking → Generate Domain → انسخ الـ URL

---

### 3️⃣ Netlify - Frontend:

1. اذهب إلى: https://netlify.com
2. Add new site → Import from GitHub → اختر Repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Site settings → Environment variables → أضف:

```
VITE_API_URL=https://your-railway-url.railway.app/api
```

(استبدل `your-railway-url` بـ URL من Railway)

5. Deploy site

---

## ✅ جاهز!

افتح الموقع على Netlify وجرب:
- Email: `admin@admin.com`
- Password: `admin123`

