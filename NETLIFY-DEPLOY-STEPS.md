# 🚀 خطوات رفع المشروع على Netlify مع Supabase

## 📋 المطلوب:

1. ✅ **Supabase** - قاعدة البيانات (جاهزة)
2. ✅ **Railway** - Backend Server (يحتاج رفع)
3. ✅ **Netlify** - Frontend (يحتاج رفع)

---

## الخطوة 1: إنشاء الجداول في Supabase

### 1. اذهب إلى Supabase Dashboard:
https://supabase.com/dashboard/project/ivoppfeuslvfkmamizsv

### 2. اضغط "SQL Editor" (في القائمة الجانبية)

### 3. انسخ والصق هذا الكود:

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

### 4. اضغط "Run" (أو F5)

### 5. تأكد من ظهور رسالة "Success"

---

## الخطوة 2: رفع Backend على Railway

### 1. اذهب إلى Railway:
https://railway.app

### 2. سجل دخول بـ GitHub

### 3. اضغط "New Project"

### 4. اختر "Deploy from GitHub repo"

### 5. اختر Repository: `https-github.com-your-username-MyProfile`

### 6. بعد الرفع، اضغط على المشروع → Settings

### 7. في "Variables" → أضف هذه المتغيرات:

```
SUPABASE_URL = https://ivoppfeuslvfkmamizsv.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2b3BwZmV1c2x2ZmttYW1penN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDgyMDc3NCwiZXhwIjoyMDcwMzk2Nzc0fQ.O083gAlNXMFjG1Wtlk4Jl11xcTNtChDdTLYsRbRvfJE
PORT = 3001
```

### 8. في "Networking" → اضغط "Generate Domain"

### 9. انسخ الـ URL (مثل: `https://myprofile-production.up.railway.app`)

**⚠️ مهم:** احفظ هذا الـ URL، ستحتاجه في Netlify!

---

## الخطوة 3: رفع Frontend على Netlify

### 1. اذهب إلى Netlify:
https://netlify.com

### 2. سجل دخول بـ GitHub

### 3. اضغط "Add new site" → "Import an existing project"

### 4. اختر Repository: `https-github.com-your-username-MyProfile`

### 5. في "Build settings":
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### 6. اضغط "Show advanced" → "New variable"

### 7. أضف Environment Variable:

**Name:** `VITE_API_URL`  
**Value:** `https://your-railway-url.railway.app/api`

(استبدل `your-railway-url.railway.app` بـ URL من Railway)

**مثال:**
```
VITE_API_URL = https://myprofile-production.up.railway.app/api
```

### 8. اضغط "Deploy site"

### 9. انتظر حتى ينتهي البناء (Build)

---

## ✅ التحقق من النجاح:

### 1. افتح الموقع على Netlify

### 2. جرب تسجيل الدخول في Admin Panel:
   - اضغط على أيقونة "Admin" في الموقع
   - Email: `admin@admin.com`
   - Password: `admin123`

### 3. إذا نجح تسجيل الدخول → ✅ كل شيء يعمل!

---

## 🔧 حل المشاكل:

### المشكلة: الموقع لا يعمل
- تأكد من أن Railway Backend يعمل
- تأكد من أن `VITE_API_URL` في Netlify صحيح

### المشكلة: تسجيل الدخول لا يعمل
- تأكد من إنشاء الجداول في Supabase
- تأكد من Environment Variables في Railway

### المشكلة: CORS Error
- Backend يسمح بجميع الـ origins (`origin: true`)
- إذا استمرت المشكلة، تحقق من Railway URL

---

## 📝 ملخص:

1. ✅ Supabase → إنشاء الجداول
2. ✅ Railway → رفع Backend + Environment Variables + Domain
3. ✅ Netlify → رفع Frontend + `VITE_API_URL` + Deploy

**جاهز! 🚀**

