@echo off
echo ===============================================
echo    Edu-Ride - Find Your Computer's IP Address
echo ===============================================
echo.

echo Your computer's network information:
echo.

ipconfig | findstr /i "IPv4"

echo.
echo ===============================================
echo INSTRUCTIONS:
echo ===============================================
echo.
echo 1. Look for "IPv4 Address" above (e.g., 192.168.1.100)
echo.
echo 2. Open: mobile\app\config\api.js
echo.
echo 3. Find the line:
echo    const PHYSICAL_DEVICE_URL = 'http://192.168.1.100:3000';
echo.
echo 4. Replace 192.168.1.100 with YOUR IPv4 address
echo.
echo 5. Save the file and restart your mobile app
echo.
echo ===============================================
echo.

pause
