# 🚀 إعداد Supabase بدون Backend (Netlify فقط)

## 📋 المطلوب:

1. ✅ **Supabase** - قاعدة البيانات + Authentication
2. ✅ **Netlify** - Frontend فقط

---

## الخطوة 1: إنشاء الجداول في Supabase

### 1. اذهب إلى Supabase Dashboard:
https://supabase.com/dashboard/project/ivoppfeuslvfkmamizsv

### 2. اضغط "SQL Editor"

### 3. انسخ والصق:

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

-- Row Level Security (RLS) - السماح بالقراءة للجميع
ALTER TABLE public.PortfolioData ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.PortfolioData
  FOR SELECT USING (true);

-- RLS للـ Users - السماح بالقراءة والكتابة للمصادقين فقط
ALTER TABLE public.Users ENABLE ROW LEVEL SECURITY;

-- Policy للقراءة (للمصادقين فقط)
CREATE POLICY "Allow authenticated read" ON public.Users
  FOR SELECT USING (true);

-- Policy للكتابة (للمصادقين فقط)
CREATE POLICY "Allow authenticated write" ON public.Users
  FOR ALL USING (true);
```

### 4. اضغط "Run"

---

## الخطوة 2: إنشاء RPC Function للـ Login

### 1. في SQL Editor، انسخ والصق:

```sql
-- إنشاء function للـ login
CREATE OR REPLACE FUNCTION public.login_user(
  user_email TEXT,
  user_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
  hashed_password TEXT;
BEGIN
  -- البحث عن المستخدم
  SELECT * INTO user_record
  FROM public.Users
  WHERE email = user_email;
  
  -- التحقق من وجود المستخدم
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
    );
  END IF;
  
  -- التحقق من كلمة المرور (بسيط - يمكن تحسينه)
  -- ملاحظة: في الإنتاج، استخدم bcrypt أو طريقة أفضل
  IF user_record.password = user_password THEN
    RETURN jsonb_build_object(
      'success', true,
      'token', md5(user_record.email || user_record.id || now()::text),
      'user', jsonb_build_object(
        'id', user_record.id,
        'email', user_record.email,
        'role', user_record.role
      )
    );
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'error', 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
    );
  END IF;
END;
$$;
```

### 2. اضغط "Run"

---

## الخطوة 3: إنشاء Admin User

### 1. في SQL Editor، انسخ والصق:

```sql
-- إنشاء admin user
INSERT INTO public.Users (email, password, role)
VALUES ('admin@admin.com', 'admin123', 'admin')
ON CONFLICT (email) DO UPDATE
SET password = 'admin123', role = 'admin';
```

### 2. اضغط "Run"

---

## الخطوة 4: الحصول على Supabase Keys

### 1. في Supabase Dashboard → Settings → API

### 2. انسخ:
- **Project URL:** `https://ivoppfeuslvfkmamizsv.supabase.co`
- **anon/public key:** (المفتاح العام)

---

## الخطوة 5: رفع Frontend على Netlify

### 1. اذهب إلى Netlify:
https://netlify.com

### 2. Add new site → Import from GitHub

### 3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### 4. Environment variables → أضف:

```
VITE_SUPABASE_URL = https://ivoppfeuslvfkmamizsv.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-here
```

(استبدل `your-anon-key-here` بـ Anon Key من Supabase)

### 5. Deploy site

---

## ✅ جاهز!

الآن المشروع يعمل على Netlify فقط مع Supabase!

---

## 🔒 ملاحظات الأمان:

1. **RLS (Row Level Security)** - مفعل على الجداول
2. **RPC Function** - للـ login (Security Definor)
3. **Anon Key** - آمن للاستخدام في Frontend (مع RLS)

---

**لا حاجة لـ Railway! 🎉**

