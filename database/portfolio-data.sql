-- =============================================
-- PortfolioData Table
-- =============================================
-- This script creates the PortfolioData table for storing portfolio content
-- The table will be created automatically by the server when it starts

USE MyProfileDB;
GO

-- Drop table if exists (for testing/recreation purposes)
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'PortfolioData' AND TABLE_SCHEMA = 'dbo')
    DROP TABLE dbo.PortfolioData;
GO

-- Create PortfolioData table in dbo schema
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'PortfolioData' AND TABLE_SCHEMA = 'dbo')
CREATE TABLE dbo.PortfolioData (
    id INT PRIMARY KEY IDENTITY(1,1),
    section NVARCHAR(50) NOT NULL UNIQUE,
    data NVARCHAR(MAX) NOT NULL,
    updatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Verify table creation
SELECT 
    TABLE_SCHEMA,
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'PortfolioData' AND TABLE_SCHEMA = 'dbo'
ORDER BY ORDINAL_POSITION;
GO

PRINT '✅ PortfolioData table created successfully in dbo schema!';
GO

