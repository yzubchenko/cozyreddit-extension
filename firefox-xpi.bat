IF EXIST %1 (
    START /B cmd.exe /C "%1 & cfx xpi --pkgdir=%2 --output-file=%3\%4"
) ELSE (
    ECHO Incorrect Mozilla SDK 'activate.bat' location! >> %3\error.log
)

