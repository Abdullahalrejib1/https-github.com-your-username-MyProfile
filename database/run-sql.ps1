# PowerShell Script to Execute users.sql in SQL Server
# Run this script to create the Users table in the database

$ServerName = "ABDULLAH\SQLEXPRESS"
$DatabaseName = "MyProfileDB"
$SqlFile = "database\users.sql"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Creating Users Table in Database" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if sqlcmd is available
try {
    $sqlcmdVersion = sqlcmd -? 2>&1 | Select-String "Version"
    Write-Host "✅ SQL Server Command Line Tools found" -ForegroundColor Green
} catch {
    Write-Host "❌ SQL Server Command Line Tools not found" -ForegroundColor Red
    Write-Host "Please install SQL Server Command Line Tools or use SQL Server Management Studio" -ForegroundColor Yellow
    exit 1
}

# Check if SQL file exists
if (-not (Test-Path $SqlFile)) {
    Write-Host "❌ SQL file not found: $SqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "📁 SQL File: $SqlFile" -ForegroundColor Yellow
Write-Host "🖥️  Server: $ServerName" -ForegroundColor Yellow
Write-Host "💾 Database: $DatabaseName" -ForegroundColor Yellow
Write-Host ""

# Execute SQL file
Write-Host "⏳ Executing SQL script..." -ForegroundColor Yellow

try {
    sqlcmd -S $ServerName -d $DatabaseName -i $SqlFile -E
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Users table created successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Default Admin Credentials:" -ForegroundColor Cyan
        Write-Host "  Email: admin@admin.com" -ForegroundColor White
        Write-Host "  Password: admin123" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "❌ Error executing SQL script. Exit code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Use SQL Server Management Studio to run the SQL file manually" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

