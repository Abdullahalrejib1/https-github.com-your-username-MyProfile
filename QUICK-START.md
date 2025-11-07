# ⚡ دليل سريع - رفع المشروع على Netlify

## الخطوة 1: رفع المشروع على GitHub

### أ) إذا لم يكن لديك Repository:

```bash
# في مجلد المشروع
cd "C:\Users\abdul\OneDrive\Desktop\MY Projects\MyProfile"

# تهيئة Git
git init

# إضافة جميع الملفات
git add .

# عمل Commit
git commit -m "Initial commit"

# تغيير اسم الفرع إلى main
git branch -M main
```

### ب) إنشاء Repository على GitHub:

1. اذهب إلى [github.com](https://github.com)
2. اضغط "+" → "New repository"
3. اسم المشروع: `MyProfile`
4. اختر Public أو Private
5. **لا** تضع README أو .gitignore
6. اضغط "Create repository"

### ج) ربط المشروع بـ GitHub:

```bash
# استبدل your-username بـ اسمك على GitHub
git remote add origin https://github.com/your-username/MyProfile.git

# رفع المشروع
git push -u origin main
```

---

## الخطوة 2: رفع Backend على Railway

1. اذهب إلى [railway.app](https://railway.app)
2. سجل دخول بـ GitHub
3. اضغط "New Project" → "Deploy from GitHub repo"
4. اختر Repository: `MyProfile`
5. Railway سيكتشف `server.js` تلقائياً
6. أضف Environment Variables:
   - `PORT=3001`
   - Database connection strings
7. احصل على URL (مثل: `https://myprofile.railway.app`)

---

## الخطوة 3: رفع Frontend على Netlify

1. اذهب إلى [netlify.com](https://netlify.com)
2. سجل دخول بـ GitHub
3. اضغط "Add new site" → "Import an existing project"
4. اختر GitHub
5. اختر Repository: `MyProfile`
6. إعدادات Build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Environment Variables:
   - اضغط "Show advanced"
   - اضغط "New variable"
   - **Key:** `VITE_API_URL`
   - **Value:** `https://myprofile.railway.app/api` (URL من Railway)
8. اضغط "Deploy site"

---

## ✅ Repository URL الذي تحتاجه:

```
https://github.com/your-username/MyProfile
```

**استبدل:**
- `your-username` → اسمك على GitHub
- `MyProfile` → اسم Repository

---

## 🎯 مثال:

إذا كان اسمك على GitHub هو `abdul` واسم Repository هو `MyProfile`:

```
https://github.com/abdul/MyProfile
```

**هذا هو الـ URL الذي تعطيه لـ Netlify/Railway!**

---

## 📝 ملاحظة:

- **لا** تحتاج `.git` في النهاية عند استخدام Netlify/Railway
- فقط: `https://github.com/username/repo-name`

---

**جاهز! 🚀**

