@echo off
REM ClipSync Windows 安装脚本

setlocal enabledelayedexpansion

echo ╔════════════════════════════════════════╗
echo ║     ClipSync 安装脚本 v1.0             ║
echo ╚════════════════════════════════════════╝
echo.

REM 检查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到 Node.js
    echo 请访问 https://nodejs.org/ 下载安装
    pause
    exit /b 1
)

echo [√] Node.js 已安装
node -v

REM 检查 npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到 npm
    pause
    exit /b 1
)

echo [√] npm 已安装
npm -v

REM 检查 MongoDB 或 Docker
where mongod >nul 2>nul
set MONGO_EXISTS=%ERRORLEVEL%

where docker >nul 2>nul
set DOCKER_EXISTS=%ERRORLEVEL%

if %MONGO_EXISTS% NEQ 0 (
    if %DOCKER_EXISTS% NEQ 0 (
        echo [错误] 未检测到 MongoDB 或 Docker
        echo 请安装其中之一：
        echo   MongoDB: https://www.mongodb.com/download-center/community
        echo   Docker: https://www.docker.com/products/docker-desktop
        pause
        exit /b 1
    )
)

if %DOCKER_EXISTS% EQU 0 (
    echo [√] Docker 已安装
    docker -v
) else (
    echo [√] MongoDB 已安装
)

echo.
echo [→] 安装后端依赖...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 后端依赖安装失败
    pause
    exit /b 1
)
echo [√] 后端依赖安装完成

echo.
echo [→] 安装前端依赖...
cd ..\client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 前端依赖安装失败
    pause
    exit /b 1
)
echo [√] 前端依赖安装完成

cd ..

echo.
echo [→] 配置环境变量...

REM 后端配置
if not exist server\.env (
    copy server\.env.example server\.env
    echo [√] 后端环境配置完成
) else (
    echo [i] 后端 .env 文件已存在，跳过
)

REM 前端配置
if not exist client\.env (
    copy client\.env.example client\.env
    echo [√] 前端环境配置完成
) else (
    echo [i] 前端 .env 文件已存在，跳过
)

echo.
echo [→] 启动 MongoDB...

if %DOCKER_EXISTS% EQU 0 (
    docker ps -a | findstr mongodb >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        docker start mongodb
        echo [√] MongoDB 容器已启动
    ) else (
        docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:latest
        echo [√] MongoDB 容器创建并启动
    )
) else (
    net start MongoDB
    echo [√] MongoDB 服务已启动
)

echo.
echo [→] 创建启动脚本...

REM 创建启动脚本
(
echo @echo off
echo echo 启动 ClipSync...
echo.
echo start "ClipSync Server" cmd /k "cd server && npm run dev"
echo timeout /t 3 /nobreak ^>nul
echo start "ClipSync Client" cmd /k "cd client && npm run dev"
echo.
echo echo [√] 后端运行在: http://localhost:5000
echo echo [√] 前端运行在: http://localhost:5173
echo.
echo pause
) > start.bat

echo [√] 启动脚本创建完成 (start.bat)

echo.
echo ╔════════════════════════════════════════╗
echo ║      安装完成！                         ║
echo ╚════════════════════════════════════════╝
echo.
echo 下一步：
echo   1. 启动应用: start.bat
echo   2. 访问: http://localhost:5173
echo   3. 注册账号并开始使用
echo.
echo 手动启动：
echo   后端: cd server ^&^& npm run dev
echo   前端: cd client ^&^& npm run dev
echo.
echo 配置 OAuth（可选）：
echo   编辑 server\.env 添加 OAuth 凭据
echo   详见: INSTALLATION.md
echo.

pause
