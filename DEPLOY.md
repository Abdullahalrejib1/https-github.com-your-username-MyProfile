# 🚀 دليل رفع المشروع على Netlify

## ⚠️ ملاحظة مهمة

**Backend (server.js) يحتاج إلى استضافة منفصلة!**

Netlify يدعم فقط Frontend (Static Sites). Backend يحتاج إلى:
- Railway (موصى به - مجاني)
- Render (مجاني)
- Heroku (مدفوع)
- Vercel (Serverless Functions)

---

## 📋 خطوات الرفع

### الخطوة 1: رفع Backend على Railway

1. **سجل دخول على [railway.app](https://railway.app)**
   - استخدم GitHub للدخول

2. **أنشئ مشروع جديد:**
   - اضغط "New Project"
   - اختر "Deploy from GitHub repo"
   - اختر repository الخاص بك

3. **إعداد المشروع:**
   - Railway سيكتشف `server.js` تلقائياً
   - أضف Environment Variables:
     ```
     PORT=3001
     DATABASE_SERVER=your-server
     DATABASE_NAME=your-database
     DATABASE_USER=your-user
     DATABASE_PASSWORD=your-password
     ```

4. **احصل على URL:**
   - بعد الرفع، Railway سيعطيك URL مثل:
   - `https://your-app.railway.app`
   - **احفظ هذا الـ URL!**

### الخطوة 2: رفع Frontend على Netlify

#### أ) عبر Netlify Dashboard:

1. **سجل دخول على [netlify.com](https://netlify.com)**

2. **أنشئ موقع جديد:**
   - اضغط "Add new site" → "Import an existing project"
   - اختر GitHub/GitLab/Bitbucket
   - اختر repository الخاص بك

3. **إعدادات Build:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Environment Variables:**
   - اضغط "Site settings" → "Environment variables"
   - أضف:
     ```
     VITE_API_URL = https://your-app.railway.app/api
     ```
     (استبدل بـ URL الـ Backend من Railway)

5. **Deploy:**
   - اضغط "Deploy site"
   - انتظر حتى يكتمل البناء

#### ب) عبر Netlify CLI:

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

### الخطوة 3: تحديث CORS في Backend

افتح `server.js` وتأكد من أن CORS يسمح بـ Netlify URL:

```javascript
app.use(cors({
  origin: true, // يسمح بجميع الـ origins (آمن للـ production)
  // أو حدد الـ origins:
  // origin: [
  //   'https://your-site.netlify.app',
  //   'https://your-custom-domain.com'
  // ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## ✅ التحقق من الرفع

بعد الرفع، اختبر:

1. ✅ افتح الموقع على Netlify
2. ✅ تأكد من أن الصفحة الرئيسية تعمل
3. ✅ جرب تسجيل الدخول في Admin Panel
4. ✅ تأكد من أن API requests تعمل (افتح Developer Tools → Network)

---

## 🔧 استكشاف الأخطاء

### ❌ API requests لا تعمل
- **الحل:** تأكد من إضافة `VITE_API_URL` في Environment Variables في Netlify
- تأكد من أن Backend يعمل على Railway

### ❌ CORS errors
- **الحل:** تأكد من أن `server.js` يسمح بـ Netlify URL في CORS

### ❌ Routing لا يعمل
- **الحل:** تأكد من وجود ملف `public/_redirects` و `netlify.toml`

### ❌ Build fails
- **الحل:** 
  - تأكد من أن `npm run build` يعمل محلياً
  - تحقق من Logs في Netlify Dashboard

---

## 📝 ملفات تم إنشاؤها

- ✅ `netlify.toml` - إعدادات Netlify
- ✅ `public/_redirects` - SPA routing
- ✅ `.gitignore` - ملفات Git
- ✅ `DEPLOY.md` - هذا الملف

---

## 🎉 بعد الرفع

1. **احصل على URL:**
   - Netlify سيعطيك URL مثل: `https://random-name-123.netlify.app`

2. **Domain مخصص (اختياري):**
   - اضغط "Site settings" → "Domain management"
   - أضف domain مخصص

3. **SSL Certificate:**
   - Netlify يوفر SSL تلقائياً ✅

---

## 📚 روابط مفيدة

- [Netlify Docs](https://docs.netlify.com/)
- [Railway Docs](https://docs.railway.app/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## 💡 نصائح

1. **استخدم Environment Variables** دائماً للـ API URLs
2. **اختبر Backend** قبل رفع Frontend
3. **راقب Logs** في Netlify و Railway
4. **استخدم HTTPS** دائماً في Production

---

**جاهز للرفع! 🚀**

