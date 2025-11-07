-- Create database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'MyProfileDB')
BEGIN
    CREATE DATABASE MyProfileDB;
END
GO

USE MyProfileDB;
GO

-- Create PortfolioData table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PortfolioData' AND xtype='U')
BEGIN
    CREATE TABLE PortfolioData (
        id INT PRIMARY KEY IDENTITY(1,1),
        section NVARCHAR(50) NOT NULL UNIQUE,
        data NVARCHAR(MAX) NOT NULL,
        updatedAt DATETIME DEFAULT GETDATE()
    );
    
    PRINT 'PortfolioData table created successfully';
END
ELSE
BEGIN
    PRINT 'PortfolioData table already exists';
END
GO

