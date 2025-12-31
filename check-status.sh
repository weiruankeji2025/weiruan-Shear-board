#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║        剪切板同步服务 - 状态检查                       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# 检查 Node.js
echo "1️⃣  Node.js 环境"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js: $NODE_VERSION"
else
    echo "   ❌ Node.js 未安装"
fi

# 检查 npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "   ✅ npm: $NPM_VERSION"
else
    echo "   ❌ npm 未安装"
fi
echo ""

# 检查依赖安装
echo "2️⃣  依赖安装状态"
if [ -d "server/node_modules" ]; then
    echo "   ✅ 后端依赖已安装"
else
    echo "   ❌ 后端依赖未安装 (运行: cd server && npm install)"
fi

if [ -d "client/node_modules" ]; then
    echo "   ✅ 前端依赖已安装"
else
    echo "   ❌ 前端依赖未安装 (运行: cd client && npm install)"
fi
echo ""

# 检查配置文件
echo "3️⃣  配置文件"
if [ -f "server/.env" ]; then
    echo "   ✅ server/.env 存在"
    
    # 检查 MongoDB 配置
    MONGO_URI=$(grep "^MONGODB_URI=" server/.env 2>/dev/null | cut -d'=' -f2-)
    if [[ "$MONGO_URI" == *"localhost"* ]]; then
        echo "   ⚠️  MongoDB 配置为 localhost（VPS 无法使用）"
        echo "      建议运行: ./configure-mongodb.sh"
    elif [[ "$MONGO_URI" == mongodb+srv://* ]]; then
        echo "   ✅ MongoDB Atlas 已配置"
    else
        echo "   ❓ MongoDB URI: $MONGO_URI"
    fi
    
    # 检查 JWT Secret
    JWT_SECRET=$(grep "^JWT_SECRET=" server/.env 2>/dev/null | cut -d'=' -f2-)
    if [ -n "$JWT_SECRET" ]; then
        echo "   ✅ JWT Secret 已配置"
    else
        echo "   ⚠️  JWT Secret 未配置"
    fi
else
    echo "   ❌ server/.env 不存在"
fi

if [ -f "client/.env" ]; then
    echo "   ✅ client/.env 存在"
else
    echo "   ⚠️  client/.env 不存在（可选）"
fi
echo ""

# 检查服务运行状态
echo "4️⃣  服务运行状态"
if lsof -i :5000 &> /dev/null || ss -tulpn 2>/dev/null | grep -q ":5000"; then
    echo "   ✅ 后端服务运行中 (端口 5000)"
else
    echo "   ❌ 后端服务未运行"
fi

if lsof -i :5173 &> /dev/null || ss -tulpn 2>/dev/null | grep -q ":5173"; then
    echo "   ✅ 前端服务运行中 (端口 5173)"
else
    echo "   ❌ 前端服务未运行"
fi
echo ""

# 检查公网 IP
echo "5️⃣  网络信息"
PUBLIC_IP=$(curl -4 -s --connect-timeout 5 ifconfig.me 2>/dev/null || echo "无法获取")
echo "   公网 IPv4: $PUBLIC_IP"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 快速操作："
echo "   配置 MongoDB: ./configure-mongodb.sh"
echo "   启动后端:     cd server && npm run dev"
echo "   启动前端:     cd client && npm run dev"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
