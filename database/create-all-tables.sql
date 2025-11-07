-- =============================================
-- Create All Tables Script
-- =============================================
-- This script creates both PortfolioData and Users tables
-- Run this script to ensure all tables exist in the database

USE MyProfileDB;
GO

PRINT '========================================';
PRINT 'Creating Tables in MyProfileDB';
PRINT '========================================';
PRINT '';

-- =============================================
-- 1. Create PortfolioData Table
-- =============================================
PRINT '1. Creating PortfolioData table...';

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'PortfolioData' AND TABLE_SCHEMA = 'dbo')
BEGIN
    PRINT '   ⚠️  PortfolioData table already exists. Dropping...';
    DROP TABLE dbo.PortfolioData;
END

CREATE TABLE dbo.PortfolioData (
    id INT PRIMARY KEY IDENTITY(1,1),
    section NVARCHAR(50) NOT NULL UNIQUE,
    data NVARCHAR(MAX) NOT NULL,
    updatedAt DATETIME DEFAULT GETDATE()
);

PRINT '   ✅ PortfolioData table created successfully!';
GO

-- =============================================
-- 2. Create Users Table
-- =============================================
PRINT '';
PRINT '2. Creating Users table...';

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users' AND TABLE_SCHEMA = 'dbo')
BEGIN
    PRINT '   ⚠️  Users table already exists. Dropping...';
    DROP TABLE dbo.Users;
END

CREATE TABLE dbo.Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) DEFAULT 'admin',
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

PRINT '   ✅ Users table created successfully!';
GO

-- =============================================
-- 3. Create Index on Users.email
-- =============================================
PRINT '';
PRINT '3. Creating index on Users.email...';

IF EXISTS (SELECT * FROM sys.indexes WHERE name='IX_Users_Email' AND object_id = OBJECT_ID('dbo.Users'))
BEGIN
    PRINT '   ⚠️  Index already exists. Dropping...';
    DROP INDEX IX_Users_Email ON dbo.Users;
END

CREATE INDEX IX_Users_Email ON dbo.Users(email);

PRINT '   ✅ Index created successfully!';
GO

-- =============================================
-- 4. Verify Tables
-- =============================================
PRINT '';
PRINT '4. Verifying tables...';

SELECT 
    TABLE_SCHEMA,
    TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' 
  AND TABLE_NAME IN ('PortfolioData', 'Users')
ORDER BY TABLE_NAME;
GO

PRINT '';
PRINT '========================================';
PRINT '✅ All tables created successfully!';
PRINT '========================================';
PRINT '';
PRINT 'Note: The default admin user will be created automatically';
PRINT '      when the server starts for the first time.';
PRINT '';
PRINT 'Default Admin Credentials:';
PRINT '  Email: admin@admin.com';
PRINT '  Password: admin123';
PRINT '';

