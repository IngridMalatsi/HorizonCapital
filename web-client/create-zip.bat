@echo off
echo ========================================================
echo   HorizonCapital — Create Clean Shareable Zip Archive
echo ========================================================
echo.
echo Packaging project files (excluding node_modules, dist, and .git)...
echo.

powershell -Command "Get-ChildItem -Path . -Exclude 'node_modules','dist','.git','*.zip' | Compress-Archive -DestinationPath '..\HorizonCapital-Shareable.zip' -Force"

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Clean zip file created at:
    echo   ..\HorizonCapital-Shareable.zip
    echo.
    echo This zip file is lightweight (~100 KB) and ready to email, 
    echo upload to Slack/WhatsApp, or share on Google Drive/OneDrive!
    echo.
) else (
    echo.
    echo [ERROR] Failed to create zip file.
    echo.
)
pause
