# ⚙️ إعداد Environment Variables

## 📋 خطوات سريعة:

### 1. الحصول على كلمة المرور:

إذا نسيت كلمة المرور:

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر Project: `ivoppfeuslvfkmamizsv`
3. Settings (⚙️) → Database
4. اضغط "Reset database password"
5. اختر كلمة مرور جديدة (احفظها!)

### 2. إنشاء ملف `.env`:

1. انسخ ملف `.env.example`:
   ```bash
   copy .env.example .env
   ```

2. افتح ملف `.env` وعدّل:
   ```
   DATABASE_URL=postgresql://postgres:كلمة_المرور_الحقيقية@db.ivoppfeuslvfkmamizsv.supabase.co:5432/postgres
   ```

   **مثال:**
   ```
   DATABASE_URL=postgresql://postgres:MyPassword123@db.ivoppfeuslvfkmamizsv.supabase.co:5432/postgres
   ```

### 3. اختبار الاتصال:

```bash
npm run server:supabase
```

يجب أن ترى:
```
✅ Connected to Supabase (PostgreSQL) database
✅ Tables created/verified successfully
✅ Default admin user created
   Email: admin@admin.com
   Password: admin123
🚀 Server is running on http://localhost:3001
```

---

## 🚀 في Railway (Production):

1. في Railway Dashboard
2. اضغط "Variables"
3. أضف:
   ```
   DATABASE_URL = postgresql://postgres:كلمة_المرور@db.ivoppfeuslvfkmamizsv.supabase.co:5432/postgres
   ```

4. في Settings → Start Command:
   ```
   node server-supabase.js
   ```

---

## ⚠️ ملاحظات:

- ✅ ملف `.env` موجود في `.gitignore` (آمن)
- ✅ لا ترفع ملف `.env` على GitHub
- ✅ استخدم Environment Variables في Railway

---

**بعد إضافة كلمة المرور، جرب تشغيل `npm run server:supabase`! 🎉**

