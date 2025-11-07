# ⚡ دليل سريع - ربط Supabase

## 📋 خطوات سريعة:

### 1. إنشاء حساب Supabase:

1. اذهب إلى [supabase.com](https://supabase.com)
2. سجل دخول بـ GitHub
3. اضغط "New Project"
4. املأ البيانات:
   - Name: `MyProfile`
   - Database Password: اختر كلمة مرور قوية
   - Region: اختر أقرب region
5. اضغط "Create new project"
6. انتظر 2-3 دقائق

### 2. الحصول على Connection String:

1. في Supabase Dashboard
2. Settings (⚙️) → Database
3. ابحث عن "Connection string"
4. اختر "URI"
5. انسخ الـ Connection String:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### 3. إنشاء الجداول:

1. في Supabase Dashboard
2. اضغط "SQL Editor"
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

4. اضغط "Run"

### 4. تثبيت PostgreSQL Client:

```bash
npm install pg
```

### 5. استخدام server-supabase.js:

**في Railway أو محلياً:**

1. استبدل `server.js` بـ `server-supabase.js`
2. أو أضف Environment Variable:
   ```
   DATABASE_URL = postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### 6. Environment Variables:

**في Railway:**
```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**أو:**
```
SUPABASE_DB_URL = postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
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

1. **Supabase = PostgreSQL** (ليس SQL Server)
2. **لا يمكن ربط Supabase مع SQL Server Management Studio**
3. **استخدم Supabase Dashboard** لإدارة البيانات
4. **أو استخدم pgAdmin** (لـ PostgreSQL)

---

## 🔄 التبديل من SQL Server إلى Supabase:

### الطريقة 1: استخدام server-supabase.js

```bash
# في Railway أو محلياً
# استبدل server.js بـ server-supabase.js
```

### الطريقة 2: تحديث server.js

يمكن تحديث `server.js` ليدعم كلا من SQL Server و Supabase.

---

## ✅ Checklist:

- [ ] إنشاء حساب Supabase
- [ ] إنشاء Project جديد
- [ ] الحصول على Connection String
- [ ] إنشاء الجداول (Users, PortfolioData)
- [ ] تثبيت `pg`: `npm install pg`
- [ ] إضافة `DATABASE_URL` في Environment Variables
- [ ] استخدام `server-supabase.js` أو تحديث `server.js`

---

**بعد إكمال هذه الخطوات، المشروع سيعمل مع Supabase! 🎉**

