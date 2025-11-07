-- =============================================
-- Users Table for Admin Authentication
-- =============================================
-- This script creates the Users table for admin login
-- The default admin user will be created automatically by the server
-- when it starts for the first time.

USE MyProfileDB;
GO

-- Drop table if exists (for testing/recreation purposes)
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users' AND TABLE_SCHEMA = 'dbo')
    DROP TABLE dbo.Users;
GO

-- Create Users table in dbo schema
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users' AND TABLE_SCHEMA = 'dbo')
CREATE TABLE dbo.Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) DEFAULT 'admin',
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Create index on email for faster lookups
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_Users_Email' AND object_id = OBJECT_ID('dbo.Users'))
CREATE INDEX IX_Users_Email ON dbo.Users(email);
GO

-- =============================================
-- Default Admin User
-- =============================================
-- The default admin user will be created automatically by the server
-- when it starts for the first time (if the table is empty).
--
-- Default Credentials:
-- Email: admin@admin.com
-- Password: admin123
--
-- Note: The password is hashed using a simple hash function in server.js
-- In production, you should use bcrypt or similar secure hashing.
-- =============================================

-- Verify table creation
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Users'
ORDER BY ORDINAL_POSITION;
GO

PRINT '✅ Users table created successfully!';
PRINT '📝 The default admin user will be created automatically when the server starts.';
PRINT '📧 Default Email: admin@admin.com';
PRINT '🔑 Default Password: admin123';
GO
