@echo off
title Import MySQL Database - Banking Application Testing
color 0a

echo =======================================================================
echo   NOVA BANK - MYSQL DATABASE IMPORTER
echo   Software Testing (23SCS743) Mini Project - Srinivas University
echo =======================================================================
echo.

set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

if not exist %MYSQL_PATH% (
    echo [ERROR] mysql.exe not found at standard path.
    echo Please ensure MySQL Server 8.0 is installed or run with default in-memory mode.
    pause
    exit /b
)

echo MySQL Server 8.0 found!
echo This script will import database/schema.sql into MySQL.
echo.
set /p MYSQL_PWD="Enter your MySQL root password (press Enter if no password): "

echo.
echo Importing database/schema.sql into MySQL...
if "%MYSQL_PWD%"=="" (
    %MYSQL_PATH% -u root < "%~dp0schema.sql"
) else (
    %MYSQL_PATH% -u root -p%MYSQL_PWD% < "%~dp0schema.sql"
)

if %errorlevel% equ 0 (
    echo.
    echo =======================================================================
    echo [SUCCESS] Database 'banking_testing_db' created and populated!
    echo All tables (users, accounts, beneficiaries, transactions, test_cases)
    echo are successfully created with 45 test records.
    echo =======================================================================
) else (
    echo.
    echo [NOTICE] If the password was incorrect, you can re-run this script.
    echo NOTE: The Nova Bank web application works 100%% without MySQL as well!
)

pause

