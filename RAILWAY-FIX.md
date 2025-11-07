# 🔧 إصلاح مشكلة Railway - Bun vs npm

## المشكلة:
Railway يحاول استخدام Bun بدلاً من npm، مما يسبب خطأ في الـ lockfile.

## الحل:

### الطريقة 1: إضافة Environment Variable في Railway (الأسهل)

1. اذهب إلى Railway Dashboard
2. اختر المشروع
3. اضغط "Variables"
4. أضف Environment Variable:
   ```
   NIXPACKS_NO_BUN = 1
   ```
5. اضغط "Redeploy"

### الطريقة 2: استخدام ملفات الإعداد

تم إنشاء:
- ✅ `railway.json` - إعدادات Railway
- ✅ `nixpacks.toml` - إعدادات Nixpacks

### الطريقة 3: تحديث package.json

أضف script في `package.json`:
```json
"scripts": {
  "railway:build": "npm install",
  "railway:start": "node server.js"
}
```

---

## خطوات سريعة:

### في Railway Dashboard:

1. **Variables → Add Variable:**
   ```
   Key: NIXPACKS_NO_BUN
   Value: 1
   ```

2. **Settings → Build Command:**
   ```
   npm install
   ```

3. **Settings → Start Command:**
   ```
   node server.js
   ```

4. **اضغط "Redeploy"**

---

## ملاحظات:

- ✅ تم إضافة `bun.lockb` إلى `.gitignore`
- ✅ المشروع يستخدم `npm` و `package-lock.json`
- ✅ Railway سيستخدم npm بعد إضافة `NIXPACKS_NO_BUN=1`

---

## بعد الإصلاح:

1. ✅ Railway سيستخدم npm بدلاً من bun
2. ✅ سيتم تثبيت dependencies بنجاح
3. ✅ المشروع سيعمل بشكل صحيح

---

**جرب الطريقة 1 أولاً (إضافة Environment Variable)!**

