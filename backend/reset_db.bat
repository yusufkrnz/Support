@echo off
echo Resetting database and initializing with demo users...

REM Set MySQL credentials
set MYSQL_USER=root
set MYSQL_PASS=rootroot

REM Go to resources directory
cd src\main\resources

REM Run SQL script
mysql -u %MYSQL_USER% -p%MYSQL_PASS% < insert_users.sql

echo.
echo Database initialization completed.
echo Demo users created:
echo   - admin@support.com (ADMIN)
echo   - manager@support.com (MANAGER)
echo   - customer@support.com (CUSTOMER)
echo.
echo All user passwords: password123
echo.

pause 