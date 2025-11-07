# رفع المشروع على Netlify

## ⚠️ ملاحظة مهمة

**Backend (server.js) لا يمكن رفعه على Netlify مباشرة!**

Netlify يدعم فقط:
- ✅ Static Sites (Frontend)
- ✅ Serverless Functions

لكن Express Server يحتاج إلى استضافة منفصلة مثل:
- Railway
- Render
- Heroku
- Vercel (Serverless Functions)

## خطوات رفع Frontend على Netlify:

### 1. إعداد Backend أولاً

قبل رفع Frontend، يجب أن يكون Backend يعمل على استضافة منفصلة:

**خيارات استضافة Backend:**

#### أ) Railway (موصى به - مجاني)
1. اذهب إلى [railway.app](https://railway.app)
2. سجل دخول بـ GitHub
3. أنشئ مشروع جديد
4. أضف PostgreSQL أو استخدم SQL Server
5. ارفع `server.js` و `package.json`
6. أضف Environment Variables:
   - `PORT=3001`
   - Database connection strings

#### ب) Render (مجاني)
1. اذهب إلى [render.com](https://render.com)
2. أنشئ Web Service
3. ارفع `server.js`
4. أضف Environment Variables

### 2. رفع Frontend على Netlify

#### الطريقة الأولى: عبر Netlify Dashboard

1. **اذهب إلى [netlify.com](https://netlify.com)**
   - سجل دخول أو أنشئ حساب

2. **أنشئ موقع جديد:**
   - اضغط "Add new site" → "Import an existing project"
   - اختر GitHub/GitLab/Bitbucket
   - اختر repository الخاص بك

3. **إعدادات Build:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** `18` (أو أحدث)

4. **Environment Variables:**
   - اضغط "Site settings" → "Environment variables"
   - أضف:
     ```
     VITE_API_URL = https://your-backend-url.railway.app/api
     ```
     (استبدل بالـ URL الخاص بـ Backend)

5. **Deploy:**
   - اضغط "Deploy site"
   - انتظر حتى يكتمل البناء

#### الطريقة الثانية: عبر Netlify CLI

```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# بناء المشروع
npm run build

# رفع المشروع
netlify deploy --prod
```

### 3. إعداد Redirects

تم إنشاء ملف `netlify.toml` و `public/_redirects` تلقائياً.

**ملاحظة:** يجب تحديث `netlify.toml` مع URL الـ Backend الخاص بك:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.railway.app/api/:splat"
  status = 200
  force = true
```

### 4. تحديث CORS في Backend

تأكد من أن `server.js` يسمح بـ origin الخاص بـ Netlify:

```javascript
const allowedOrigins = [
  'http://localhost:5050',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-site.netlify.app',  // أضف هذا
  'https://your-custom-domain.com'  // إذا كان لديك domain مخصص
];
```

### 5. اختبار

بعد الرفع:
1. افتح الموقع على Netlify
2. تأكد من أن Frontend يعمل
3. جرب تسجيل الدخول في Admin Panel
4. تأكد من أن API requests تعمل

## استكشاف الأخطاء:

### المشكلة: API requests لا تعمل
- **الحل:** تأكد من إضافة `VITE_API_URL` في Environment Variables
- تأكد من أن Backend يعمل ويمكن الوصول إليه

### المشكلة: Routing لا يعمل
- **الحل:** تأكد من وجود ملف `public/_redirects` و `netlify.toml`

### المشكلة: CORS errors
- **الحل:** أضف Netlify URL في `allowedOrigins` في `server.js`

## نصائح:

1. **استخدم Environment Variables** للـ API URL
2. **اختبر Backend** قبل رفع Frontend
3. **استخدم HTTPS** دائماً في Production
4. **راقب Logs** في Netlify Dashboard

## روابط مفيدة:

- [Netlify Documentation](https://docs.netlify.com/)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)

