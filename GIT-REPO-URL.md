# 🔗 كيفية الحصول على Repository URL

## ما هو Repository URL؟

هو رابط المستودع على GitHub/GitLab/Bitbucket الذي يحتوي على كود المشروع.

---

## 📋 خطوات الحصول على Repository URL:

### الطريقة 1: إذا كان لديك Repository على GitHub

1. **اذهب إلى GitHub:**
   - [github.com](https://github.com)
   - سجل دخول

2. **أنشئ Repository جديد:**
   - اضغط على "+" في الأعلى → "New repository"
   - اسم المشروع: `MyProfile` (أو أي اسم تريده)
   - اختر Public أو Private
   - **لا** تضع README أو .gitignore (لأن المشروع موجود بالفعل)
   - اضغط "Create repository"

3. **احصل على URL:**
   - بعد إنشاء Repository، GitHub سيعطيك URL مثل:
   ```
   https://github.com/your-username/MyProfile.git
   ```
   - **انسخ هذا الـ URL!**

4. **ارفع المشروع:**
   ```bash
   # في مجلد المشروع
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/MyProfile.git
   git push -u origin main
   ```

### الطريقة 2: إذا كان لديك Repository بالفعل

1. **اذهب إلى Repository على GitHub**
2. **اضغط على زر "Code" (الأخضر)**
3. **انسخ الـ URL:**
   - HTTPS: `https://github.com/username/repo-name.git`
   - SSH: `git@github.com:username/repo-name.git`

---

## 🎯 أمثلة على Repository URLs:

### GitHub:
```
https://github.com/your-username/MyProfile.git
```

### GitLab:
```
https://gitlab.com/your-username/MyProfile.git
```

### Bitbucket:
```
https://bitbucket.org/your-username/MyProfile.git
```

---

## 📝 ما الذي تحتاجه عند رفع المشروع على Netlify/Railway:

### عند رفع على Netlify:

1. **اختر "Import an existing project"**
2. **اختر GitHub/GitLab/Bitbucket**
3. **Netlify سيعرض قائمة Repositories**
4. **اختر Repository الخاص بك**
5. **أو أدخل URL يدوياً:**
   ```
   https://github.com/your-username/MyProfile
   ```
   (بدون `.git` في النهاية)

### عند رفع على Railway:

1. **اضغط "New Project"**
2. **اختر "Deploy from GitHub repo"**
3. **Railway سيعرض قائمة Repositories**
4. **اختر Repository الخاص بك**

---

## ⚠️ ملاحظات مهمة:

1. **يجب أن يكون المشروع على GitHub/GitLab/Bitbucket أولاً**
2. **URL يجب أن يكون public أو أن تكون لديك صلاحيات الوصول**
3. **تأكد من رفع جميع الملفات المهمة**

---

## 🚀 خطوات سريعة:

### 1. إنشاء Repository على GitHub:

```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

### 2. اذهب إلى GitHub وأنشئ Repository جديد

### 3. اربط المشروع:

```bash
git remote add origin https://github.com/your-username/MyProfile.git
git push -u origin main
```

### 4. استخدم هذا الـ URL في Netlify/Railway:
```
https://github.com/your-username/MyProfile
```

---

## ❓ أسئلة شائعة:

**س: ماذا لو لم يكن لدي حساب GitHub؟**
- أنشئ حساب مجاني على [github.com](https://github.com)

**س: هل يجب أن يكون Repository Public؟**
- لا، يمكن أن يكون Private، لكن يجب ربط حساب GitHub مع Netlify/Railway

**س: ماذا لو كان المشروع على GitLab أو Bitbucket؟**
- نفس الخطوات، لكن استخدم GitLab/Bitbucket URL

---

**بعد الحصول على Repository URL، استخدمه في Netlify/Railway! 🎉**

