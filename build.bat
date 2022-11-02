@ECHO OFF
setlocal enabledelayedexpansion
set n=0
:loop
set rand=
set /A rand=%RANDOM%%%16+1
set /A n=n+1
if %rand%==1 set rand!n!=a
if %rand%==2 set rand!n!=b
if %rand%==3 set rand!n!=c
if %rand%==4 set rand!n!=d
if %rand%==5 set rand!n!=e
if %rand%==6 set rand!n!=f
if %rand%==7 set rand!n!=1
if %rand%==8 set rand!n!=2
if %rand%==9 set rand!n!=3
if %rand%==10 set rand!n!=4
if %rand%==11 set rand!n!=5
if %rand%==12 set rand!n!=6
if %rand%==13 set rand!n!=7
if %rand%==14 set rand!n!=8
if %rand%==15 set rand!n!=9
if %rand%==16 set rand!n!=0
if !n!==11 goto end
if !n! LSS 11 goto loop
:end

set name=%1
set icon=%2
set npath=%3
set rompath=%4
set id=01%rand1%%rand2%%rand3%%rand4%%rand5%%rand6%%rand7%%rand8%%rand9%%rand10%%rand11%000

echo.
echo Building...
echo ID: %id%
echo Name: %name%
echo Icon: %icon%
echo Path: %npath%
echo.

copy /Y "%icon%" "control/icon_AmericanEnglish.dat" >NUL
echo|set /p=sdmc:%npath% "sdmc:%rompath%"> romfs/nextArgv
echo|set /p="sdmc:%npath%"> romfs/nextNroPath

hacbrewpack.exe --titleid %id% --titlename %name% --titlepublisher ZZZ --nspdir NSP -k ./prod.keys 

rmdir /S/Q hacbrewpack_backup
del control/icon_AmericanEnglish.dat

echo.

echo "%id%.nsp is ready!"

pause

exit