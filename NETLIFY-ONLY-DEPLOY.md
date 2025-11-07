# 🚀 رفع المشروع على Netlify فقط (بدون Railway)

## ✅ ما تم إعداده:

1. ✅ **Supabase Client** - `src/lib/supabase.ts`
2. ✅ **Index.tsx** - يستخدم Supabase مباشرة
3. ✅ **Admin.tsx** - Login يستخدم Supabase RPC

---

## 📋 الخطوات:

### 1. إنشاء الجداول في Supabase:

اذهب إلى: https://supabase.com/dashboard/project/ivoppfeuslvfkmamizsv

**SQL Editor → Run:**

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

-- RLS للقراءة العامة
ALTER TABLE public.PortfolioData ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.PortfolioData
  FOR SELECT USING (true);

-- RLS للـ Users
ALTER TABLE public.Users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read" ON public.Users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON public.Users FOR ALL USING (true);
```

### 2. إنشاء RPC Function للـ Login:

**SQL Editor → Run:**

```sql
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
BEGIN
  SELECT * INTO user_record
  FROM public.Users
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
  END IF;
  
  IF user_record.password = user_password THEN
    RETURN jsonb_build_object(
      'success', true,
      'token', md5(user_record.email || user_record.id || now()::text),
      'user', jsonb_build_object('id', user_record.id, 'email', user_record.email, 'role', user_record.role)
    );
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
  END IF;
END;
$$;
```

### 3. إنشاء Admin User:

**SQL Editor → Run:**

```sql
INSERT INTO public.Users (email, password, role)
VALUES ('admin@admin.com', 'admin123', 'admin')
ON CONFLICT (email) DO UPDATE
SET password = 'admin123', role = 'admin';
```

### 4. الحصول على Supabase Keys:

**Supabase Dashboard → Settings → API:**
- انسخ **Project URL**
- انسخ **anon/public key**

### 5. رفع على Netlify:

1. اذهب إلى: https://netlify.com
2. Add new site → Import from GitHub
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Environment variables:
   ```
   VITE_SUPABASE_URL = https://ivoppfeuslvfkmamizsv.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key-here
   ```
5. Deploy

---

## ✅ جاهز!

**لا حاجة لـ Railway! 🎉**

