@echo off
setlocal enabledelayedexpansion

REM Renk tanımlamaları
set RED=31
set GREEN=32
set YELLOW=33

REM Fonksiyon: Renkli yazı
:colorEcho
set "msg=%~2"
call :setColor %~1
echo %msg%
call :resetColor
exit /b

REM Renk ayarla
:setColor
for /F "tokens=1,2 delims=#" %%a in ('"prompt #$H#$E# & echo on & for %%b in (1) do rem"') do (
  set "DEL=%%a"
)
<nul set /p ".=%DEL%" > "%~2"
findstr /v /a:%~1 /R "^$" "%~2" nul
del "%~2" > nul 2>&1
exit /b

REM Renk sıfırla
:resetColor
set "DEL="
exit /b

REM Yardım mesajı
:showHelp
call :colorEcho %YELLOW% "Atasun Chatbot Yonetim Sistemi"
echo.
echo Kullanim: manage.bat [KOMUT]
echo.
echo Komutlar:
echo   start         Tum servisleri baslatir
echo   stop          Tum servisleri durdurur
echo   restart       Tum servisleri yeniden baslatir
echo   status        Servislerin durumunu gosterir
echo   logs [servis] Spesifik servisin loglarini gosterir
echo   update        Tum servisleri gunceller
echo   help          Bu yardim mesajini gosterir
echo.
echo Ornekler:
echo   manage.bat start           # Tum sistemi baslatir
echo   manage.bat logs backend    # Backend loglarini gorur
exit /b

REM Servisleri başlat
:startServices
call :colorEcho %GREEN% "Tum servisler baslatiliyor..."
docker-compose up -d
call :colorEcho %GREEN% "Sistem baslatildi! Asagidaki URL'lerden erisebilirsiniz:"
call :colorEcho %YELLOW% "  Frontend: http://localhost:3000"
call :colorEcho %YELLOW% "  Backend API: http://localhost:8081/api"
call :colorEcho %YELLOW% "  AI Service: http://localhost:8000"
call :colorEcho %YELLOW% "  PhpMyAdmin: http://localhost:8081"
exit /b

REM Servisleri durdur
:stopServices
call :colorEcho %YELLOW% "Tum servisler durduruluyor..."
docker-compose down
call :colorEcho %GREEN% "Tum servisler durduruldu"
exit /b

REM Servisleri yeniden başlat
:restartServices
call :colorEcho %YELLOW% "Tum servisler yeniden baslatiliyor..."
docker-compose restart
call :colorEcho %GREEN% "Tum servisler yeniden baslatildi"
exit /b

REM Servis durumlarını göster
:showStatus
call :colorEcho %GREEN% "Servis durumlari:"
docker-compose ps
exit /b

REM Servis loglarını göster
:showLogs
set service=%~1
if "%service%"=="" (
    call :colorEcho %RED% "Hangi servisin loglarini gormek istediginizi belirtmelisiniz"
    echo Ornek: manage.bat logs backend
    echo Kullanilabilir servisler: backend, frontend, ai-service, redis, mysql, ollama, phpmyadmin
    exit /b 1
)

call :colorEcho %GREEN% "%service% servisi icin loglar gosteriliyor..."
docker-compose logs --tail=100 -f %service%
exit /b

REM Servisleri güncelle
:updateServices
call :colorEcho %YELLOW% "Tum servisler guncellenip yeniden olusturuluyor..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d
call :colorEcho %GREEN% "Guncelleme tamamlandi!"
exit /b

REM Ana menü
if "%1"=="start" (
    call :startServices
) else if "%1"=="stop" (
    call :stopServices
) else if "%1"=="restart" (
    call :restartServices
) else if "%1"=="status" (
    call :showStatus
) else if "%1"=="logs" (
    call :showLogs %2
) else if "%1"=="update" (
    call :updateServices
) else (
    call :showHelp
)

endlocal 