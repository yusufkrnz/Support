@echo off
echo Initializing database with demo users...
mysql -u root -prootroot < insert_users.sql
echo Database initialization completed. 