# 🔧 استكشاف أخطاء Netlify - https://abdullahalrejib.netlify.app

## المشاكل المحتملة:

### 1. الموقع فارغ أو لا يعرض محتوى

**الأسباب المحتملة:**
- ❌ Build فشل
- ❌ Environment Variables غير موجودة
- ❌ API URL غير صحيح
- ❌ Routing لا يعمل

---

## ✅ خطوات الإصلاح:

### الخطوة 1: فحص Build Logs

1. اذهب إلى [Netlify Dashboard](https://app.netlify.com)
2. اختر الموقع: `abdullahalrejib`
3. اضغط "Deploys"
4. افتح آخر Deploy
5. افحص "Build log"

**ابحث عن:**
- ✅ `Build successful`
- ❌ `Build failed` أو أخطاء

### الخطوة 2: فحص Environment Variables

1. في Netlify Dashboard
2. اضغط "Site settings" → "Environment variables"
3. تأكد من وجود:
   ```
   VITE_API_URL = https://your-backend-url.railway.app/api
   ```
   (استبدل بـ URL الـ Backend الخاص بك)

### الخطوة 3: فحص Build Settings

1. في Netlify Dashboard
2. اضغط "Site settings" → "Build & deploy"
3. تأكد من:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** `18` (أو أحدث)

### الخطوة 4: إعادة Build

1. في Netlify Dashboard
2. اضغط "Deploys"
3. اضغط "Trigger deploy" → "Clear cache and deploy site"

---

## 🔍 فحص المشاكل الشائعة:

### المشكلة 1: Build فشل

**الحل:**
```bash
# اختبر Build محلياً
npm run build

# إذا نجح محلياً، المشكلة في Netlify
# تحقق من:
# - Node version
# - Build command
# - Dependencies
```

### المشكلة 2: الموقع فارغ (Blank Page)

**الأسباب:**
1. **API URL غير صحيح:**
   - تأكد من إضافة `VITE_API_URL` في Environment Variables
   - تأكد من أن Backend يعمل

2. **Routing لا يعمل:**
   - تأكد من وجود `public/_redirects`
   - تأكد من `netlify.toml`

3. **JavaScript errors:**
   - افتح Developer Tools (F12)
   - افحص Console للأخطاء

### المشكلة 3: CORS errors

**الحل:**
- تأكد من أن `server.js` يسمح بـ Netlify URL:
  ```javascript
  origin: true  // يسمح بجميع الـ origins
  ```
  أو أضف Netlify URL:
  ```javascript
  origin: [
    'https://abdullahalrejib.netlify.app',
    'https://your-custom-domain.com'
  ]
  ```

---

## 🚀 خطوات سريعة للإصلاح:

### 1. فحص Build:
```
Netlify Dashboard → Deploys → آخر Deploy → Build log
```

### 2. إضافة Environment Variable:
```
Site settings → Environment variables → Add variable
Key: VITE_API_URL
Value: https://your-backend-url.railway.app/api
```

### 3. إعادة Deploy:
```
Deploys → Trigger deploy → Clear cache and deploy site
```

### 4. فحص الموقع:
```
افتح: https://abdullahalrejib.netlify.app
افتح Developer Tools (F12) → Console
ابحث عن أخطاء
```

---

## 📋 Checklist:

- [ ] Build نجح في Netlify
- [ ] Environment Variables موجودة
- [ ] `VITE_API_URL` مضبوط بشكل صحيح
- [ ] Backend يعمل على Railway
- [ ] CORS يسمح بـ Netlify URL
- [ ] `public/_redirects` موجود
- [ ] `netlify.toml` موجود
- [ ] لا توجد أخطاء في Console

---

## 🔗 روابط مفيدة:

- [Netlify Dashboard](https://app.netlify.com)
- [Build Logs](https://app.netlify.com/sites/abdullahalrejib/deploys)
- [Environment Variables](https://app.netlify.com/sites/abdullahalrejib/configuration/env)

---

## 💡 نصائح:

1. **اختبر Build محلياً أولاً:**
   ```bash
   npm run build
   npm run preview
   ```

2. **راقب Logs:**
   - Netlify Dashboard → Deploys → Build log
   - Browser → Developer Tools → Console

3. **استخدم Environment Variables:**
   - لا تكتب URLs مباشرة في الكود
   - استخدم `VITE_API_URL`

---

**بعد تطبيق هذه الخطوات، الموقع يجب أن يعمل! 🎉**

