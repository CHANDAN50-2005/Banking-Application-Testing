@echo off
title Nova Bank - Banking Application Testing
color 0b

cd /d "%~dp0"

:MENU
cls
echo =======================================================================
echo   NOVA BANK - BANKING APPLICATION TESTING
echo   Software Testing (23SCS743) Mini Project - Srinivas University
echo   Students: Chandan Gouda, Chinna B, Guruprasad Naik, Hotur Gargeya Datta
echo =======================================================================
echo.
echo   Select an option to run:
echo.
echo   [1] Start Web Server and Open Banking Portal (http://localhost:3000)
echo   [2] Run Python Automated Test Suite (45 Tests - Chapter 4)
echo   [3] Run Java Test Suite (24 Tests - Chapter 2)
echo   [4] Open Offline Web App in Browser directly (No Server needed)
echo   [5] Exit
echo.
echo =======================================================================
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto START_SERVER
if "%choice%"=="2" goto RUN_PYTHON
if "%choice%"=="3" goto RUN_JAVA
if "%choice%"=="4" goto OPEN_OFFLINE
if "%choice%"=="5" exit
echo Invalid selection. Please try again.
pause
goto MENU

:START_SERVER
cls
echo Starting Nova Bank Web Server...
echo Press Ctrl+C in this window anytime to stop the server.
echo.
start http://localhost:3000
node server.js
pause
goto MENU

:RUN_PYTHON
cls
echo Running Python Test Suite...
echo.
python python/test_suite.py
echo.
pause
goto MENU

:RUN_JAVA
cls
echo Compiling and running Java Test Suite...
echo.
javac java/*.java
java -cp java BankingTest
echo.
pause
goto MENU

:OPEN_OFFLINE
cls
echo Opening Nova Bank directly in your browser (Offline Mode)...
start "" "%~dp0public\index.html"
goto MENU
