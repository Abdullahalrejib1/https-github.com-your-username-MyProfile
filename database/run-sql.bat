@echo off
REM Batch Script to Execute users.sql in SQL Server
REM Run this script to create the Users table in the database

echo ========================================
echo   Creating Users Table in Database
echo ========================================
echo.

set SERVER_NAME=ABDULLAH\SQLEXPRESS
set DATABASE_NAME=MyProfileDB
set SQL_FILE=database\users.sql

echo SQL File: %SQL_FILE%
echo Server: %SERVER_NAME%
echo Database: %DATABASE_NAME%
echo.

REM Check if SQL file exists
if not exist "%SQL_FILE%" (
    echo Error: SQL file not found: %SQL_FILE%
    pause
    exit /b 1
)

echo Executing SQL script...
echo.

REM Execute SQL file using sqlcmd
sqlcmd -S %SERVER_NAME% -d %DATABASE_NAME% -i %SQL_FILE% -E

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Users table created successfully!
    echo ========================================
    echo.
    echo Default Admin Credentials:
    echo   Email: admin@admin.com
    echo   Password: admin123
    echo.
) else (
    echo.
    echo Error executing SQL script.
    echo.
    echo Alternative: Use SQL Server Management Studio to run the SQL file manually
    echo.
)

pause

