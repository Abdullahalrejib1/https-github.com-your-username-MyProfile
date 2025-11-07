# 🚀 إعداد Supabase REST API

## ✅ الكود جاهز!

تم تحديث الكود لاستخدام **Supabase REST API** بدلاً من الاتصال المباشر بقاعدة البيانات.

---

## 📋 خطوات الإعداد:

### 1. الحصول على Supabase Credentials:

لديك بالفعل:
- **Project URL:** `https://ivoppfeuslvfkmamizsv.supabase.co`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2b3BwZmV1c2x2ZmttYW1penN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MjA3NzQsImV4cCI6MjA3MDM5Njc3NH0.y9zKiH_XfqIvAmpPeNoxA72AjpRJj3YqW6rTnf-MNbo`
- **Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2b3BwZmV1c2x2ZmttYW1penN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDgyMDc3NCwiZXhwIjoyMDcwMzk2Nzc0fQ.O083gAlNXMFjG1Wtlk4Jl11xcTNtChDdTLYsRbRvfJE`

### 2. إنشاء الجداول في Supabase:

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard/project/ivoppfeuslvfkmamizsv)
2. اضغط "SQL Editor" من القائمة الجانبية
3. انسخ والصق هذا الكود:

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

4. اضغط "Run" (أو Ctrl+Enter)

### 3. تثبيت Dependencies:

```bash
npm install
```

(يتم تثبيت `@supabase/supabase-js` تلقائياً)

### 4. إضافة Environment Variables:

#### محلياً (Development):

أنشئ ملف `.env` في جذر المشروع:

```
SUPABASE_URL=https://ivoppfeuslvfkmamizsv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2b3BwZmV1c2x2ZmttYW1penN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDgyMDc3NCwiZXhwIjoyMDcwMzk2Nzc0fQ.O083gAlNXMFjG1Wtlk4Jl11xcTNtChDdTLYsRbRvfJE
```

**أو استخدام Anon Key (للقراءة فقط):**
```
SUPABASE_URL=https://ivoppfeuslvfkmamizsv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2b3BwZmV1c2x2ZmttYW1penN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MjA3NzQsImV4cCI6MjA3MDM5Njc3NH0.y9zKiH_XfqIvAmpPeNoxA72AjpRJj3YqW6rTnf-MNbo
```

#### في Railway (Production):

1. في Railway Dashboard → Variables
2. أضف:
   ```
   SUPABASE_URL = https://ivoppfeuslvfkmamizsv.supabase.co
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2b3BwZmV1c2x2ZmttYW1penN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDgyMDc3NCwiZXhwIjoyMDcwMzk2Nzc0fQ.O083gAlNXMFjG1Wtlk4Jl11xcTNtChDdTLYsRbRvfJE
   ```

### 5. تشغيل Server:

```bash
npm run server:supabase
```

أو:

```bash
node server-supabase-api.js
```

---

## 🧪 اختبار الاتصال:

بعد تشغيل `server-supabase-api.js`، يجب أن ترى:

```
✅ Connected to Supabase
✅ Default admin user created
   Email: admin@admin.com
   Password: admin123
🚀 Server is running on http://localhost:3001
📊 Database: Supabase (REST API)
🔗 Supabase URL: https://ivoppfeuslvfkmamizsv.supabase.co
```

---

## 🔍 استخدام Supabase Dashboard:

### عرض البيانات:

1. **Table Editor:**
   - اضغط "Table Editor" من القائمة
   - اختر الجدول (Users أو PortfolioData)
   - عرض وتعديل البيانات مباشرة

2. **SQL Editor:**
   - اضغط "SQL Editor"
   - اكتب SQL queries
   - اضغط "Run"

---

## ⚠️ ملاحظات مهمة:

1. **Service Role Key** = صلاحيات كاملة (استخدمه في Backend)
2. **Anon Key** = صلاحيات محدودة (للـ Frontend)
3. **لا ترفع Keys على GitHub** (استخدم Environment Variables)
4. **Service Role Key** آمن للاستخدام في Backend فقط

---

## ✅ Checklist:

- [ ] إنشاء الجداول في Supabase SQL Editor
- [ ] تثبيت dependencies: `npm install`
- [ ] إضافة `SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY` في `.env`
- [ ] تشغيل `npm run server:supabase`
- [ ] اختبار الاتصال

---

## 🚀 في Railway:

1. استخدم `server-supabase-api.js` بدلاً من `server.js`
2. أضف Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Start Command: `node server-supabase-api.js`

---

**جاهز للاستخدام! 🎉**

