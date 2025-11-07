# 🔗 الحصول على Supabase Connection String

## ⚠️ ما أعطيته لي:

أنت أعطيتني **API Keys** وليس **Database Connection String**.

- ❌ API Keys: للوصول إلى Supabase REST API
- ✅ Connection String: للاتصال بقاعدة البيانات مباشرة

---

## 📋 خطوات الحصول على Connection String:

### 1. اذهب إلى Supabase Dashboard:

1. اذهب إلى [supabase.com/dashboard](https://supabase.com/dashboard)
2. اختر Project: `ivoppfeuslvfkmamizsv`

### 2. الحصول على Database URL:

1. اضغط "Settings" (⚙️) من القائمة الجانبية
2. اضغط "Database" من القائمة الفرعية
3. ابحث عن قسم "Connection string"
4. اختر "URI" (وليس "Session mode" أو "Transaction")
5. انسخ الـ Connection String

### 3. الشكل الصحيح:

Connection String يجب أن يكون بهذا الشكل:

```
postgresql://postgres:[YOUR-PASSWORD]@db.ivoppfeuslvfkmamizsv.supabase.co:5432/postgres
```

**ملاحظة:** استبدل `[YOUR-PASSWORD]` بكلمة المرور التي اخترتها عند إنشاء المشروع!

---

## 🔍 إذا نسيت كلمة المرور:

1. في Supabase Dashboard
2. Settings → Database
3. اضغط "Reset database password"
4. اختر كلمة مرور جديدة
5. استخدمها في Connection String

---

## 📝 مثال على Connection String:

```
postgresql://postgres:MyPassword123@db.ivoppfeuslvfkmamizsv.supabase.co:5432/postgres
```

---

## ✅ بعد الحصول على Connection String:

### محلياً:

أنشئ ملف `.env` في جذر المشروع:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.ivoppfeuslvfkmamizsv.supabase.co:5432/postgres
```

### في Railway:

1. في Railway Dashboard
2. اضغط "Variables"
3. أضف:
   ```
   DATABASE_URL = postgresql://postgres:[PASSWORD]@db.ivoppfeuslvfkmamizsv.supabase.co:5432/postgres
   ```

---

## 🚀 بعد إضافة Connection String:

### تشغيل محلياً:

```bash
npm run server:supabase
```

### في Railway:

- استخدم `server-supabase.js` بدلاً من `server.js`
- أضف `DATABASE_URL` في Environment Variables

---

**أرسل لي Connection String (مع كلمة المرور) وسأساعدك في إعداده! 🔗**

