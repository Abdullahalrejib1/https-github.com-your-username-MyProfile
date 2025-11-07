# 🗄️ دليل ربط Supabase مع المشروع

## ⚠️ ملاحظة مهمة:

**Supabase يستخدم PostgreSQL وليس SQL Server!**

- ❌ لا يمكن ربط Supabase مباشرة مع SQL Server Management Studio
- ✅ يمكن استخدام Supabase كبديل كامل لـ SQL Server
- ✅ Supabase يوفر واجهة ويب لإدارة قاعدة البيانات

---

## 📋 خطوات إعداد Supabase:

### الخطوة 1: إنشاء حساب Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. اضغط "Start your project"
3. سجل دخول بـ GitHub
4. اضغط "New Project"
5. املأ البيانات:
   - **Name:** MyProfile
   - **Database Password:** اختر كلمة مرور قوية
   - **Region:** اختر أقرب region
6. اضغط "Create new project"
7. انتظر حتى يكتمل الإعداد (2-3 دقائق)

### الخطوة 2: الحصول على Connection String

1. في Supabase Dashboard
2. اضغط "Settings" (⚙️) → "Database"
3. ابحث عن "Connection string"
4. اختر "URI" أو "Connection pooling"
5. انسخ الـ Connection String (مثل):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### الخطوة 3: إنشاء الجداول في Supabase

1. في Supabase Dashboard
2. اضغط "SQL Editor" من القائمة الجانبية
3. أنشئ الجداول:

#### جدول Users:
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
```

#### جدول PortfolioData:
```sql
CREATE TABLE IF NOT EXISTS public.PortfolioData (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### الخطوة 4: تحديث server.js لاستخدام Supabase

سيتم تحديث الكود لاستخدام `pg` (PostgreSQL) بدلاً من `mssql`.

---

## 🔧 تحديث المشروع:

### 1. تثبيت PostgreSQL Client:

```bash
npm install pg
```

### 2. تحديث server.js:

سيتم إنشاء ملف `server-supabase.js` كبديل.

---

## 📊 استخدام Supabase Dashboard:

### الوصول إلى قاعدة البيانات:

1. **SQL Editor:**
   - اذهب إلى "SQL Editor"
   - اكتب SQL queries
   - اضغط "Run"

2. **Table Editor:**
   - اذهب إلى "Table Editor"
   - عرض وتعديل البيانات مباشرة

3. **Database:**
   - اذهب إلى "Database" → "Tables"
   - عرض الجداول والبيانات

---

## 🔗 ربط Supabase مع SQL Server Management Studio:

**لا يمكن ربط Supabase مباشرة مع SSMS** لأن:
- Supabase = PostgreSQL
- SSMS = SQL Server فقط

**البدائل:**
1. ✅ استخدام Supabase Dashboard (أسهل)
2. ✅ استخدام pgAdmin (لـ PostgreSQL)
3. ✅ استخدام DBeaver (يدعم PostgreSQL و SQL Server)

---

## 🚀 استخدام Supabase في Production:

### Environment Variables في Railway:

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

---

## 📝 مقارنة:

| الميزة | SQL Server | Supabase |
|--------|-----------|----------|
| النوع | SQL Server | PostgreSQL |
| السعر | مدفوع | مجاني (حتى حد معين) |
| الاستضافة | محلي/سحابي | سحابي فقط |
| الواجهة | SSMS | Dashboard على الويب |
| API | REST API مخصص | REST API تلقائي |

---

## ✅ المزايا:

1. **مجاني** حتى 500MB
2. **واجهة ويب** سهلة الاستخدام
3. **REST API** تلقائي
4. **Real-time** subscriptions
5. **Authentication** مدمج
6. **Storage** للصور والملفات

---

**بعد إعداد Supabase، سنحدث الكود لاستخدامه! 🎉**

