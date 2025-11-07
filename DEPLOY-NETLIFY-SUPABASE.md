# 🚀 رفع المشروع على Netlify مع Supabase

## 📋 نظرة عامة:

- **Frontend** → Netlify
- **Backend** → Railway (مع Supabase)
- **Database** → Supabase

---

## الخطوة 1: إعداد Supabase

### 1. إنشاء الجداول:

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard/project/ivoppfeuslvfkmamizsv)
2. اضغط "SQL Editor"
3. انسخ والصق:

```sql
-- جدول Users
CREATE TABLE IF NOT EXISTS public.Users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.Users(email);

-- جدول PortfolioData
CREATE TABLE IF NOT EXISTS public.PortfolioData (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. اضغط "Run"

---

## الخطوة 2: رفع Backend على Railway

### 1. إعداد Railway:

1. اذهب إلى [railway.app](https://railway.app)
2. سجل دخول بـ GitHub
3. اضغط "New Project" → "Deploy from GitHub repo"
4. اختر Repository: `https-github.com-your-username-MyProfile`

### 2. إعدادات Build:

1. في Railway Settings → Build
2. Builder: Dockerfile (أو Nixpacks)
3. Start Command: `node server-supabase-api.js`

### 3. Environment Variables في Railway:

اضغط "Variables" وأضف:

```
SUPABASE_URL = https://ivoppfeuslvfkmamizsv.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2b3BwZmV1c2x2ZmttYW1penN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDgyMDc3NCwiZXhwIjoyMDcwMzk2Nzc0fQ.O083gAlNXMFjG1Wtlk4Jl11xcTNtChDdTLYsRbRvfJE
PORT = 3001
NODE_ENV = production
```

### 4. Generate Public Domain:

1. في Railway → Settings → Networking
2. اضغط "Generate Domain"
3. انسخ الـ URL (مثل: `https://myprofile-production.up.railway.app`)

---

## الخطوة 3: رفع Frontend على Netlify

### 1. إعداد Netlify:

1. اذهب إلى [netlify.com](https://netlify.com)
2. سجل دخول بـ GitHub
3. اضغط "Add new site" → "Import an existing project"
4. اختر Repository: `https-github.com-your-username-MyProfile`

### 2. إعدادات Build:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

### 3. Environment Variables في Netlify:

1. اضغط "Site settings" → "Environment variables"
2. أضف:

```
VITE_API_URL = https://your-railway-url.railway.app/api
```

(استبدل `your-railway-url.railway.app` بـ URL من Railway)

### 4. Deploy:

اضغط "Deploy site"

---

## الخطوة 4: تحديث CORS في Backend

تأكد من أن `server-supabase-api.js` يسمح بـ Netlify URL:

الكود الحالي يسمح بجميع الـ origins (`origin: true`)، وهذا جيد.

---

## ✅ Checklist:

### Supabase:
- [ ] إنشاء الجداول (Users, PortfolioData)
- [ ] الحصول على Supabase URL و Keys

### Railway (Backend):
- [ ] رفع المشروع على Railway
- [ ] إضافة Environment Variables:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `PORT`
- [ ] Generate Public Domain
- [ ] الحصول على Railway URL

### Netlify (Frontend):
- [ ] رفع المشروع على Netlify
- [ ] إضافة Environment Variable:
  - [ ] `VITE_API_URL` (مع Railway URL)
- [ ] Deploy الموقع

---

## 🧪 اختبار:

1. افتح الموقع على Netlify
2. جرب تسجيل الدخول في Admin Panel:
   - Email: `admin@admin.com`
   - Password: `admin123`

---

## 📝 ملاحظات:

1. **Backend على Railway** - يحتاج `server-supabase-api.js`
2. **Frontend على Netlify** - يحتاج `VITE_API_URL` مع Railway URL
3. **Database على Supabase** - الجداول يجب أن تكون موجودة

---

**جاهز للرفع! 🚀**

