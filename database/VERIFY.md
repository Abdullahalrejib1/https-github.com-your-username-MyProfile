# التحقق من الجداول في قاعدة البيانات

## الطريقة 1: استخدام API Endpoint

### التحقق من وجود الجداول:
افتح المتصفح وانتقل إلى:
```
http://localhost:3001/api/check-tables
```

ستحصل على معلومات عن كلا الجدولين:
- `PortfolioData` table
- `Users` table

### إنشاء الجداول يدوياً (إذا لم تكن موجودة):
استخدم Postman أو أي أداة API وارسل:
```
POST http://localhost:3001/api/create-tables
```

## الطريقة 2: استخدام SQL Server Management Studio

### التحقق من وجود الجداول:
```sql
USE MyProfileDB;
GO

-- التحقق من جدول PortfolioData
SELECT 
    TABLE_SCHEMA,
    TABLE_NAME,
    TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'PortfolioData' AND TABLE_SCHEMA = 'dbo';

-- التحقق من جدول Users
SELECT 
    TABLE_SCHEMA,
    TABLE_NAME,
    TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'Users' AND TABLE_SCHEMA = 'dbo';

-- عرض جميع الجداول في schema dbo
SELECT 
    TABLE_SCHEMA,
    TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo'
ORDER BY TABLE_NAME;
```

### إنشاء الجداول يدوياً:
قم بتشغيل الملف:
```
database/create-all-tables.sql
```

أو استخدم الملفات الفردية:
- `database/portfolio-data.sql` - لإنشاء جدول PortfolioData فقط
- `database/users.sql` - لإنشاء جدول Users فقط

## الطريقة 3: من خلال Server Logs

عند تشغيل الخادم (`npm start`)، ستظهر رسائل في الـ console:

```
✅ Connected to SQL Server database
📝 Creating PortfolioData table...
✅ PortfolioData table created successfully in dbo schema
📝 Creating Users table...
✅ Users table created successfully in dbo schema
✅ Users table index created
```

إذا رأيت هذه الرسائل، فالجداول تم إنشاؤها بنجاح.

## حل المشاكل

### إذا لم يظهر جدول PortfolioData:

1. **تحقق من الاتصال بقاعدة البيانات:**
   ```sql
   SELECT @@SERVERNAME, DB_NAME();
   ```

2. **تحقق من الصلاحيات:**
   - تأكد أن المستخدم `sa` لديه صلاحيات CREATE TABLE

3. **شغّل SQL Script يدوياً:**
   ```sql
   USE MyProfileDB;
   GO
   
   IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
                  WHERE TABLE_NAME = 'PortfolioData' AND TABLE_SCHEMA = 'dbo')
   CREATE TABLE dbo.PortfolioData (
       id INT PRIMARY KEY IDENTITY(1,1),
       section NVARCHAR(50) NOT NULL UNIQUE,
       data NVARCHAR(MAX) NOT NULL,
       updatedAt DATETIME DEFAULT GETDATE()
   );
   GO
   ```

4. **أعد تشغيل الخادم:**
   ```bash
   npm start
   ```

### التحقق من البيانات في الجداول:

```sql
-- عرض بيانات PortfolioData
SELECT * FROM dbo.PortfolioData;

-- عرض بيانات Users
SELECT id, email, role, createdAt FROM dbo.Users;
```

## ملاحظات مهمة

- جميع الجداول تُنشأ في schema `dbo` (الافتراضي)
- الجداول تُنشأ تلقائياً عند تشغيل الخادم لأول مرة
- إذا كان الجدول موجوداً مسبقاً، لن يتم إعادة إنشائه
- البيانات الافتراضية تُضاف تلقائياً إذا كان الجدول فارغاً
