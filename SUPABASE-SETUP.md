# 🗄️ إعداد Supabase - دليل سريع

## ✅ الكود جاهز!

ملف `server-supabase.js` جاهز للاستخدام مع Supabase.

---

## 📋 خطوات الإعداد:

### 1. إنشاء حساب Supabase:

1. اذهب إلى [supabase.com](https://supabase.com)
2. سجل دخول بـ GitHub
3. اضغط "New Project"
4. املأ البيانات:
   - **Name:** MyProfile
   - **Database Password:** اختر كلمة مرور قوية (احفظها!)
   - **Region:** اختر أقرب region
5. اضغط "Create new project"
6. انتظر 2-3 دقائق حتى يكتمل الإعداد

### 2. الحصول على Connection String:

1. في Supabase Dashboard
2. اضغط "Settings" (⚙️) → "Database"
3. ابحث عن "Connection string"
4. اختر "URI"
5. انسخ الـ Connection String:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. استبدل `[YOUR-PASSWORD]` بكلمة المرور التي اخترتها

### 3. إنشاء الجداول:

1. في Supabase Dashboard
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

### 4. تثبيت Dependencies:

```bash
npm install
```

(يتم تثبيت `pg` تلقائياً)

### 5. إضافة Environment Variable:

#### محلياً (Development):

أنشئ ملف `.env` في جذر المشروع:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

#### في Railway (Production):

1. في Railway Dashboard
2. اضغط "Variables"
3. أضف:
   ```
   DATABASE_URL = postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### 6. استخدام server-supabase.js:

#### محلياً:

```bash
node server-supabase.js
```

#### في Railway:

1. في Railway Settings
2. Start Command: `node server-supabase.js`
3. أو استبدل `server.js` بـ `server-supabase.js`

---

## 🧪 اختبار الاتصال:

بعد تشغيل `server-supabase.js`، يجب أن ترى:

```
✅ Connected to Supabase (PostgreSQL) database
✅ Tables created/verified successfully
✅ Default admin user created
   Email: admin@admin.com
   Password: admin123
✅ Default portfolio data initialized
🚀 Server is running on http://localhost:3001
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
4. **Connection String** يجب أن يحتوي على كلمة المرور الصحيحة

---

## ✅ Checklist:

- [ ] إنشاء حساب Supabase
- [ ] إنشاء Project جديد
- [ ] الحصول على Connection String
- [ ] إنشاء الجداول (Users, PortfolioData)
- [ ] تثبيت dependencies: `npm install`
- [ ] إضافة `DATABASE_URL` في Environment Variables
- [ ] تشغيل `server-supabase.js`
- [ ] اختبار الاتصال

---

## 🚀 بعد الإعداد:

1. **محلياً:**
   ```bash
   node server-supabase.js
   ```

2. **في Railway:**
   - استخدم `server-supabase.js` بدلاً من `server.js`
   - أضف `DATABASE_URL` في Environment Variables

---

**جاهز للاستخدام! 🎉**

