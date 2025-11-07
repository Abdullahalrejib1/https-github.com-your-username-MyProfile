# قاعدة البيانات - Users Table

## ملف users.sql

هذا الملف يحتوي على SQL script لإنشاء جدول Users في قاعدة البيانات SQL Server.

## كيفية الاستخدام

### الطريقة 1: استخدام SQL Server Management Studio (SSMS)

1. افتح SQL Server Management Studio
2. اتصل بخادم قاعدة البيانات الخاص بك
3. افتح ملف `users.sql`
4. تأكد من أن قاعدة البيانات `MyProfileDB` محددة
5. اضغط F5 أو Execute لتنفيذ الـ script

### الطريقة 2: استخدام سطر الأوامر (sqlcmd)

```bash
sqlcmd -S ABDULLAH\SQLEXPRESS -d MyProfileDB -i users.sql
```

### الطريقة 3: تلقائي من خلال Server

الخادم (`server.js`) سيقوم بإنشاء الجدول تلقائياً عند التشغيل الأول إذا لم يكن موجوداً.

## هيكل الجدول

```sql
Users
├── id (INT, PRIMARY KEY, IDENTITY)
├── email (NVARCHAR(255), UNIQUE, NOT NULL)
├── password (NVARCHAR(255), NOT NULL)
├── role (NVARCHAR(50), DEFAULT 'admin')
├── createdAt (DATETIME, DEFAULT GETDATE())
└── updatedAt (DATETIME, DEFAULT GETDATE())
```

## بيانات تسجيل الدخول الافتراضية

عند أول تشغيل للخادم، سيتم إنشاء مستخدم افتراضي تلقائياً:

- **البريد الإلكتروني:** `admin@admin.com`
- **كلمة المرور:** `admin123`

## ملاحظات مهمة

1. **تشفير كلمة المرور:** كلمات المرور مشفرة باستخدام hash function بسيط في `server.js`
2. **الإنتاج:** في بيئة الإنتاج، يجب استخدام `bcrypt` أو مكتبة تشفير أقوى
3. **الأمان:** تأكد من حماية قاعدة البيانات وعدم تعريض كلمات المرور

## إضافة مستخدم جديد

يمكنك إضافة مستخدم جديد يدوياً من خلال SQL:

```sql
-- حساب hash لكلمة المرور من خلال server.js أولاً
-- ثم استخدم القيمة المشفرة هنا
INSERT INTO Users (email, password, role) 
VALUES ('newadmin@example.com', 'hashed_password_here', 'admin');
```

أو يمكنك إضافة endpoint في `server.js` لإنشاء مستخدمين جدد.

